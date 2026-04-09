// api/lottery/draw.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin, createLotteryDraw } from '../../src/services/supabase';
import { sendLotteryWinnerEmail } from '../../src/services/email';
import { notifyLotteryWinner } from '../../src/services/telegram';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check admin authorization
    const authHeader = req.headers.authorization;
    const adminKey = process.env.ADMIN_API_KEY;

    if (!authHeader || authHeader !== `Bearer ${adminKey}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { month } = req.body;

    if (!month) {
      return res.status(400).json({ error: 'Month je obavezan' });
    }

    // Get all active subscribers
    const { data: activeUsers, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, passport_id')
      .eq('subscription_status', 'active');

    if (usersError) throw usersError;

    if (!activeUsers || activeUsers.length === 0) {
      return res.status(400).json({ error: 'Nema aktivnih pretplatnika' });
    }

    // Calculate pool
    const totalPool = activeUsers.length * 2; // €2 per user
    const winnerAmount = totalPool * 0.1;
    const charityAmount = totalPool * 0.1;

    // Random winner selection
    const randomIndex = Math.floor(Math.random() * activeUsers.length);
    const winner = activeUsers[randomIndex];

    // Get shortlisted charity families
    const { data: charityFamilies, error: charityError } = await supabaseAdmin
      .from('charity_families')
      .select('id, family_name, story')
      .eq('status', 'shortlisted')
      .limit(3);

    if (charityError) throw charityError;

    if (!charityFamilies || charityFamilies.length === 0) {
      return res.status(400).json({ 
        error: 'Nema shortlisted porodica. Dodaj ih prvo u admin panelu.' 
      });
    }

    // Create lottery draw record
    const drawData = {
      month,
      draw_date: new Date().toISOString(),
      winner_user_id: winner.id,
      charity_family_id: null, // Winner will choose
      winner_amount: winnerAmount,
      charity_amount: charityAmount,
      total_pool: totalPool,
      status: 'drawn' as const,
    };

    const lotteryDraw = await createLotteryDraw(drawData);

    // Send email to winner
    await sendLotteryWinnerEmail({
      name: winner.name,
      email: winner.email,
      winAmount: winnerAmount,
      month,
      charityFamilies: charityFamilies.map(f => ({
        id: f.id,
        name: f.family_name,
        story: f.story,
      })),
    });

    // Send Telegram notification (if they have telegram_id)
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('telegram_id')
      .eq('id', winner.id)
      .single();

    if (userData?.telegram_id) {
      await notifyLotteryWinner(userData.telegram_id, {
        name: winner.name,
        amount: winnerAmount,
        month,
      });
    }

    res.status(200).json({
      success: true,
      draw: {
        id: lotteryDraw.id,
        month,
        winner: {
          id: winner.id,
          name: winner.name,
          passport_id: winner.passport_id,
        },
        winner_amount: winnerAmount,
        charity_amount: charityAmount,
        total_pool: totalPool,
        charity_families: charityFamilies,
      },
    });
  } catch (error: any) {
    console.error('Lottery draw error:', error);
    res.status(500).json({
      error: 'Greška pri izvlačenju lutrije',
      details: error.message,
    });
  }
}
