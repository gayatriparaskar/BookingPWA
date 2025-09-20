import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock staff data
const staff = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@salon.com',
    phone: '9876543210',
    role: 'Hair Stylist',
    specialty: 'Hair Cutting & Coloring',
    rating: 4.8,
    experience_years: 5,
    bio: 'Expert in modern haircuts and hair coloring techniques',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Emily Davis',
    email: 'emily@salon.com',
    phone: '8765432109',
    role: 'Beauty Therapist',
    specialty: 'Facial Treatments',
    rating: 4.9,
    experience_years: 7,
    bio: 'Specialized in advanced facial treatments and skincare',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Lisa Chen',
    email: 'lisa@salon.com',
    phone: '7654321098',
    role: 'Nail Technician',
    specialty: 'Manicure & Pedicure',
    rating: 4.7,
    experience_years: 3,
    bio: 'Creative nail artist with expertise in nail art and treatments',
    is_active: true,
    created_at: new Date().toISOString()
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    res.json({
      success: true,
      data: staff
    });
  } catch (error) {
    console.error('Staff error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
