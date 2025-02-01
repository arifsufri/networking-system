import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
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

      res.status(200).json(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, date, location, description, capacity } = req.body;

      // Validate required fields
      if (!name || !date || !location || !capacity) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Create the event
      const event = await prisma.event.create({
        data: {
          name,
          date: new Date(date), // Convert string to Date object
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
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const { name, date, location, description, capacity } = req.body;

      // Validate required fields
      if (!name || !date || !location || !capacity) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const event = await prisma.event.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          date: new Date(date),
          location,
          description,
          capacity: parseInt(capacity, 10),
        },
      });

      res.status(200).json(event);
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 