import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock services data
const services = [
  {
    id: '1',
    name: 'Haircut & Styling',
    description: 'Professional haircut and styling',
    duration_minutes: 60,
    price: 500,
    category: 'Hair',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Facial Treatment',
    description: 'Deep cleansing facial treatment',
    duration_minutes: 90,
    price: 800,
    category: 'Skincare',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Manicure',
    description: 'Complete nail care and polish',
    duration_minutes: 45,
    price: 300,
    category: 'Nails',
    is_active: true,
    created_at: new Date().toISOString()
  }
];

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
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
