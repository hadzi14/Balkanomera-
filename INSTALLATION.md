# 🚀 BALKANOMERAČ - Complete Setup Guide

## 📋 Prerequisites

Before starting, you need:
- **Node.js 18+** and npm 9+ ([download](https://nodejs.org))
- **Git** ([download](https://git-scm.com))
- **Accounts** on: Supabase, Paddle, Postmark, Telegram

Estimated total setup time: **2-3 hours**

---

## 🎯 Setup Roadmap

```
1. Local Development (15 min)
   └─> Install dependencies & run dev server

2. Database Setup (20 min)
   └─> Supabase project & schema

3. Payment Gateway (30 min)
   └─> Paddle account & product

4. Email Service (25 min)
   └─> Postmark & templates

5. Telegram Bot (15 min)
   └─> Bot creation & deployment

6. Deployment (20 min)
   └─> Vercel production deployment

7. Testing (20 min)
   └─> End-to-end flow verification
```

---

## 1️⃣ LOCAL DEVELOPMENT SETUP

### Clone Project
```bash
# If from Git
git clone <your-repo-url>
cd balkanomera-platform

# If from ZIP
unzip balkanomera-complete.zip
cd balkanomera-complete
```

### Install Dependencies
```bash
npm install
```

### Create Environment File
```bash
cp .env.example .env.local
```

### Run Development Server
```bash
npm run dev
```

Open http://localhost:5173 - you should see the landing page!

**At this point**: Frontend works with mock data. Now let's add real backend.

---

## 2️⃣ DATABASE SETUP (Supabase)

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New project"
3. Choose organization (or create one)
4. Fill in:
   - **Name**: balkanomera
   - **Database Password**: (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project" (takes ~2 min)

### Get API Credentials

1. Go to **Settings** → **API**
2. Copy these to your `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxx...
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_KEY=eyJyyy...
   ```

### Run Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New query"
3. Copy entire contents of `database/schema.sql`
4. Paste and click "Run"
5. You should see: "Success. No rows returned"

### Verify Setup

Run this query in SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see: `charity_families`, `lottery_draws`, `test_results`, `users`

✅ **Database is ready!**

---

## 3️⃣ PAYMENT GATEWAY (Paddle)

### Create Paddle Account

1. Go to [paddle.com](https://paddle.com)
2. Sign up (business verification required)
3. Choose plan (starts free for testing)
4. Complete business details (needed for approval)

**Note**: Approval takes 1-2 business days. Use Sandbox mode meanwhile.

### Switch to Sandbox

1. In Paddle dashboard, top-right corner
2. Toggle to **Sandbox mode** (yellow banner appears)

### Create Product & Price

1. Go to **Catalog** → **Products**
2. Click "Add Product"
3. Fill in:
   - **Name**: Balkanomerač Pretplata
   - **Tax category**: Select appropriate for Serbia/EU
4. Click "Save"
5. Click "Add Price"
   - **Amount**: €2.00
   - **Currency**: EUR
   - **Billing period**: Monthly
   - **Billing type**: Recurring
6. Click "Save" and copy the **Price ID** (starts with `pri_`)

### Get API Keys

1. Go to **Developer Tools** → **Authentication**
2. Copy **Client-side token** (starts with `test_`)
3. Copy **Secret API key** (keep this SECRET!)
4. Add to `.env.local`:
   ```env
   VITE_PADDLE_ENV=sandbox
   VITE_PADDLE_CLIENT_TOKEN=test_xxxxx
   VITE_PADDLE_PRICE_ID=pri_xxxxx
   PADDLE_API_KEY=xxxxx
   ```

### Setup Webhook

1. Go to **Developer Tools** → **Webhooks**
2. Click "Add webhook"
3. **Webhook URL**: `https://your-app.vercel.app/api/payment/webhook`
   - (Use https://webhook.site temporarily for testing)
4. Select events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
   - `payment.succeeded`
   - `payment.failed`
5. Copy **Webhook Secret** to `.env.local`:
   ```env
   PADDLE_WEBHOOK_SECRET=xxxxx
   ```

✅ **Paddle is configured!** (Test in sandbox mode first)

---

## 4️⃣ EMAIL SERVICE (Postmark)

### Create Postmark Account

1. Go to [postmarkapp.com](https://postmarkapp.com)
2. Sign up (free tier: 100 emails/month)
3. Verify email address

### Create Server

1. Click "Servers" → "Add Server"
2. Name: "Balkanomera Production"
3. Click "Create Server"
4. Copy **Server API Token** to `.env.local`:
   ```env
   POSTMARK_API_TOKEN=xxxxx
   ```

### Verify Sender Domain

1. Go to **Sender Signatures**
2. Click "Add Domain or Email Address"
3. Choose "Domain"
4. Enter: `balkanomerac.com` (or your domain)
5. Copy DNS records and add to your domain's DNS settings
6. Wait for verification (~15 min to 1 hour)

**Or use email signature** (easier for testing):
1. Choose "Email Address"
2. Enter: `info@yourdomain.com`
3. Verify via email link

### Create Email Templates

Go to **Templates** → **Add Template** for each:

#### 1. Welcome Email
```
Name: welcome-email
Subject: 🇷🇸 Dobrodošao u Balkanomerač zajednicu!

Body:
Zdravo {{name}},

Dobrodošao u Balkanomerač! 🎉

Tvoj Balkan Pasoš ID: {{passport_id}}

Sledeći koraci:
1. Pokreni test: {{test_link}}
2. Pridruži se Telegram zajednici
3. Čekaj mesečnu lutriju!

Pozdrav,
Balkanomerač Tim
```

Copy **Template ID** and add to `.env.local`:
```env
POSTMARK_TEMPLATE_WELCOME=123456
```

#### 2. Test Completed
```
Subject: {{emoji}} Ti si {{title}}!

Čestitamo {{name}}!

Tvoj rezultat: {{percentage}}% ({{score}}/45 bodova)
Rang: {{title}} {{emoji}}

Preuzmi pasoš: {{passport_link}}
Dashboard: {{dashboard_link}}
```

#### 3. Lottery Winner
```
Subject: 🎉 OSVOJIO SI LUTRIJU - €{{win_amount}}!

ČESTITAMO {{name}}!

Osvojio si lutriju za {{month}}!
💰 Nagrada: €{{win_amount}}

Izaberi porodicu koja prima donaciju:
{{#each charity_families}}
- {{this.name}}: {{this.story}}
{{/each}}
```

#### 4. Monthly Recap
```
Subject: 📊 Mesečni izveštaj - {{month}}

Bok {{name}},

Balkanomerač mesec {{month}}:
- {{member_count}} aktivnih članova
- €{{total_donated}} donirano ukupno
- Pobednik: {{last_winner}}
- Sledeće izvlačenje: {{next_draw_date}}

Tvoj rank: #{{user_rank}}
```

Save all Template IDs to `.env.local`

✅ **Email service ready!**

---

## 5️⃣ TELEGRAM BOT

### Create Bot

1. Open Telegram app
2. Search for `@BotFather`
3. Send: `/newbot`
4. Bot name: `Balkanomerač`
5. Username: `balkanomerac_bot` (must be unique)
6. Copy **Token** to `.env.local`:
   ```env
   TELEGRAM_BOT_TOKEN=1234567890:ABCxxx...
   ```

### Deploy Bot

**Option A: Railway** (Recommended - Easy)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Select your repo
6. Add environment variables:
   - All from `.env.local`
7. Set start command: `npm run telegram`
8. Deploy!

**Option B: Heroku**
```bash
# Install Heroku CLI
brew install heroku/brew/heroku  # Mac
# or download from heroku.com

# Login
heroku login

# Create app
heroku create balkanomerac-bot

# Set env vars
heroku config:set TELEGRAM_BOT_TOKEN=xxxxx
heroku config:set API_BASE_URL=https://your-api.vercel.app

# Create Procfile
echo "worker: npm run telegram" > Procfile

# Deploy
git push heroku main
```

### Test Bot

1. Search for your bot in Telegram: `@balkanomerac_bot`
2. Send: `/start`
3. You should get welcome message!

✅ **Bot is live!**

---

## 6️⃣ VERCEL DEPLOYMENT

### Install Vercel CLI

```bash
npm install -g vercel
```

### Login

```bash
vercel login
```

### Configure Environment Variables

Create all environment variables in Vercel dashboard:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project (or create new)
3. Go to **Settings** → **Environment Variables**
4. Add all variables from `.env.local`

**Important**: Separate into:
- **Development** - for `vercel dev`
- **Preview** - for preview deployments
- **Production** - for production

### Deploy

```bash
# Test deployment
vercel

# Production deployment
vercel --prod
```

Your app is now live at: `https://your-app.vercel.app`

### Custom Domain

1. Go to **Settings** → **Domains**
2. Add your domain: `balkanomerac.com`
3. Follow DNS instructions
4. Wait for SSL certificate (~5 min)

### Update Paddle Webhook

1. Go back to Paddle dashboard
2. Update webhook URL to: `https://balkanomerac.com/api/payment/webhook`
3. Test webhook with Paddle's test tool

✅ **App is deployed!**

---

## 7️⃣ TESTING

### End-to-End Test Flow

1. **Landing Page**
   - Visit your production URL
   - Click "POČNI TEST"

2. **Registration**
   - Enter name and email
   - Click through to payment

3. **Payment** (Use Paddle test card)
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVV: Any 3 digits
   - Complete payment

4. **Test**
   - Answer all 15 questions
   - Submit test

5. **Results**
   - View your rank
   - Download passport PDF
   - Check email for confirmation

6. **Telegram**
   - Join bot: `@balkanomerac_bot`
   - Send `/verify YOUR_PASSPORT_ID`
   - Verify you're added

7. **Admin Panel**
   - Click logo 5 times on landing
   - View stats
   - Try lottery draw (admin only)

### Check Logs

```bash
# Vercel logs
vercel logs

# Supabase logs
# Go to Supabase dashboard → Logs

# Paddle events
# Go to Paddle → Developer Tools → Events
```

---

## 8️⃣ GO LIVE CHECKLIST

Before launching to real users:

### Security
- [ ] Change all API keys to production
- [ ] Set strong `ADMIN_API_KEY`
- [ ] Enable 2FA on all services
- [ ] Review Supabase RLS policies
- [ ] Test webhook signature verification

### Paddle
- [ ] Switch from Sandbox to Production
- [ ] Get business verification approved
- [ ] Update `VITE_PADDLE_ENV=production`
- [ ] Update price ID to production price
- [ ] Test real payment with your card

### Email
- [ ] Domain verification complete
- [ ] All templates approved
- [ ] Test each template
- [ ] Set up DMARC/SPF/DKIM

### Legal
- [ ] Create Terms of Service page
- [ ] Create Privacy Policy page
- [ ] Add Cookie consent banner
- [ ] GDPR compliance checklist

### Monitoring
- [ ] Setup Plausible/Posthog analytics
- [ ] Setup Sentry error tracking
- [ ] Create admin notification alerts
- [ ] Setup uptime monitoring (UptimeRobot)

### Performance
- [ ] Test on mobile devices
- [ ] Check PageSpeed Insights
- [ ] Optimize images
- [ ] Enable Vercel Analytics

---

## 🆘 Troubleshooting

### "npm install" fails
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Supabase connection errors
- Check if service key is correct (not anon key)
- Verify RLS policies allow your operations
- Check Supabase dashboard → Database → Logs

### Paddle webhook not receiving
- Use webhook.site to test
- Check Paddle → Events for errors
- Verify URL is https (not http)
- Check signature verification code

### Emails not sending
- Verify sender domain in Postmark
- Check Postmark → Activity for errors
- Verify template IDs are correct
- Test with Postmark's API test tool

### Telegram bot not responding
- Check bot is running (Railway/Heroku logs)
- Verify token is correct
- Test with `/start` command
- Check API_BASE_URL is set

---

## 📞 Support

- **Documentation**: Check all .md files in project
- **Supabase**: [docs.supabase.com](https://docs.supabase.com)
- **Paddle**: [developer.paddle.com](https://developer.paddle.com)
- **Postmark**: [postmarkapp.com/developer](https://postmarkapp.com/developer)
- **Telegram**: [core.telegram.org/bots](https://core.telegram.org/bots)

---

## ✅ Setup Complete!

Your platform is now fully functional with:
- ✅ Live payments (Paddle)
- ✅ Database (Supabase)
- ✅ Emails (Postmark)
- ✅ Telegram bot
- ✅ Production deployment (Vercel)

**Next**: Start marketing and get your first users! 🚀

---

**Total Time**: 2-3 hours
**Total Cost**: ~€70/month + transaction fees
**Break-even**: 40-50 subscribers

Good luck! 🇷🇸🔥
