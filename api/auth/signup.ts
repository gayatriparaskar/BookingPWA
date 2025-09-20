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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { mobile, password, name } = req.body;

    // Validation
    if (!mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number and password are required'
      });
    }

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
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

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = findUserByMobile(mobile);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this mobile number already exists'
      });
    }

    // Create new user
    const newUser: User = {
      id: (users.length + 1).toString(),
      mobile,
      password, // In production, hash this password
      name: name.trim(),
      role: 'user', // Default role
      createdAt: new Date().toISOString()
    };

    // Add user to storage
    users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: createUserResponse(newUser),
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
