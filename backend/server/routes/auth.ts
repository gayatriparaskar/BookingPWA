import { Request, Response } from 'express';
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

// Helper function to hash password (simplified - use bcrypt in production)
const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Helper function to verify password (simplified)
const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
}; 

// Helper function to find user by mobile
const findUserByMobile = (mobile: string): User | undefined => {
  return users.find(user => user.mobile === mobile);
};

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

// Middleware to verify authentication token
export const authenticateToken = (req: Request, res: Response, next: any) => {
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

  // Add user to request object
  (req as any).user = createUserResponse(user);
  next();
};

// Login endpoint
export const login = (req: Request, res: Response) => {
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
};

// Signup endpoint
export const signup = (req: Request, res: Response) => {
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
};

// Get current user (protected route)
export const getCurrentUser = (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Logout endpoint
export const logout = (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      userTokens.delete(token);
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all users (admin only)
export const getAllUsers = (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;
    
    if (currentUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const allUsers = users.map(user => createUserResponse(user));
    
    res.json({
      success: true,
      users: allUsers
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
