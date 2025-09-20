import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DemoResponse } from '../backend/shared/api';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const response: DemoResponse = {
    message: "Hello from Vercel serverless function",
  };
  res.status(200).json(response);
}
