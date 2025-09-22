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

// Helper function to generate a simple token
const generateToken = (userId: string): string => {
  const token = crypto.randomBytes(32).toString('hex');
  userTokens.set(token, userId);
  return token;
};

// Helper function to find user by mobile
const findUserByMobile = (mobile: string): User | undefined => {
  return users.find(user => user.mobile === mobile);
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

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { mobile, password } = req.body;

    // Validation
    if (!mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number and password are required'
      });
    }

    // Validate mobile number format
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile number format'
      });
    }

    // Find user
    const user = findUserByMobile(mobile);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid mobile number or password'
      });
    }

    // In production, use proper password hashing comparison
    // For demo purposes, we're using plain text comparison
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid mobile number or password'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return success response
    res.json({
      success: true,
      message: 'Login successful',
      user: createUserResponse(user),
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
