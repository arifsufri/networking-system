import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userId = req.headers['user-id'];
    const userRole = req.headers['user-role'];
    
    console.log('API received headers:', {
      userId,
      userRole
    });

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Always fetch all users but with limited fields for non-admin
    const users = await prisma.user.findMany({
      select: {
        id: true,
        createdAt: true,
        ...(userRole === 'ADMIN' && {
          fullName: true,
          email: true,
          role1: true,
          role2: true,
          phoneNumber: true,
        }),
      },
    });

    console.log('API fetched users:', users);
    console.log('User role:', userRole);
    console.log('Response being sent:', users);

    res.status(200).json(users);
    
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
} 