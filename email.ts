// src/services/email.ts
const postmark = require('postmark');

const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN!);

export interface WelcomeEmailData {
  name: string;
  email: string;
  passportId: string;
  testLink: string;
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  try {
    const result = await client.sendEmailWithTemplate({
      From: 'info@balkanomerac.com',
      To: data.email,
      TemplateId: parseInt(process.env.POSTMARK_TEMPLATE_WELCOME!),
      TemplateModel: {
        name: data.name,
        passport_id: data.passportId,
        test_link: data.testLink,
        year: new Date().getFullYear(),
      },
    });
    
    console.log('Welcome email sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}

export interface TestCompletedEmailData {
  name: string;
  email: string;
  score: number;
  percentage: number;
  title: string;
  emoji: string;
  passportLink: string;
  dashboardLink: string;
}

export async function sendTestCompletedEmail(data: TestCompletedEmailData) {
  try {
    const result = await client.sendEmailWithTemplate({
      From: 'info@balkanomerac.com',
      To: data.email,
      TemplateId: parseInt(process.env.POSTMARK_TEMPLATE_TEST_COMPLETED!),
      TemplateModel: {
        name: data.name,
        score: data.score,
        percentage: data.percentage,
        title: data.title,
        emoji: data.emoji,
        passport_link: data.passportLink,
        dashboard_link: data.dashboardLink,
      },
    });
    
    console.log('Test completed email sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send test completed email:', error);
    throw error;
  }
}

export interface LotteryWinnerEmailData {
  name: string;
  email: string;
  winAmount: number;
  month: string;
  charityFamilies: Array<{
    id: string;
    name: string;
    story: string;
  }>;
}

export async function sendLotteryWinnerEmail(data: LotteryWinnerEmailData) {
  try {
    const result = await client.sendEmailWithTemplate({
      From: 'info@balkanomerac.com',
      To: data.email,
      TemplateId: parseInt(process.env.POSTMARK_TEMPLATE_LOTTERY_WINNER!),
      TemplateModel: {
        name: data.name,
        win_amount: data.winAmount,
        month: data.month,
        charity_families: data.charityFamilies,
      },
    });
    
    console.log('Lottery winner email sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send lottery winner email:', error);
    throw error;
  }
}

export interface MonthlyRecapEmailData {
  name: string;
  email: string;
  memberCount: number;
  totalDonated: number;
  lastWinner: string;
  nextDrawDate: string;
  userRank?: number;
}

export async function sendMonthlyRecapEmail(data: MonthlyRecapEmailData) {
  try {
    const result = await client.sendEmailWithTemplate({
      From: 'info@balkanomerac.com',
      To: data.email,
      TemplateId: parseInt(process.env.POSTMARK_TEMPLATE_MONTHLY_RECAP!),
      TemplateModel: {
        name: data.name,
        member_count: data.memberCount,
        total_donated: data.totalDonated,
        last_winner: data.lastWinner,
        next_draw_date: data.nextDrawDate,
        user_rank: data.userRank || 'N/A',
      },
    });
    
    console.log('Monthly recap email sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send monthly recap email:', error);
    throw error;
  }
}

export interface CharityNominationEmailData {
  nominatorName: string;
  nominatorEmail: string;
  familyName: string;
  story: string;
}

export async function sendCharityNominationEmail(data: CharityNominationEmailData) {
  try {
    // Send to nominator
    await client.sendEmailWithTemplate({
      From: 'info@balkanomerac.com',
      To: data.nominatorEmail,
      TemplateId: parseInt(process.env.POSTMARK_TEMPLATE_CHARITY_NOMINATION!),
      TemplateModel: {
        nominator_name: data.nominatorName,
        family_name: data.familyName,
        story: data.story,
      },
    });

    // Send to admin for review
    await client.sendEmail({
      From: 'info@balkanomerac.com',
      To: process.env.ADMIN_EMAIL!,
      Subject: `Nova nominacija: ${data.familyName}`,
      TextBody: `
        Nominator: ${data.nominatorName} (${data.nominatorEmail})
        Porodica: ${data.familyName}
        
        Priča:
        ${data.story}
        
        Proveri i verifikuj na admin panelu.
      `,
    });

    console.log('Charity nomination emails sent');
  } catch (error) {
    console.error('Failed to send charity nomination email:', error);
    throw error;
  }
}

// Batch send emails (for monthly recap to all users)
export async function sendBatchEmails(
  templateId: number,
  recipients: Array<{ email: string; templateModel: any }>
) {
  try {
    const messages = recipients.map((recipient) => ({
      From: 'info@balkanomerac.com',
      To: recipient.email,
      TemplateId: templateId,
      TemplateModel: recipient.templateModel,
    }));

    const result = await client.sendEmailBatchWithTemplates(messages);
    console.log(`Batch emails sent: ${result.length} messages`);
    return result;
  } catch (error) {
    console.error('Failed to send batch emails:', error);
    throw error;
  }
}
