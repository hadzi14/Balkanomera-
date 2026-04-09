// api/telegram/verify.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../src/services/supabase';

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
    const { passportId, telegramId, username } = req.body;

    if (!passportId || !telegramId) {
      return res.status(400).json({ 
        error: 'Passport ID i Telegram ID su obavezni' 
      });
    }

    // Find user by passport ID
    const { data: user, error: findError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('passport_id', passportId)
      .single();

    if (findError || !user) {
      return res.status(404).json({ 
        success: false,
        error: 'Passport ID nije pronađen' 
      });
    }

    // Check if subscription is active
    if (user.subscription_status !== 'active') {
      return res.status(403).json({ 
        success: false,
        error: 'Pretplata nije aktivna' 
      });
    }

    // Check if already verified
    if (user.telegram_joined) {
      return res.status(400).json({ 
        success: false,
        error: 'Već si verifikovan' 
      });
    }

    // Update user with Telegram info
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        telegram_joined: true,
        telegram_id: telegramId,
        telegram_username: username,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.status(200).json({
      success: true,
      message: 'Verifikacija uspešna!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        passport_id: updatedUser.passport_id,
      },
    });
  } catch (error: any) {
    console.error('Telegram verification error:', error);
    res.status(500).json({
      error: 'Greška pri verifikaciji',
      details: error.message,
    });
  }
}
