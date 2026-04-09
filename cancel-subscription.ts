// api/payment/cancel-subscription.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID je obavezan' });
    }

    // Call Paddle API to cancel subscription
    const response = await fetch(
      `https://api.paddle.com/subscriptions/${subscriptionId}/cancel`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          effective_from: 'next_billing_period', // Cancel at end of current period
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to cancel subscription');
    }

    const data = await response.json();

    res.status(200).json({
      success: true,
      message: 'Pretplata će biti otkazana na kraju trenutnog perioda',
      effective_from: data.data.scheduled_change?.effective_at,
    });
  } catch (error: any) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      error: 'Greška pri otkazivanju pretplate',
      details: error.message,
    });
  }
}
