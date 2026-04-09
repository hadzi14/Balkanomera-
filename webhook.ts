// api/payment/webhook.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin, updateUserSubscription } from '../../src/services/supabase';
import { verifyPaddleWebhook } from '../../src/services/paddle';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get signature from headers
    const signature = req.headers['paddle-signature'] as string;
    
    if (!signature) {
      return res.status(401).json({ error: 'Missing signature' });
    }

    // Verify webhook signature
    const rawBody = JSON.stringify(req.body);
    const isValid = verifyPaddleWebhook(
      signature,
      rawBody,
      process.env.PADDLE_WEBHOOK_SECRET!
    );

    if (!isValid) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { event_type, data } = req.body;

    console.log('Paddle webhook received:', event_type);

    // Handle different event types
    switch (event_type) {
      case 'subscription.created':
        await handleSubscriptionCreated(data);
        break;

      case 'subscription.updated':
        await handleSubscriptionUpdated(data);
        break;

      case 'subscription.canceled':
        await handleSubscriptionCanceled(data);
        break;

      case 'payment.succeeded':
        await handlePaymentSucceeded(data);
        break;

      case 'payment.failed':
        await handlePaymentFailed(data);
        break;

      default:
        console.log('Unhandled webhook event:', event_type);
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function handleSubscriptionCreated(data: any) {
  const userId = data.custom_data?.user_id;
  
  if (!userId) {
    console.error('No user_id in subscription data');
    return;
  }

  // Update user subscription status
  await updateUserSubscription(userId, 'active');

  console.log(`Subscription created for user ${userId}`);
}

async function handleSubscriptionUpdated(data: any) {
  const userId = data.custom_data?.user_id;
  const status = data.status;

  if (!userId) return;

  // Map Paddle status to our status
  let newStatus: 'active' | 'canceled' | 'past_due' | 'none';
  
  switch (status) {
    case 'active':
      newStatus = 'active';
      break;
    case 'canceled':
    case 'deleted':
      newStatus = 'canceled';
      break;
    case 'past_due':
      newStatus = 'past_due';
      break;
    default:
      newStatus = 'none';
  }

  await updateUserSubscription(userId, newStatus);

  console.log(`Subscription updated for user ${userId}: ${newStatus}`);
}

async function handleSubscriptionCanceled(data: any) {
  const userId = data.custom_data?.user_id;

  if (!userId) return;

  await updateUserSubscription(userId, 'canceled');

  console.log(`Subscription canceled for user ${userId}`);
}

async function handlePaymentSucceeded(data: any) {
  const userId = data.custom_data?.user_id;
  const amount = data.amount;
  const currency = data.currency;

  console.log(`Payment succeeded: €${amount} ${currency} for user ${userId}`);

  // Log payment in database (optional)
  // Could create a payments table to track all transactions
}

async function handlePaymentFailed(data: any) {
  const userId = data.custom_data?.user_id;

  if (!userId) return;

  // Update to past_due status
  await updateUserSubscription(userId, 'past_due');

  console.log(`Payment failed for user ${userId}`);

  // Could send email notification here
}
