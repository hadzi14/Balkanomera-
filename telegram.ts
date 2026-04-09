// src/services/telegram.ts
// This will run as a separate Node.js process (not in browser)
// Deploy to Railway, Heroku, or run on VPS

const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

// Store user verifications temporarily (use Redis in production)
const pendingVerifications = new Map<number, string>();

// Start command
bot.start((ctx: any) => {
  ctx.reply(
    '🇷🇸 *Dobrodošao u Balkanomerač zajednicu!*\n\n' +
    'Za pristup VIP kanalima, prvo se verifikuj:\n' +
    '1. Kopiraj svoj Passport ID sa dashboard-a\n' +
    '2. Pošalji komandu: /verify TVOJ_PASSPORT_ID\n\n' +
    'Primer: `/verify BLK-2026-ABC123`',
    { parse_mode: 'Markdown' }
  );
});

// Verify command
bot.command('verify', async (ctx: any) => {
  const args = ctx.message.text.split(' ');
  
  if (args.length < 2) {
    return ctx.reply(
      '❌ Format komande je pogrešan.\n' +
      'Koristi: /verify TVOJ_PASSPORT_ID\n' +
      'Primer: /verify BLK-2026-ABC123'
    );
  }

  const passportId = args[1].toUpperCase();
  const telegramId = ctx.from.id;
  const username = ctx.from.username || ctx.from.first_name;

  try {
    // Call API to verify passport and link to Telegram
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/telegram/verify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passportId,
          telegramId,
          username,
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      ctx.reply(
        `✅ *Verifikacija uspešna!*\n\n` +
        `Dobrodošao ${data.user.name}! 🎉\n\n` +
        `Sada imaš pristup:\n` +
        `• #glavni-chat\n` +
        `• #recepti\n` +
        `• #upoznavanje\n` +
        `• #lutrija\n` +
        `• i sve ostale kanale!\n\n` +
        `Uživaj u zajednici! 🇷🇸`,
        { parse_mode: 'Markdown' }
      );

      // Add user to VIP channels (if using channel management)
      // await addUserToChannels(telegramId);
    } else {
      ctx.reply(
        '❌ Verifikacija neuspešna.\n\n' +
        'Razlozi:\n' +
        '• Passport ID ne postoji\n' +
        '• Već si verifikovan\n' +
        '• Pretplata nije aktivna\n\n' +
        'Proveri svoj Passport ID na dashboard-u.'
      );
    }
  } catch (error) {
    console.error('Telegram verification error:', error);
    ctx.reply(
      '⚠️ Greška pri verifikaciji. Pokušaj ponovo za par minuta.'
    );
  }
});

// Stats command
bot.command('stats', async (ctx: any) => {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/admin/stats`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
        },
      }
    );

    const stats = await response.json();

    ctx.reply(
      `📊 *Balkanomerač Stats*\n\n` +
      `👥 Aktivni članovi: ${stats.activeMembers}\n` +
      `💰 Mesečni prihod: €${stats.monthlyRevenue}\n` +
      `❤️ Ukupno donirano: €${stats.totalDonated}\n` +
      `🎰 Sledeća lutrija: ${stats.nextDraw}\n\n` +
      `Veruj u Balkan! 🇷🇸`,
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    ctx.reply('⚠️ Ne mogu da učitam statistike.');
  }
});

// Nominate charity family
bot.command('nominate', (ctx: any) => {
  ctx.reply(
    '❤️ *Nominuj porodicu za donaciju*\n\n' +
    'Format:\n' +
    '/nominate_family Ime Prezime | Njihova priča\n\n' +
    'Primer:\n' +
    '/nominate_family Porodica Petrović | Majka sa troje dece...',
    { parse_mode: 'Markdown' }
  );
});

bot.command('nominate_family', async (ctx: any) => {
  const text = ctx.message.text.replace('/nominate_family ', '');
  const [familyName, story] = text.split('|').map((s: string) => s.trim());

  if (!familyName || !story) {
    return ctx.reply(
      '❌ Format je pogrešan.\n' +
      'Koristi: /nominate_family Ime | Priča'
    );
  }

  try {
    const telegramId = ctx.from.id;
    
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/charity/nominate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId,
          familyName,
          story,
        }),
      }
    );

    if (response.ok) {
      ctx.reply(
        '✅ Nominacija primljena!\n\n' +
        'Porodicu ćemo proveriti i dodati na shortlist.\n' +
        'Hvala što pomažeš! ❤️'
      );
    } else {
      ctx.reply('❌ Greška pri nominaciji. Pokušaj ponovo.');
    }
  } catch (error) {
    ctx.reply('⚠️ Greška. Pokušaj ponovo.');
  }
});

// Help command
bot.help((ctx: any) => {
  ctx.reply(
    '🇷🇸 *Balkanomerač Bot Komande*\n\n' +
    '/start - Započni\n' +
    '/verify - Verifikuj pasoš\n' +
    '/stats - Statistike platforme\n' +
    '/nominate - Nominuj porodicu\n' +
    '/help - Ova poruka\n\n' +
    'Pitanja? Kontaktiraj @admin',
    { parse_mode: 'Markdown' }
  );
});

// Handle all other messages
bot.on('text', (ctx: any) => {
  // Could implement AI chatbot here
  ctx.reply(
    'Koristi /help za listu komandi ili pričaj sa zajednicom u kanalima! 💬'
  );
});

// Error handling
bot.catch((err: any, ctx: any) => {
  console.error(`Error for ${ctx.updateType}:`, err);
  ctx.reply('⚠️ Došlo je do greške. Pokušaj ponovo.');
});

// Launch bot
export function startTelegramBot() {
  bot.launch();
  console.log('🤖 Telegram bot started');

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

// Export for use in API endpoints
export { bot };

// Helper: Send message to user
export async function sendTelegramMessage(
  telegramId: number,
  message: string
) {
  try {
    await bot.telegram.sendMessage(telegramId, message, {
      parse_mode: 'Markdown',
    });
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
  }
}

// Helper: Send lottery winner notification
export async function notifyLotteryWinner(
  telegramId: number,
  data: { name: string; amount: number; month: string }
) {
  const message =
    `🎉🎉🎉 *ČESTITAMO!* 🎉🎉🎉\n\n` +
    `${data.name}, osvojio si lutriju za ${data.month}!\n\n` +
    `💰 Nagrada: €${data.amount}\n\n` +
    `Sledeći koraci:\n` +
    `1. Proveri email za detalje\n` +
    `2. Izaberi porodicu kojoj ide donacija\n` +
    `3. Novac stiže na račun za 5-7 dana\n\n` +
    `VERUJ U BALKAN! 🇷🇸🔥`;

  await sendTelegramMessage(telegramId, message);
}

// If running this file directly, start the bot
if (require.main === module) {
  startTelegramBot();
}
