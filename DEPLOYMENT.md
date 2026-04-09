# 🚀 BALKANOMERAČ - Deployment Guide

## Pre-Deployment Checklist

### ✅ Development Ready
- [x] Svi komponenti implementirani
- [x] TypeScript bez error-a
- [x] Mock data postavljen
- [x] Responsive dizajn
- [x] Animacije i UX polished

### 🔄 Za Produkciju
- [ ] Backend API endpoints
- [ ] Database setup
- [ ] Payment gateway (Paddle)
- [ ] Email service
- [ ] Telegram bot
- [ ] Domain registracija
- [ ] SSL sertifikat
- [ ] Analytics

---

## 1️⃣ QUICK DEPLOY (Frontend Only - Za Testiranje)

### Vercel (5 minuta)

```bash
# Instalacija Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd balkanomera-viral-platform-architecture
vercel

# Production deploy
vercel --prod
```

**Output**: `https://balkanomerac.vercel.app`

### Netlify

```bash
# Build
npm run build

# Drag & drop dist/ folder u Netlify dashboard
# ili koristi Netlify CLI:

npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

---

## 2️⃣ FULL STACK DEPLOYMENT

### Architecture Overview

```
┌─────────────────┐
│   Cloudflare    │ ← CDN + DNS
│   (Frontend)    │
└────────┬────────┘
         │
┌────────┴────────┐
│   Vercel API    │ ← Serverless Functions
│  (Backend API)  │
└────────┬────────┘
         │
    ┌────┴─────┬──────────┬──────────┐
    │          │          │          │
┌───┴───┐  ┌──┴───┐  ┌──┴───┐  ┌──┴────┐
│Supabase│  │Paddle│  │Telegram│ │Postmark│
│  (DB)  │  │(Pay) │  │ (Bot)  │ │(Email) │
└────────┘  └──────┘  └────────┘ └────────┘
```

---

## 3️⃣ STEP-BY-STEP: Production Setup

### A. Database (Supabase)

**1. Kreiranje projekta**
```bash
# Sign up: https://supabase.com
# Create new project
```

**2. SQL Schema**
```sql
-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  passport_id TEXT UNIQUE NOT NULL,
  subscription_status TEXT DEFAULT 'none',
  test_completed BOOLEAN DEFAULT false,
  test_result JSONB,
  telegram_joined BOOLEAN DEFAULT false,
  joined_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Test results
CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  score INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  title TEXT NOT NULL,
  title_emoji TEXT NOT NULL,
  answers JSONB NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Lottery draws
CREATE TABLE lottery_draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month TEXT NOT NULL,
  draw_date TIMESTAMP NOT NULL,
  winner_user_id UUID REFERENCES users(id),
  charity_family_id UUID,
  winner_amount DECIMAL(10,2),
  charity_amount DECIMAL(10,2),
  total_pool DECIMAL(10,2),
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Charity families
CREATE TABLE charity_families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_name TEXT NOT NULL,
  story TEXT NOT NULL,
  nominated_by_user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'nominated',
  amount_received DECIMAL(10,2),
  thank_you_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_passport ON users(passport_id);
CREATE INDEX idx_results_user ON test_results(user_id);
```

**3. Environment Variables**
```env
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

### B. Payment Gateway (Paddle)

**1. Setup Account**
- Sign up: https://paddle.com
- Complete business verification
- Get API credentials

**2. Create Products**
```
Product: Balkanomerač Pretplata
Price: €2.00 EUR / month
Billing: Recurring Monthly
Trial: None
```

**3. Webhook Setup**
```
Webhook URL: https://your-api.vercel.app/api/paddle-webhook
Events to track:
- subscription.created
- subscription.updated
- subscription.cancelled
- payment.succeeded
- payment.failed
```

**4. Integration Code**
```typescript
// src/services/paddle.ts
import { Paddle } from '@paddle/paddle-js';

const paddle = new Paddle({
  environment: import.meta.env.VITE_PADDLE_ENV,
  token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
});

export async function openCheckout(email: string, name: string) {
  const result = await paddle.Checkout.open({
    items: [{
      priceId: 'pri_01j...',  // Tvoj price ID
      quantity: 1
    }],
    customer: { email },
    customData: { name }
  });
  return result;
}
```

---

### C. Telegram Bot

**1. Create Bot**
```
Talk to @BotFather na Telegramu:
/newbot
Name: Balkanomerač Bot
Username: balkanomerac_bot

Save your TOKEN
```

**2. Bot Code** (Node.js + Telegraf)
```javascript
// telegram-bot/index.js
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('🇷🇸 Dobrodošao u Balkanomerač zajednicu!');
});

bot.command('verify', async (ctx) => {
  const telegramId = ctx.from.id;
  // API call to mark user as telegram_joined = true
  await fetch('https://your-api.vercel.app/api/verify-telegram', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramId })
  });
  ctx.reply('✅ Verifikovan si! Dobrodošao u zajednicu.');
});

bot.launch();
```

**3. Deploy Bot**
```bash
# Option 1: Railway
railway login
railway init
railway up

# Option 2: Heroku
heroku create balkanomerac-bot
git push heroku main
```

---

### D. Email Service (Postmark)

**1. Setup**
- Sign up: https://postmarkapp.com
- Verify domain
- Get Server API Token

**2. Templates**
```
Templates to create:
1. welcome-email: Dobrodošlica + test link
2. test-completed: Rezultati + pasoš link
3. lottery-winner: Čestitka pobedniku
4. charity-family: Potvrda nominacije
5. monthly-recap: Mesečni izveštaj
```

**3. Integration**
```typescript
// src/services/email.ts
const postmark = require('postmark');
const client = new postmark.ServerClient(
  process.env.POSTMARK_API_TOKEN
);

export async function sendWelcomeEmail(user) {
  await client.sendEmailWithTemplate({
    From: 'info@balkanomerac.com',
    To: user.email,
    TemplateId: 123456,
    TemplateModel: {
      name: user.name,
      passport_id: user.passport_id,
      test_link: 'https://balkanomerac.com/test'
    }
  });
}
```

---

### E. API Endpoints (Vercel Functions)

**Project Structure**
```
api/
├── auth/
│   ├── register.ts
│   └── login.ts
├── test/
│   ├── submit.ts
│   └── results.ts
├── payment/
│   ├── create-checkout.ts
│   └── webhook.ts
├── lottery/
│   ├── draw.ts
│   └── history.ts
└── admin/
    ├── users.ts
    └── stats.ts
```

**Example: api/test/submit.ts**
```typescript
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, answers } = req.body;
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Calculate results
  const totalScore = answers.reduce((sum, a) => sum + a.points, 0);
  const percentage = Math.round((totalScore / 45) * 100);

  // Save to database
  const { data, error } = await supabase
    .from('test_results')
    .insert({
      user_id: userId,
      score: totalScore,
      percentage,
      answers
    });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true, data });
}
```

---

### F. Domain & DNS

**1. Registracija Domena**
- Namecheap / Cloudflare Registrar
- Predlozi: `balkanomerac.com`, `balkanpasos.com`

**2. DNS Setup** (Cloudflare)
```
A     @     76.76.21.21 (Vercel)
CNAME www   cname.vercel-dns.com
TXT   @     "v=spf1 include:spf.postmarkapp.com ~all"
```

**3. Vercel Domain Config**
```bash
vercel domains add balkanomerac.com
vercel domains add www.balkanomerac.com
```

---

## 4️⃣ MONITORING & ANALYTICS

### Analytics (Plausible)

```html
<!-- u index.html -->
<script defer data-domain="balkanomerac.com" 
  src="https://plausible.io/js/script.js">
</script>
```

Events to track:
- `test_started`
- `test_completed`
- `payment_initiated`
- `payment_success`
- `telegram_joined`
- `passport_downloaded`

### Error Tracking (Sentry)

```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://xxx@sentry.io/123",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

## 5️⃣ SECURITY CHECKLIST

- [ ] HTTPS only (force redirect)
- [ ] CORS properly configured
- [ ] API rate limiting (Vercel Edge Config)
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (React default)
- [ ] CSRF tokens for API calls
- [ ] Paddle webhook signature verification
- [ ] Environment variables secure (never in git)
- [ ] Regular security updates
- [ ] GDPR compliance docs

---

## 6️⃣ LEGAL REQUIREMENTS

### Terms of Service
```
Kreirati stranice:
- /terms - Uslovi korišćenja
- /privacy - Politika privatnosti
- /cookie-policy - Politika kolačića
```

### GDPR Compliance
- [ ] Cookie consent banner
- [ ] Data export endpoint
- [ ] Data deletion endpoint
- [ ] Privacy policy ažuriran

### Lottery Legality
- [ ] Konsultacija sa pravnikom
- [ ] Registracija nagradne igre (ako potrebno u RS)
- [ ] Terms jasno navode pravila izvlačenja

---

## 7️⃣ COST ESTIMATE (Mesečno)

```
Vercel Pro:        $20/mo
Supabase Pro:      $25/mo
Paddle:            2.9% + €0.30 po transakciji
Postmark:          $15/mo (10k emails)
Telegram Bot:      Free
Cloudflare:        Free
Plausible:         $9/mo
Domain:            $12/yr

Total startup: ~$90/mo + transaction fees
```

**Break-even**: ~50 pretplatnika (€100/mo revenue)

---

## 8️⃣ LAUNCH TIMELINE

### Week 1: Infrastructure
- [ ] Setup Supabase + schema
- [ ] Deploy Vercel API
- [ ] Configure Paddle sandbox
- [ ] Create Telegram bot

### Week 2: Integration
- [ ] Connect all APIs
- [ ] Test payment flow end-to-end
- [ ] Email templates setup
- [ ] Admin panel API connection

### Week 3: Testing
- [ ] QA testing (desktop/mobile)
- [ ] Payment testing (sandbox)
- [ ] Load testing
- [ ] Security audit

### Week 4: Launch
- [ ] Deploy to production
- [ ] DNS propagation
- [ ] Monitor errors
- [ ] First marketing push

---

## 🆘 TROUBLESHOOTING

### Build fails
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Vercel deployment error
```bash
vercel logs [deployment-url]
```

### Database connection issues
- Check Supabase service role key
- Verify CORS allowed origins
- Check connection pooling limits

---

Sve je pripremljeno za launch! 🚀
