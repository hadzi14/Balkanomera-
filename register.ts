// api/auth/register.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin, createUser } from '../../src/services/supabase';
import { sendWelcomeEmail } from '../../src/services/email';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
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
    const { name, email, passportId } = req.body;

    // Validation
    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'Ime mora imati minimum 2 karaktera' });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Nevalidna email adresa' });
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email već postoji' });
    }

    // Create user
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passport_id: passportId,
      subscription_status: 'none' as const,
      test_completed: false,
      telegram_joined: false,
      joined_at: new Date().toISOString(),
    };

    const user = await createUser(userData);

    // Send welcome email (async, don't wait)
    sendWelcomeEmail({
      name: user.name,
      email: user.email,
      passportId: user.passport_id,
      testLink: `${process.env.FRONTEND_URL}/test`,
    }).catch((error) => {
      console.error('Failed to send welcome email:', error);
    });

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        passport_id: user.passport_id,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Greška pri registraciji',
      details: error.message,
    });
  }
}
