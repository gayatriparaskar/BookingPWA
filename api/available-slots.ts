import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock available slots data
const generateAvailableSlots = (date: string, serviceId: string) => {
  const slots = [];
  const startHour = 9;
  const endHour = 18;
  
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      available: Math.random() > 0.3 // Random availability for demo
    });
  }
  
  return slots;
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { date, service_id } = req.query;

    if (!date || !service_id) {
      return res.status(400).json({
        success: false,
        message: 'Date and service_id are required'
      });
    }

    const slots = generateAvailableSlots(date as string, service_id as string);

    res.json({
      success: true,
      data: slots
    });
  } catch (error) {
    console.error('Available slots error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
