import React, { useState, useEffect } from 'react';
import { MOCK_MEMBER_COUNT, MOCK_TOTAL_DONATED, MOCK_LUCKY_WINNERS } from '../data/mockData';

interface LandingPageProps {
  onStartTest: () => void;
}

const AnimatedCounter: React.FC<{ end: number; duration?: number; prefix?: string; suffix?: string }> = ({
  end, duration = 2000, prefix = '', suffix = ''
}) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const timeout = setTimeout(() => requestAnimationFrame(animate), 500);
    return () => clearTimeout(timeout);
  }, [end, duration]);
  return <span>{prefix}{count.toLocaleString('sr-RS')}{suffix}</span>;
};

const LandingPage: React.FC<LandingPageProps> = ({ onStartTest }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-red-900/30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇷🇸</span>
            <span className="font-black text-xl tracking-wider text-white" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em' }}>
              BALKANOMERAČ
            </span>
          </div>
          <button
            onClick={onStartTest}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-full text-sm transition-all duration-200 shadow-lg shadow-red-900/50"
          >
            PRIDRUŽI SE →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-red-950/20 to-gray-950" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Floating Emojis */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {['🍺', '☕', '🫙', '🎭', '🇷🇸', '🌶️', '🥃', '🎰', '⚔️', '🤌'].map((emoji, i) => (
            <div
              key={i}
              className="absolute text-4xl opacity-10 animate-bounce"
              style={{
                left: `${8 + i * 9}%`,
                top: `${15 + (i % 4) * 20}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + i * 0.2}s`
              }}
            >
              {emoji}
            </div>
          ))}
        </div>

        <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 rounded-full px-4 py-2 mb-6 text-sm text-red-300 font-semibold">
            🔴 LIVE &nbsp;•&nbsp;
            <AnimatedCounter end={MOCK_MEMBER_COUNT} /> aktivnih članova
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-black mb-4 leading-none" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
            <span className="text-white">BALKAN</span>
            <span className="text-red-500">OMERAČ</span>
          </h1>
          <h2 className="text-2xl md:text-4xl font-black text-amber-400 mb-6" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            KOLIKO SI PRAVI BALKANAC?
          </h2>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            <span className="text-red-400 font-bold">90% ljudi pada na 3. pitanju.</span> Testiraj svoju balkansku DNK,
            osvoji Balkan Pasoš i pridruži se zajednici od{' '}
            <span className="text-amber-400 font-bold">
              <AnimatedCounter end={MOCK_MEMBER_COUNT} /> pravih Balkanaca.
            </span>
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <button
              onClick={onStartTest}
              className="group relative bg-red-600 hover:bg-red-500 text-white font-black text-xl px-10 py-5 rounded-2xl transition-all duration-200 shadow-2xl shadow-red-900/60 hover:shadow-red-700/60 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">🔥 POČNI TEST - €2/mesec</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <div className="text-gray-500 text-sm">
              ✓ Bez ugovora &nbsp;•&nbsp; ✓ Otkaži kad hoćeš &nbsp;•&nbsp; ✓ Instant pristup
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['🧔', '👩', '🧓', '👨'].map((emoji, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center text-sm">
                    {emoji}
                  </div>
                ))}
              </div>
              <span><strong className="text-white"><AnimatedCounter end={MOCK_MEMBER_COUNT} /></strong> Balkanaca online</span>
            </div>
            <div className="flex items-center gap-1">
              {'⭐⭐⭐⭐⭐'.split('').map((s, i) => <span key={i}>{s}</span>)}
              <span className="ml-1"><strong className="text-white">4.9</strong>/5 ocena</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            ŠTA DOBIJAŠ?
          </h2>
          <p className="text-gray-400 text-center mb-12 text-lg">Sve za cenu jedne kafe mesečno</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🔥',
                title: '15 brutalnih pitanja',
                desc: 'Pitanja koja otkrivaju tvoju pravu balkansku prirodu. Nema lakih opcija – samo istina!',
                highlight: 'BRUTALNO ISKRENO'
              },
              {
                icon: '🎨',
                title: 'Balkan Pasoš',
                desc: 'Personalizovani PDF pasoš sa tvojim procentom, titulom i jedinstvenim ID-jem. Instantly downloadable!',
                highlight: 'PDF DOWNLOAD'
              },
              {
                icon: '💚',
                title: 'Zajednica + Lutrija',
                desc: '20% prihoda ide u lutriju i donacije. Ti biraš porodicu kojoj pomažete. Balkan sa srcem!',
                highlight: '20% ZA ZAJEDNICU'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-red-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-950/30 group"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <div className="inline-block bg-red-600/20 text-red-400 text-xs font-bold px-2 py-1 rounded mb-3 tracking-wide">
                  {feature.highlight}
                </div>
                <h3 className="text-xl font-black text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT SECTION */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-950 to-red-950/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-red-600/20 border border-red-500/30 rounded-full px-4 py-2 text-red-400 text-sm font-bold mb-4">
              ❤️ DRUŠTVENI IMPAKT
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              ZAJEDNO MENJAMO ŽIVOTE
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Svaki mesec naša zajednica čini nešto što samo Balkanci znaju – brinemo o svojima.
            </p>
          </div>

          {/* Impact cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: '🎰', title: 'Mesečna lutrija', desc: 'Jedan srećni član osvaja 10% mesečnog prihoda zajednice direktno na račun', color: 'from-amber-600/20 to-yellow-600/20 border-amber-800/40' },
              { icon: '❤️', title: 'Biraš ko dobija', desc: 'Pobednik lutrije bira porodicu u teškoj situaciji koja dobija dodatnih 10%', color: 'from-red-600/20 to-rose-600/20 border-red-800/40' },
              { icon: '🤝', title: 'Transparentno', desc: 'Javni dashboard – svaki euro je vidljiv, svaka transakcija dokumentovana', color: 'from-green-600/20 to-emerald-600/20 border-green-800/40' }
            ].map((card, i) => (
              <div key={i} className={`bg-gradient-to-br ${card.color} border rounded-2xl p-6 text-center`}>
                <div className="text-5xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-black text-white mb-2">{card.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: MOCK_TOTAL_DONATED, prefix: '€', suffix: '', label: 'Pomoglo porodicama', emoji: '💰' },
              { value: MOCK_LUCKY_WINNERS, prefix: '', suffix: '', label: 'Srećnih dobitnika', emoji: '🎰' },
              { value: MOCK_MEMBER_COUNT, prefix: '', suffix: '+', label: 'Aktivnih članova', emoji: '👥' },
              { value: 100, prefix: '', suffix: '%', label: 'Transparentnost', emoji: '✅' }
            ].map((stat, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">{stat.emoji}</div>
                <div className="text-2xl font-black text-white">
                  <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIHOD STRUKTURA */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            KAKO IDE NOVAC?
          </h2>
          <p className="text-gray-400 text-center mb-10">100% transparentno. Nema skrivenih troškova.</p>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="text-center mb-6 text-gray-400">
              Primer sa <strong className="text-white">1000 članova = €2.000/mesec</strong>
            </div>
            <div className="space-y-4">
              {[
                { pct: 50, label: 'Profit platforme', amount: '€1.000', color: 'bg-gray-600', textColor: 'text-gray-300' },
                { pct: 30, label: 'Operativni troškovi', amount: '€600', color: 'bg-gray-700', textColor: 'text-gray-400' },
                { pct: 10, label: '🎰 Lutrija pobednik', amount: '€200', color: 'bg-amber-600', textColor: 'text-amber-300' },
                { pct: 10, label: '❤️ Porodica (bira pobednik)', amount: '€200', color: 'bg-red-600', textColor: 'text-red-300' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 text-right text-white font-black text-sm">{item.pct}%</div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm font-semibold ${item.textColor}`}>{item.label}</span>
                      <span className="text-white font-bold text-sm">{item.amount}</span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TELEGRAM ZAJEDNICA */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-950 to-blue-950/20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-6xl mb-4">✈️</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            TELEGRAM ZAJEDNICA
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Najaktivnija balkanska zajednica na internetu. Recepti, ratne priče, dating, hackovi – sve na jednom mestu.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: '📢', channel: '#dobrodošlica', desc: 'Uvod i pravila' },
              { icon: '🍲', channel: '#recepti', desc: 'Balkanske delicije' },
              { icon: '❤️', channel: '#upoznavanje', desc: 'Dating i prijatelji' },
              { icon: '⚔️', channel: '#ratne-priče', desc: 'Anegdote deda/baba' },
              { icon: '🎲', channel: '#lutrija', desc: 'Transparentnost' },
              { icon: '📊', channel: '#rezultati', desc: 'Balkanomerač skores' },
              { icon: '🎯', channel: '#balkanski-hackovi', desc: '"Povez" mreža' },
              { icon: '💬', channel: '#glavni-chat', desc: 'Opšta priča' }
            ].map((ch, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 text-left hover:border-blue-700/40 transition-colors">
                <div className="text-2xl mb-1">{ch.icon}</div>
                <div className="text-blue-400 text-xs font-mono font-bold">{ch.channel}</div>
                <div className="text-gray-500 text-xs mt-0.5">{ch.desc}</div>
              </div>
            ))}
          </div>

          <button
            onClick={onStartTest}
            className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xl px-10 py-5 rounded-2xl transition-all duration-200 shadow-2xl shadow-blue-900/50 hover:scale-105 active:scale-95"
          >
            ✈️ PRIDRUŽI SE ZAJEDNICI
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            PITANJA I ODGOVORI
          </h2>
          <div className="space-y-4">
            {[
              { q: 'Ko može da se pridruži?', a: 'Svi sa balkanskim duhom! Nije važno gde živiš – ako osećaš Balkan u sebi, ovo je za tebe.' },
              { q: 'Kako funkcioniše lutrija?', a: 'Svaki mesec se random izvlači jedan aktivan pretplatnik. Pobednik dobija 10% mesečnog prihoda zajednice i bira porodicu kojoj ide dodatnih 10%.' },
              { q: 'Mogu li da otkažem pretplatu?', a: 'Da, u bilo kom trenutku. Nema penala, nema komplikovanih procedura. Jedan klik i gotovo.' },
              { q: 'Kako se verifikuju porodice za donacije?', a: 'Svaka nominacija prolazi kroz admin verifikaciju – dokumenti, priča, kontakt. Shortlistamo top 3 i pobednik lutrije bira finalnu.' },
              { q: 'Da li je lutrija legalna?', a: 'Apsolutno. Ovo je nagradna igra za pretplatnike platforme, ne kockanje. Konsultovani smo sa pravnicima.' },
              { q: 'Šta ako ne pobedujem na lutriji?', a: 'I dalje pomažeš! Svaki €2 mesečno ide delimično u zajednički pool za porodice. Svi smo deo promene.' }
            ].map((faq, i) => (
              <details key={i} className="bg-gray-900 border border-gray-800 rounded-xl group">
                <summary className="p-5 cursor-pointer font-bold text-white flex items-center justify-between list-none hover:text-red-400 transition-colors">
                  {faq.q}
                  <span className="text-gray-600 group-open:text-red-400 transition-colors text-xl">+</span>
                </summary>
                <p className="px-5 pb-5 text-gray-400 leading-relaxed border-t border-gray-800 pt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-950 to-red-950/30">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-8xl mb-6">🇷🇸</div>
          <h2 className="text-5xl md:text-7xl font-black mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            SPREMAN SI?
          </h2>
          <p className="text-gray-300 text-xl mb-8">
            Pridruži se <strong className="text-amber-400"><AnimatedCounter end={MOCK_MEMBER_COUNT} /></strong> Balkanaca koji već znaju koliko su pravi.
          </p>
          <button
            onClick={onStartTest}
            className="group bg-red-600 hover:bg-red-500 text-white font-black text-2xl px-12 py-6 rounded-2xl transition-all duration-200 shadow-2xl shadow-red-900/60 hover:scale-105 active:scale-95 mb-4"
          >
            🔥 POČNI TEST ODMAH
          </button>
          <p className="text-gray-500 text-sm">€2/mesec • Otkaži kad hoćeš • Instant pristup testu + Telegram</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 border-t border-gray-900 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇷🇸</span>
            <span className="font-black text-gray-400" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>BALKANOMERAČ</span>
          </div>
          <div className="flex gap-6 text-gray-600 text-sm">
            <a href="#" className="hover:text-gray-400 transition-colors">Uslovi korišćenja</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Politika privatnosti</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Kontakt</a>
          </div>
          <div className="text-gray-700 text-xs">© 2026 Balkanomerač. Sva prava zadržana.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
