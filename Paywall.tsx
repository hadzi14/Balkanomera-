import React, { useState } from 'react';
import { User } from '../types';

interface PaywallProps {
  onPaymentSuccess: (user: User) => void;
  onBack: () => void;
}

const Paywall: React.FC<PaywallProps> = ({ onPaymentSuccess, onBack }) => {
  const [step, setStep] = useState<'info' | 'register' | 'payment' | 'processing'>('info');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim() || name.trim().length < 2) newErrors.name = 'Unesite ime (min. 2 karaktera)';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Unesite validnu email adresu';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (validate()) setStep('payment');
  };

  const handleMockPayment = () => {
    setStep('processing');
    setTimeout(() => {
      const mockUser: User = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        subscriptionStatus: 'active',
        testCompleted: false,
        joinedAt: new Date(),
        passportId: `BLK-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        telegramJoined: false
      };
      onPaymentSuccess(mockUser);
    }, 2500);
  };

  const benefits = [
    { icon: '✅', text: 'Pristup kompletnom testu (15 pitanja)' },
    { icon: '🎨', text: 'Zvanični Balkan Pasoš (PDF download)' },
    { icon: '✈️', text: 'Telegram VIP zajednica' },
    { icon: '🎰', text: 'Učešće u mesečnoj lutriji (10% prihoda)' },
    { icon: '❤️', text: 'Biraš porodicu kojoj pomažemo (10%)' },
    { icon: '☕', text: 'Sve za cenu jedne kafe mesečno' }
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      {/* Back button */}
      <button
        onClick={onBack}
        className="fixed top-4 left-4 text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm z-50"
      >
        ← Nazad
      </button>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-start">
        {/* LEFT - Benefits */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🇷🇸</span>
              <span className="font-black text-2xl text-white" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
                BALKANOMERAČ
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              OTKRIJ KOLIKO SI<br />
              <span className="text-red-500">PRAVI BALKANAC</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Pridruži se zajednici i testiraj svoju balkansku DNK danas.
            </p>
          </div>

          {/* Benefits list */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-bold text-lg mb-4">Šta dobijaš:</h3>
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl">{benefit.icon}</span>
                <span className="text-gray-300">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="space-y-3">
            {[
              { text: '"Test je bio brutalan ali tačan 😂 Preporučujem svima!"', name: 'Marko P., Beograd', score: '78%' },
              { text: '"Zajednica je super aktivna, recepti su zlato!"', name: 'Ana K., Novi Sad', score: '91%' }
            ].map((t, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <p className="text-gray-300 text-sm italic mb-2">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">— {t.name}</span>
                  <span className="bg-red-600/20 text-red-400 text-xs px-2 py-0.5 rounded font-bold">{t.score} Balkanac</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT - Form/Payment */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {step === 'info' && (
            <div className="text-center">
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                SPREMAN SI?
              </h3>
              <p className="text-gray-400 mb-6">
                Test se može raditi samo uz pretplatu.<br />
                <strong className="text-white">€2/mesec</strong> – cena jedne kafe.
              </p>

              {/* Price display */}
              <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-6 mb-6">
                <div className="text-5xl font-black text-white mb-1">€2</div>
                <div className="text-gray-400 text-sm">po mesecu • bez ugovora</div>
                <div className="mt-3 text-xs text-gray-500">≈ 234 RSD • Automatska naplata svakih 30 dana</div>
              </div>

              <button
                onClick={() => setStep('register')}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-lg py-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-red-900/50"
              >
                REGISTRUJ SE ODMAH →
              </button>
              <p className="text-gray-600 text-xs mt-3">
                🔒 Sigurno plaćanje putem Paddle • Otkaži u bilo kom trenutku
              </p>
            </div>
          )}

          {step === 'register' && (
            <div>
              <h3 className="text-2xl font-black text-white mb-6" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                NAPRAVI NALOG
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-gray-400 text-sm font-semibold mb-1 block">Ime i prezime</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
                    placeholder="Marko Petrović"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-gray-400 text-sm font-semibold mb-1 block">Email adresa</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                    placeholder="marko@example.com"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <button
                onClick={handleRegister}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-lg py-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-red-900/50 mb-3"
              >
                NASTAVI KA PLAĆANJU →
              </button>
              <button
                onClick={() => setStep('info')}
                className="w-full text-gray-500 hover:text-gray-300 text-sm py-2 transition-colors"
              >
                ← Nazad
              </button>

              <p className="text-gray-600 text-xs mt-4 text-center">
                Registracijom prihvataš naše Uslove korišćenja i Politiku privatnosti.
              </p>
            </div>
          )}

          {step === 'payment' && (
            <div>
              <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                PLAĆANJE
              </h3>
              <p className="text-gray-400 text-sm mb-6">Sigurno plaćanje putem Paddle</p>

              {/* Order summary */}
              <div className="bg-gray-800 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Balkanomerač Pretplata</span>
                  <span className="text-white font-bold">€2.00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">PDV (uključen)</span>
                  <span className="text-gray-400">—</span>
                </div>
                <div className="border-t border-gray-700 mt-3 pt-3 flex justify-between">
                  <span className="text-white font-bold">Ukupno/mesec</span>
                  <span className="text-red-400 font-black text-lg">€2.00</span>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  Obračun u: EUR • PDV upravljano od Paddle • Merchant of Record: Paddle
                </div>
              </div>

              {/* Paddle mock form */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6 space-y-3">
                <div className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">Podaci o kartici</div>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  defaultValue="4242 4242 4242 4242"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/GG"
                    defaultValue="12/28"
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    defaultValue="123"
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <span>🔒</span>
                  <span>Sigurno šifrovano plaćanje (SSL)</span>
                </div>
              </div>

              <button
                onClick={handleMockPayment}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-black text-lg py-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-green-900/50 mb-3"
              >
                💳 PLATI €2/MESEC
              </button>
              <button
                onClick={() => setStep('register')}
                className="w-full text-gray-500 hover:text-gray-300 text-sm py-2 transition-colors"
              >
                ← Nazad
              </button>

              <p className="text-gray-600 text-xs mt-4 text-center">
                Plaćanjem prihvataš automatsku mesečnu naplatu. Otkaži u bilo kom trenutku iz panela.
              </p>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-6 animate-spin inline-block">⚙️</div>
              <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                OBRADA PLAĆANJA...
              </h3>
              <p className="text-gray-400 mb-6">Molimo sačekaj. Ovo traje samo trenutak.</p>
              <div className="flex justify-center gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-red-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Paywall;
