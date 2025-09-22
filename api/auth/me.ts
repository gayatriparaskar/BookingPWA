import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

// In-memory user storage (replace with actual database in production)
interface User {
  id: string;
  mobile: string;
  password: string; // In production, this should be hashed
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// In-memory storage for users
const users: User[] = [
  {
    id: '1',
    mobile: '9876543210',
    password: 'admin123', // In production, hash this
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    mobile: '8765432109',
    password: 'user123', // In production, hash this
    name: 'Test User',
    role: 'user',
    createdAt: new Date().toISOString()
  }
];

// Simple token storage (in production, use proper JWT with secret)
const userTokens = new Map<string, string>(); // token -> userId

// Helper function to find user by ID
const findUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Helper function to create user response (without password)
const createUserResponse = (user: User) => ({
  id: user.id,
  mobile: user.mobile,
  name: user.name,
  role: user.role,
  createdAt: user.createdAt
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const userId = userTokens.get(token);
    if (!userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }

    const user = findUserById(userId);
    if (!user) {
      return res.status(403).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: createUserResponse(user)
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
