// api/test/submit.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { saveTestResult } from '../../src/services/supabase';
import { sendTestCompletedEmail } from '../../src/services/email';

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
    const { userId, answers, score, percentage, title, titleEmoji } = req.body;

    // Validation
    if (!userId) {
      return res.status(400).json({ error: 'User ID je obavezan' });
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'Odgovori su obavezni' });
    }

    if (typeof score !== 'number' || typeof percentage !== 'number') {
      return res.status(400).json({ error: 'Score i percentage moraju biti brojevi' });
    }

    // Save test result
    const result = await saveTestResult(userId, {
      score,
      percentage,
      title,
      titleEmoji,
      answers,
    });

    // Send completion email (async)
    const user = result.userData;
    sendTestCompletedEmail({
      name: user.name,
      email: user.email,
      score,
      percentage,
      title,
      emoji: titleEmoji,
      passportLink: `${process.env.FRONTEND_URL}/passport/${user.passport_id}`,
      dashboardLink: `${process.env.FRONTEND_URL}/dashboard`,
    }).catch((error) => {
      console.error('Failed to send test completed email:', error);
    });

    res.status(200).json({
      success: true,
      result: {
        id: result.testData.id,
        score,
        percentage,
        title,
        completed_at: result.testData.completed_at,
      },
    });
  } catch (error: any) {
    console.error('Test submission error:', error);
    res.status(500).json({
      error: 'Greška pri čuvanju rezultata',
      details: error.message,
    });
  }
}
