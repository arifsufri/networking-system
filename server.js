import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(express.json());

// Global CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3039');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, user-id');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user || user.role2 !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Sign up endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, role1, role2 = 'USER' } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        role1,
        role2,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Sign in endpoint
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin only: Get all users
app.get('/api/users', isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        role1: true,
        role2: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin only: Update user role
app.put('/api/users/:id/role', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role2 } = req.body;

    if (!['ADMIN', 'USER'].includes(role2)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role2 },
      select: {
        id: true,
        fullName: true,
        email: true,
        role1: true,
        role2: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin only: Delete user
app.delete('/api/users/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/users/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, role1, role2, phoneNumber } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        fullName,
        email,
        role1,
        role2,
        phoneNumber,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role1: true,
        role2: true,
        phoneNumber: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        _count: {
          select: { participants: true },
        },
      },
    });

    const formattedEvents = events.map((event) => ({
      id: event.id,
      name: event.name,
      date: event.date.toISOString(),
      location: event.location,
      description: event.description,
      capacity: event.capacity,
      participantCount: event._count.participants,
    }));

    res.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { name, date, location, description, capacity } = req.body;

    const event = await prisma.event.create({
      data: {
        name,
        date: new Date(date),
        location,
        description,
        capacity: parseInt(capacity, 10),
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add participant to event
app.post('/api/participants', async (req, res) => {
  try {
    const { name, email, role, eventId } = req.body;

    // Validate required fields
    if (!name || !email || !role || !eventId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if participant already exists for this event
    const existingParticipant = await prisma.participant.findFirst({
      where: {
        email,
        eventId,
      },
    });

    if (existingParticipant) {
      return res.status(400).json({ message: 'You have already joined this event' });
    }

    // Check if event exists and has capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { participants: true },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event._count.participants >= event.capacity) {
      return res.status(400).json({ message: 'Event is at full capacity' });
    }

    // Create participant
    const participant = await prisma.participant.create({
      data: {
        name,
        email,
        role,
        eventId,
      },
    });

    res.status(201).json(participant);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'You have already joined this event' });
    }
    console.error('Error creating participant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all participants with event details
app.get('/api/participants', async (req, res) => {
  try {
    const participants = await prisma.participant.findMany({
      include: {
        event: {
          select: {
            id: true,
            name: true,
            date: true,
            location: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format dates and send response
    const formattedParticipants = participants.map(participant => ({
      ...participant,
      createdAt: participant.createdAt.toISOString(),
      event: {
        ...participant.event,
        date: participant.event.date.toISOString(),
      },
    }));

    res.json(formattedParticipants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add this endpoint to handle event deletion
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['user-id'];

    // Check if user exists and is admin
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { role2: true },
    });

    if (!user || user.role2 !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }

    // Delete all participants first due to foreign key constraints
    await prisma.participant.deleteMany({
      where: { eventId: parseInt(id) },
    });

    // Then delete the event
    await prisma.event.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

// Update event endpoint
app.put('/api/events/:id', async (req, res) => {
  console.log('Received PUT request for event:', req.params.id);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);

  try {
    const { id } = req.params;
    const userId = req.headers['user-id'];

    console.log('Processing update for event:', id, 'by user:', userId);

    // Check if user exists and is admin
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { role2: true },
    });

    console.log('User found:', user);

    if (!user || user.role2 !== 'ADMIN') {
      console.log('Authorization failed:', user);
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }

    const { name, date, location, description, capacity } = req.body;

    // Validate required fields
    if (!name || !date || !location || !capacity) {
      console.log('Missing required fields:', { name, date, location, capacity });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        name,
        date: new Date(date),
        location,
        description,
        capacity: parseInt(capacity),
      },
    });

    console.log('Successfully updated event:', updatedEvent);
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
});

app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
}); 