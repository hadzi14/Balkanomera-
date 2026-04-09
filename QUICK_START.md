# ⚡ BALKANOMERAČ - Quick Start Guide

## 🚀 5-Minute Setup

### Preduslovi
```bash
# Proveri da imaš:
node --version  # v18+ potreban
npm --version   # v9+ potreban
```

Ako nemaš Node.js: https://nodejs.org/

---

## 📦 Setup & Run

```bash
# 1. Kloniraj/Raspakuj projekat
cd balkanomera-viral-platform-architecture

# 2. Instaliraj dependencies
npm install

# 3. Pokreni dev server
npm run dev
```

**Otvori browser**: http://localhost:5173

---

## 🎮 How to Use

### User Flow
1. **Landing** → Klikni "POČNI TEST"
2. **Paywall** → Unesi ime/email → Mock payment
3. **Test** → Odgovori na 15 pitanja
4. **Result** → Vidi rezultat + download pasoš
5. **Dashboard** → Pogledaj stats i leaderboard

### Admin Access
- Na landing page: **Klikni logo 5x**
- Otvori se admin panel sa svim kontrolama

---

## 📂 Project Structure

```
src/
├── components/         ← React komponente
│   ├── LandingPage.tsx    # Početna stranica
│   ├── Paywall.tsx        # Payment flow
│   ├── Test.tsx           # Kviz pitanja
│   ├── Result.tsx         # Rezultati + pasoš
│   ├── UserDashboard.tsx  # User panel
│   └── AdminPanel.tsx     # Admin kontrole
│
├── data/              ← Data fajlovi
│   ├── questions.ts       # 15 balkanskih pitanja
│   └── mockData.ts        # Mock users, lottery
│
├── types.ts           ← TypeScript definicije
├── App.tsx            ← Main app router
└── main.tsx           ← Entry point
```

---

## 🛠️ Key Commands

```bash
# Development
npm run dev              # Pokreni dev server

# Build
npm run build           # Build za production
npm run preview         # Preview production build

# Code Quality (TODO - dodaj kasnije)
npm run lint            # ESLint check
npm run type-check      # TypeScript check
npm test                # Run tests
```

---

## 🎨 Customization

### Promeni Boje
```css
/* src/index.css */

/* Primary red */
.bg-red-600 → .bg-blue-600
.text-red-500 → .text-blue-500

/* Accent amber */
.bg-amber-400 → .bg-green-400
```

### Promeni Pitanja
```typescript
// src/data/questions.ts

export const questions: Question[] = [
  {
    id: 1,
    text: "Tvoje pitanje ovde?",
    options: ["A", "B", "C", "D"],
    points: [0, 1, 2, 3]  // Bodovi po opciji
  },
  // ... dodaj još pitanja
];
```

### Promeni Cenu
```typescript
// src/components/Paywall.tsx

// Linija ~120
<strong className="text-white">€2/mesec</strong>
// Promeni u svoju cenu

// Linija ~125
<div className="text-5xl font-black text-white mb-1">€2</div>
```

---

## 🐛 Common Issues

### "npm install" fails
```bash
# Solution 1: Clean install
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Solution 2: Use different registry
npm install --registry=https://registry.npmmirror.com
```

### Port 5173 already in use
```bash
# Option 1: Kill process
lsof -ti:5173 | xargs kill -9

# Option 2: Use different port
npm run dev -- --port 3000
```

### Build fails
```bash
# Check TypeScript errors
npx tsc --noEmit

# Check for missing dependencies
npm install
```

---

## 📊 Mock Data Explained

### Users
```typescript
// Trenutno nema perzistencije
// State se čuva u React (memory only)
// Refresh briše sve podatke
```

### Lottery
```typescript
// src/data/mockData.ts
export const mockLotteryHistory = [
  {
    month: 'Januar 2026',
    winnerName: 'M. Petrović',
    winnerAmount: 187,
    // ...
  }
];
```

### Stats
```typescript
export const MOCK_MEMBER_COUNT = 12487;
export const MOCK_MONTHLY_REVENUE = 24974;
```

---

## 🎯 Development Tips

### Hot Reload
- Fajlovi se automatski reload-uju
- Bez potrebe za refresh browser-a
- State se resetuje na izmene koda

### React DevTools
```bash
# Install browser extension:
# Chrome: https://chrome.google.com/webstore → "React Developer Tools"
# Firefox: https://addons.mozilla.org → "React Developer Tools"
```

### Debug Mode
```typescript
// Dodaj u bilo kom componentu:
console.log('State:', { user, testResult });

// Ili koristi React DevTools za state inspection
```

---

## 🔐 Environment Variables

Trenutno nema .env fajla (sve je mock).

**Za produkciju**, kreirati `.env`:

```env
# Database
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Payment
VITE_PADDLE_ENV=sandbox
VITE_PADDLE_CLIENT_TOKEN=test_...

# Email
VITE_POSTMARK_API_TOKEN=...

# Telegram
VITE_TELEGRAM_BOT_TOKEN=...
```

Koristi `import.meta.env.VITE_*` u kodu.

---

## 📱 Mobile Testing

```bash
# 1. Pokreni dev server
npm run dev

# 2. Pronađi svoju IP adresu
# Mac/Linux:
ifconfig | grep "inet "

# Windows:
ipconfig

# 3. Otvori na mobilnom:
http://192.168.1.XXX:5173
```

---

## 🚢 Deploy Preview (5 min)

### Vercel
```bash
npm install -g vercel
vercel login
vercel
```

Output: `https://your-project.vercel.app`

### Netlify
```bash
npm run build
# Drag & drop `dist/` folder na netlify.com
```

---

## 🧪 Testing Flow

### Manual Test Checklist
- [ ] Landing page loads
- [ ] "Start test" vodi na paywall
- [ ] Registracija validira email/name
- [ ] Mock payment uspešno prelazi
- [ ] Svih 15 pitanja se prikazuju
- [ ] Možeš ići nazad i menjati odgovore
- [ ] Rezultat se pravilno kalkulira
- [ ] Pasoš se generiše sa pravim podacima
- [ ] PDF download radi
- [ ] Dashboard prikazuje rezultate
- [ ] Admin panel se otvara (5x logo)
- [ ] Lottery draw animacija radi

---

## 💡 Pro Tips

### 1. Fast Refresh
```typescript
// Koristi functional components
export default function Component() {
  // ...umesto class components
}
```

### 2. State Debugging
```typescript
// Use React DevTools
// ili Chrome console:
window.localStorage.setItem('debug', 'true');
```

### 3. Performance
```bash
# Build analysis
npm run build
# Check dist/ folder size
du -sh dist/
```

### 4. Code Organization
```
Feature-first struktur:
src/
  features/
    test/
      Test.tsx
      useTestLogic.ts
      test.types.ts
    results/
      Result.tsx
      ...
```

---

## 📚 Learn More

### React
- https://react.dev
- https://react.dev/learn

### TypeScript
- https://www.typescriptlang.org/docs/

### Tailwind CSS
- https://tailwindcss.com/docs
- https://tailwindui.com (plaćeni komponenti)

### Vite
- https://vitejs.dev/guide/

---

## 🆘 Need Help?

### Error Messages
1. Copy full error iz terminal-a
2. Google: "vite [error message]"
3. Check GitHub Issues: https://github.com/vitejs/vite/issues

### Stack Overflow
- Tag: `reactjs` + `typescript` + `vite`
- Pitaj sa code snippetom

### Community
- React Discord: https://discord.gg/react
- Balkanski dev Slack/Discord grupe

---

## ✅ Next Steps

1. ✅ Projekat radi lokalno
2. → Dodaj backend (Supabase/Firebase)
3. → Integriši Paddle payment
4. → Deploy na Vercel
5. → Launch! 🚀

---

**Happy coding!** 💻🇷🇸
