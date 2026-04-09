// src/services/paddle.ts
import { Paddle, initializePaddle } from '@paddle/paddle-js';

let paddleInstance: Paddle | null = null;

export async function getPaddle(): Promise<Paddle> {
  if (paddleInstance) return paddleInstance;

  paddleInstance = await initializePaddle({
    environment: import.meta.env.VITE_PADDLE_ENV as 'sandbox' | 'production',
    token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
  });

  return paddleInstance;
}

export interface CheckoutOptions {
  email: string;
  name: string;
  userId: string;
  passportId: string;
}

export async function openCheckout(options: CheckoutOptions) {
  const paddle = await getPaddle();

  const result = await paddle.Checkout.open({
    items: [
      {
        priceId: import.meta.env.VITE_PADDLE_PRICE_ID,
        quantity: 1,
      },
    ],
    customer: {
      email: options.email,
    },
    customData: {
      user_id: options.userId,
      name: options.name,
      passport_id: options.passportId,
    },
    successCallback: (data) => {
      console.log('Payment successful:', data);
      // Redirect to test page
      window.location.href = '/test';
    },
    closeCallback: () => {
      console.log('Checkout closed');
    },
  });

  return result;
}

export async function updatePaymentMethod(subscriptionId: string) {
  const paddle = await getPaddle();
  
  await paddle.Checkout.open({
    settings: {
      allowedPaymentMethods: ['card', 'paypal'],
    },
    transactionId: subscriptionId,
  });
}

export async function cancelSubscription(subscriptionId: string) {
  // This should be called from backend API endpoint
  // Frontend just triggers the API call
  const response = await fetch('/api/payment/cancel-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subscriptionId }),
  });

  if (!response.ok) {
    throw new Error('Failed to cancel subscription');
  }

  return await response.json();
}

// Webhook signature verification (backend only)
export function verifyPaddleWebhook(
  signature: string,
  requestBody: string,
  webhookSecret: string
): boolean {
  const crypto = require('crypto');
  
  const hmac = crypto.createHmac('sha256', webhookSecret);
  hmac.update(requestBody);
  const digest = hmac.digest('hex');

  return signature === digest;
}

// Process webhook events (backend)
export async function handlePaddleWebhook(eventType: string, eventData: any) {
  switch (eventType) {
    case 'subscription.created':
      // Update user subscription status to 'active'
      console.log('Subscription created:', eventData);
      break;

    case 'subscription.updated':
      // Update subscription details
      console.log('Subscription updated:', eventData);
      break;

    case 'subscription.canceled':
      // Update user subscription status to 'canceled'
      console.log('Subscription canceled:', eventData);
      break;

    case 'payment.succeeded':
      // Log successful payment
      console.log('Payment succeeded:', eventData);
      break;

    case 'payment.failed':
      // Update subscription status to 'past_due'
      console.log('Payment failed:', eventData);
      break;

    default:
      console.log('Unhandled webhook event:', eventType);
  }
}
