import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

// Middleware to check admin authentication
const isAdmin = async (req: NextApiRequest) => {
  const userId = req.headers['user-id'];
  console.log('Checking admin status for user:', userId);
  
  if (!userId) {
    console.log('No user ID provided');
    return false;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { role2: true },
    });
    console.log('Found user with role:', user?.role2);
    return user?.role2 === 'ADMIN';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS first
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3039');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, user-id'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('Request method:', req.method);
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);

    const { id } = req.query;
    console.log('Target user ID:', id);

    // Check admin authentication for both PUT and DELETE
    const isAdminUser = await isAdmin(req);
    console.log('Is admin user:', isAdminUser);
    
    if (!isAdminUser) {
      console.log('Unauthorized access attempt');
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (req.method === 'PUT') {
      const { fullName, email, role1, role2, phoneNumber } = req.body;
      console.log('Update payload:', { fullName, email, role1, role2, phoneNumber });

      const updatedUser = await prisma.user.update({
        where: { 
          id: Number(id) 
        },
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

      console.log('Successfully updated user:', updatedUser);
      return res.status(200).json({
        ...updatedUser,
        id: updatedUser.id.toString()
      });
    }

    if (req.method === 'DELETE') {
      console.log('Deleting user:', id);
      
      await prisma.user.delete({
        where: { 
          id: Number(id)
        },
      });
      
      console.log('User deleted successfully');
      return res.status(204).end();
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Detailed error:', error);
    return res.status(500).json({ 
      message: 'Operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 