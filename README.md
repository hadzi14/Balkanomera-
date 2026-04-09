# 🇷🇸 BALKANOMERAČ - Viral Balkanska Platforma

## 📋 Pregled Projekta

**Balkanomerač** je viral marketing platforma koja kombinuje:
- ✅ Kviz test sa 15 balkanskih pitanja
- 🎰 Mesečnu lutriju za pretplatnike
- ❤️ Donacije porodicama u potrebi
- ✈️ Telegram VIP zajednicu
- 🎨 Personalizovani "Balkan Pasoš" (PDF download)

### Biznis Model
- **Pretplata**: €2/mesec
- **Transparentna raspodela**:
  - 50% - Profit platforme
  - 30% - Operativni troškovi
  - 10% - Lutrija (pobednik)
  - 10% - Donacija porodici (bira pobednik)

## 🏗️ Tehnički Stack

### Frontend
- **React 19.2** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool
- **Tailwind CSS 4.1** - Styling
- **Lucide React** - Ikone

### Features
- Canvas API za generisanje pasoša
- html2canvas za screenshot
- jsPDF za PDF export
- Responsive dizajn
- Animacije i transitions

## 📁 Struktura Projekta

```
balkanomera/
├── src/
│   ├── components/          # React komponente
│   │   ├── LandingPage.tsx  # Početna stranica
│   │   ├── Paywall.tsx      # Registracija + plaćanje
│   │   ├── Test.tsx         # Kviz sa 15 pitanja
│   │   ├── Result.tsx       # Rezultati + pasoš
│   │   ├── UserDashboard.tsx# Dashboard korisnika
│   │   └── AdminPanel.tsx   # Admin panel
│   ├── data/
│   │   ├── questions.ts     # 15 balkanskih pitanja
│   │   └── mockData.ts      # Mock data za lutriju
│   ├── types.ts             # TypeScript definicije
│   ├── App.tsx              # Main app logic
│   └── main.tsx             # Entry point
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🚀 Kako Pokrenuti Projekat Lokalno

### Preduslovi
- Node.js 18+ ([download](https://nodejs.org))
- npm 9+ (dolazi sa Node.js)

### Instalacija i Pokretanje

```bash
# 1. Kloniraj ili raspakuj projekat
cd balkanomera-viral-platform-architecture

# 2. Instaliraj dependencies
npm install

# 3. Pokreni development server
npm run dev

# Projekat će biti dostupan na: http://localhost:5173
```

### Build za Produkciju

```bash
# Build projekta
npm run build

# Preview production build-a
npm run preview
```

Build fajlovi će biti u `dist/` folderu.

## 🎯 Funkcionalnosti po Stranicama

### 1. **Landing Page** (`LandingPage.tsx`)
- Hero sekcija sa animated brojačima
- Prikaz benefita (test, pasoš, telegram, lutrija)
- Social proof (broj članova, ocene)
- Transparentan prikaz raspodele prihoda
- Telegram kanali pregled
- FAQ sekcija
- Multiple CTA dugmad
- **Admin pristup**: Klikni logo 5x za admin panel

### 2. **Paywall** (`Paywall.tsx`)
- Trostepeni flow: Info → Registracija → Plaćanje
- Validacija email i imena
- Mock payment sistem (Paddle simulacija)
- Prikaz benefita
- Testimonials
- Processing animacija

### 3. **Test** (`Test.tsx`)
- 15 pitanja sa 4 opcije svako
- Progress bar i tracking
- Animacije između pitanja
- Mogućnost vraćanja unazad
- Kalkulacija rezultata
- 6 nivoa rangiranja:
  - 0-20%: Turista 🏖️
  - 21-40%: Balkan Beginner 🥉
  - 41-60%: Balkan Lite 🥈
  - 61-80%: Pravi Balkanac 🥇
  - 81-95%: Balkan Šejtan 😈
  - 96-100%: Balkan Bog 👑

### 4. **Result** (`Result.tsx`)
- Prikaz postignutog nivoa sa emoji
- Canvas generacija "Balkan Pasoša"
  - QR kod sa passport ID
  - Personalizovani podaci
  - Dizajn sa srpskom zastavom
- Download PDF opcija
- Share na social media
- Poziv na Dashboard

### 5. **User Dashboard** (`UserDashboard.tsx`)
- Pregled profila i rezultata
- Balkan pasoš display
- Učešće u lutriji
- Top 10 leaderboard
- Telegram join status
- Retry test opcija
- Subscription management
- Logout

### 6. **Admin Panel** (`AdminPanel.tsx`)
Sekcije:
- **Dashboard**: Statistike, revenue, grafik
- **Korisnici**: Lista, search, filteri
- **Finansije**: Prihodi, troškovi, profit
- **Lutrija**: Izvlačenje pobednika, istorija
- **Donacije**: Nominovane porodice, verifikacija
- **Telegram**: Bot status, kanali, moderacija
- **Sadržaj**: Upravljanje pitanjima i contentom

## 🎨 Dizajn Sistema

### Boje
- **Primary**: Red (#dc2626, #ef4444)
- **Accent**: Amber (#f59e0b, #fbbf24)
- **Background**: Gray-950, Gray-900
- **Text**: White, Gray-300, Gray-400

### Fontovi
- **Headings**: Bebas Neue (bold, tracking-wide)
- **Body**: System font stack

### Komponente
- Rounded corners (xl, 2xl)
- Shadow effects sa color tint
- Hover states sa scale transform
- Smooth transitions (200ms)

## 📊 Mock Data

Trenutno projekat radi sa mock podacima:
- `MOCK_MEMBER_COUNT`: 12,487 članova
- `MOCK_MONTHLY_REVENUE`: €24,974
- `MOCK_TOTAL_DONATED`: €8,743
- Mock korisnici za admin panel
- Mock istorija lutrije (Jan-Mar 2026)
- Mock nominovane porodice

## 🔄 Backend Integracija (TODO)

Za produkciju treba dodati:

### 1. **Authentication & Users**
- Supabase / Firebase Auth
- User management
- Session handling

### 2. **Payment Gateway**
- Paddle integration
- Webhook handling
- Subscription management
- Auto-renewal logic

### 3. **Database**
Schema:
```sql
-- users table
id, name, email, passport_id, subscription_status, 
joined_at, test_completed, test_result, telegram_joined

-- test_results table
id, user_id, score, percentage, title, answers_json, 
completed_at

-- lottery_draws table
id, month, draw_date, winner_user_id, charity_family_id,
winner_amount, charity_amount, total_pool, status

-- charity_families table
id, family_name, story, nominated_by_user_id, status,
amount_received, thank_you_message
```

### 4. **Telegram Bot**
- Node.js bot (Telegraf framework)
- Auto-join verification
- Kanali management
- Notifikacije za lutriju

### 5. **Admin APIs**
- User CRUD
- Lottery draw system
- Financial reports
- Content management

## 🚀 Deployment Opcije

### Opcija 1: Vercel (Preporučeno za Frontend)
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Opcija 2: Netlify
```bash
npm run build
# Upload dist/ folder na Netlify dashboard
```

### Opcija 3: Cloudflare Pages
- Connect GitHub repo
- Build command: `npm run build`
- Publish directory: `dist`

### Opcija 4: DigitalOcean App Platform
- Deploy direktno iz Git repozitorijuma
- Auto-detect Vite config

## 🔐 Environment Variables (za Backend)

Kada dodaš backend, kreirati `.env` fajl:

```env
# Database
DATABASE_URL=postgresql://...

# Paddle
PADDLE_VENDOR_ID=...
PADDLE_API_KEY=...
PADDLE_WEBHOOK_SECRET=...

# Telegram
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHANNEL_ID=...

# Email
SMTP_HOST=...
SMTP_USER=...
SMTP_PASS=...
```

## 📈 Marketing Plan

### Pre-launch:
1. Kreirati Telegram kanal
2. Napraviti Instagram/TikTok za viral content
3. Pripremiti influencer partnerships

### Launch:
1. Viral kampanja sa prvim rezultatima
2. "90% pada na pitanje 3" hook
3. Leaderboard share incentives

### Post-launch:
1. Mesečna lutrija izvlačenja (live stream)
2. Priče nominovanih porodica
3. UGC kampanje (#BalkanPasoš)

## 🐛 Known Issues & TODO

### Issues:
- [ ] npm install ima problema u nekim okruženjima
- [ ] Mock payment treba zameniti pravim gateway-om
- [ ] PDF download može biti spor na mobilnim

### TODO:
- [ ] Backend API endpoints
- [ ] Database schema implementation
- [ ] Paddle webhook integration
- [ ] Email confirmation sistem
- [ ] Telegram bot development
- [ ] Real-time leaderboard
- [ ] Analytics tracking (Plausible/Posthog)
- [ ] SEO optimization
- [ ] GDPR compliance docs
- [ ] Terms & Privacy policy stranice

## 📝 Licence

Sva prava zadržana © 2026 Balkanomerač

## 👥 Kontakt

Za pitanja i podršku:
- Email: [dodaj email]
- Telegram: [dodaj kanal]

---

**Projekat je 95% kompletan** i spreman za backend integraciju i deployment! 🚀
