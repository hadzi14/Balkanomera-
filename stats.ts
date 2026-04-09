// api/admin/stats.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../../src/services/supabase';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authorization (can be public or require API key)
    // For now, making it public for transparency

    // Get total users
    const { count: totalUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get active subscribers
    const { count: activeSubscribers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active');

    // Get users who completed test
    const { count: testCompletions } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('test_completed', true);

    // Get Telegram members
    const { count: telegramMembers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('telegram_joined', true);

    // Calculate revenue
    const monthlyRevenue = (activeSubscribers || 0) * 2;
    const lotteryPool = monthlyRevenue * 0.1;
    const charityPool = monthlyRevenue * 0.1;

    // Get total donated (sum of past lottery charity amounts)
    const { data: pastDraws } = await supabaseAdmin
      .from('lottery_draws')
      .select('charity_amount')
      .eq('status', 'paid');

    const totalDonated = pastDraws?.reduce(
      (sum, draw) => sum + (draw.charity_amount || 0),
      0
    ) || 0;

    // Get next draw date (first day of next month)
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Get recent winners
    const { data: recentDraws } = await supabaseAdmin
      .from('lottery_draws')
      .select(`
        month,
        winner_amount,
        users!lottery_draws_winner_user_id_fkey(name)
      `)
      .order('draw_date', { ascending: false })
      .limit(3);

    // Average test score
    const { data: testResults } = await supabaseAdmin
      .from('test_results')
      .select('percentage');

    const avgScore = testResults?.length
      ? Math.round(
          testResults.reduce((sum, r) => sum + r.percentage, 0) /
            testResults.length
        )
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers || 0,
          active_subscribers: activeSubscribers || 0,
          test_completed: testCompletions || 0,
          telegram_members: telegramMembers || 0,
        },
        revenue: {
          monthly: monthlyRevenue,
          lottery_pool: lotteryPool,
          charity_pool: charityPool,
          total_donated: totalDonated,
        },
        lottery: {
          next_draw: nextMonth.toISOString().split('T')[0],
          recent_winners: recentDraws?.map(d => ({
            month: d.month,
            winner: d.users?.name,
            amount: d.winner_amount,
          })) || [],
        },
        test: {
          average_score: avgScore,
          completions: testCompletions || 0,
        },
      },
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    res.status(500).json({
      error: 'Greška pri učitavanju statistika',
      details: error.message,
    });
  }
}
