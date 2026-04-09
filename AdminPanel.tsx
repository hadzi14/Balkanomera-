import React, { useState } from 'react';
import { mockLotteryHistory, mockCharityFamilies, MOCK_MEMBER_COUNT, MOCK_MONTHLY_REVENUE, MOCK_TOTAL_DONATED } from '../data/mockData';

interface AdminPanelProps {
  onExit: () => void;
}

type AdminTab = 'dashboard' | 'users' | 'finance' | 'lottery' | 'charity' | 'telegram' | 'content';

const mockUsers = [
  { id: '1', name: 'Marko Petrović', email: 'marko@test.com', joined: '15.01.2026', status: 'active', score: 78, title: 'Pravi Balkanac' },
  { id: '2', name: 'Ana Jovanović', email: 'ana@test.com', joined: '20.01.2026', status: 'active', score: 91, title: 'Balkan Šejtan' },
  { id: '3', name: 'Stefan Đorđević', email: 'stefan@test.com', joined: '05.02.2026', status: 'active', score: 45, title: 'Balkan Lite' },
  { id: '4', name: 'Ivana Nikolić', email: 'ivana@test.com', joined: '10.02.2026', status: 'canceled', score: 33, title: 'Balkan Beginner' },
  { id: '5', name: 'Milan Stojanović', email: 'milan@test.com', joined: '14.02.2026', status: 'active', score: 97, title: 'Balkan Bog' },
];

const AdminPanel: React.FC<AdminPanelProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [lotteryDrawing, setLotteryDrawing] = useState(false);
  const [lotteryResult, setLotteryResult] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'dashboard' as AdminTab, icon: '📊', label: 'Dashboard' },
    { id: 'users' as AdminTab, icon: '👥', label: 'Korisnici' },
    { id: 'finance' as AdminTab, icon: '💰', label: 'Finansije' },
    { id: 'lottery' as AdminTab, icon: '🎰', label: 'Lutrija' },
    { id: 'charity' as AdminTab, icon: '❤️', label: 'Donacije' },
    { id: 'telegram' as AdminTab, icon: '✈️', label: 'Telegram' },
    { id: 'content' as AdminTab, icon: '📝', label: 'Sadržaj' },
  ];

  const runLotteryDraw = () => {
    setLotteryDrawing(true);
    setLotteryResult(null);
    const activeUsers = mockUsers.filter(u => u.status === 'active');
    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      const randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)];
      setLotteryResult(`🎲 ${randomUser.name}...`);
      if (counter >= 15) {
        clearInterval(interval);
        const winner = activeUsers[Math.floor(Math.random() * activeUsers.length)];
        setLotteryResult(`🏆 POBEDNIK: ${winner.name}`);
        setLotteryDrawing(false);
      }
    }, 150);
  };

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const monthlyPool = MOCK_MONTHLY_REVENUE;
  const lotteryPool = monthlyPool * 0.1;
  const charityPool = monthlyPool * 0.1;
  const profit = monthlyPool * 0.5;
  const operational = monthlyPool * 0.3;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-sm font-black">A</div>
            <div>
              <div className="font-black text-white">Admin Panel</div>
              <div className="text-gray-500 text-xs">Balkanomerač • 2026</div>
            </div>
          </div>
          <button
            onClick={onExit}
            className="text-gray-500 hover:text-white text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800"
          >
            ← Izlaz
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-[220px_1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 font-semibold
                  ${activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div>
            {/* DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>DASHBOARD 📊</h2>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Aktivni članovi', value: MOCK_MEMBER_COUNT.toLocaleString('sr-RS'), icon: '👥', color: 'text-white', sub: '+47 ovaj mesec' },
                    { label: 'Mesečni prihod', value: `€${MOCK_MONTHLY_REVENUE.toLocaleString('sr-RS')}`, icon: '💰', color: 'text-green-400', sub: '+€94 vs prošlog' },
                    { label: 'Churn rate', value: '2.3%', icon: '📉', color: 'text-amber-400', sub: 'industrijski avg 5%' },
                    { label: 'Conversion', value: '18.7%', icon: '🎯', color: 'text-blue-400', sub: 'landing → payment' }
                  ].map((kpi, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{kpi.icon}</span>
                        <span className="text-gray-600 text-xs">{kpi.sub}</span>
                      </div>
                      <div className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</div>
                      <div className="text-gray-500 text-xs mt-1">{kpi.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent activity */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-white mb-4">Nedavna aktivnost</h3>
                  <div className="space-y-3">
                    {[
                      { time: 'Pred 5min', msg: '🆕 Nova pretplata: Jelena M. (Beograd)', type: 'green' },
                      { time: 'Pred 12min', msg: '✅ Test završen: Nikola K. (87%) - Balkan Šejtan', type: 'blue' },
                      { time: 'Pred 1h', msg: '❤️ Nova nominacija porodice: Porodica Lazić', type: 'red' },
                      { time: 'Pred 2h', msg: '🆕 Nova pretplata: Dragana R. (Novi Sad)', type: 'green' },
                      { time: 'Pred 3h', msg: '❌ Otkazana pretplata: Vlad S.', type: 'gray' },
                      { time: 'Pred 5h', msg: '✅ Test završen: Tanja J. (62%) - Pravi Balkanac', type: 'blue' },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          activity.type === 'green' ? 'bg-green-500' :
                          activity.type === 'blue' ? 'bg-blue-500' :
                          activity.type === 'red' ? 'bg-red-500' : 'bg-gray-600'
                        }`} />
                        <span className="text-gray-300 text-sm flex-1">{activity.msg}</span>
                        <span className="text-gray-600 text-xs flex-shrink-0">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue chart (simplified visual) */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-white mb-4">Rast članova (2026)</h3>
                  <div className="flex items-end gap-2 h-32">
                    {[8200, 9100, 9800, 10500, 11200, 12000, 12487].map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t"
                          style={{ height: `${(val / 12487) * 100}%` }}
                        />
                        <div className="text-gray-600 text-xs">{['Jan','Feb','Mar','Apr','Maj','Jun','Jul'][i]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* USERS */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>KORISNICI 👥</h2>
                  <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all">
                    📥 Export CSV
                  </button>
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Pretraži po imenu ili emailu..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500"
                />

                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left px-4 py-3 text-gray-400 text-sm font-semibold">Ime</th>
                          <th className="text-left px-4 py-3 text-gray-400 text-sm font-semibold">Email</th>
                          <th className="text-left px-4 py-3 text-gray-400 text-sm font-semibold">Datum</th>
                          <th className="text-left px-4 py-3 text-gray-400 text-sm font-semibold">Rezultat</th>
                          <th className="text-left px-4 py-3 text-gray-400 text-sm font-semibold">Status</th>
                          <th className="text-left px-4 py-3 text-gray-400 text-sm font-semibold">Akcije</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(u => (
                          <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                            <td className="px-4 py-3 text-white font-semibold">{u.name}</td>
                            <td className="px-4 py-3 text-gray-400 text-sm">{u.email}</td>
                            <td className="px-4 py-3 text-gray-400 text-sm">{u.joined}</td>
                            <td className="px-4 py-3">
                              <span className="text-amber-400 font-bold">{u.score}%</span>
                              <span className="text-gray-600 text-xs ml-1">({u.title})</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                u.status === 'active'
                                  ? 'bg-green-600/20 text-green-400'
                                  : 'bg-gray-700 text-gray-400'
                              }`}>
                                {u.status === 'active' ? '✅ Aktivan' : '❌ Otkazan'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button className="text-red-500 hover:text-red-400 text-xs font-semibold transition-colors">
                                Ban
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* FINANCE */}
            {activeTab === 'finance' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>FINANSIJE 💰</h2>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Ukupan prihod (ovaj mesec)', value: `€${monthlyPool.toLocaleString('sr-RS')}`, color: 'text-green-400' },
                    { label: 'Profit platforme (50%)', value: `€${profit.toLocaleString('sr-RS')}`, color: 'text-white' },
                    { label: 'Operativni troškovi (30%)', value: `€${operational.toLocaleString('sr-RS')}`, color: 'text-gray-400' },
                    { label: 'Ukupno donacija (svi meseci)', value: `€${MOCK_TOTAL_DONATED.toLocaleString('sr-RS')}`, color: 'text-red-400' }
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                      <div className={`text-2xl font-black ${item.color}`}>{item.value}</div>
                      <div className="text-gray-500 text-sm mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* Breakdown */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-white mb-6">Raspodela prihoda ovog meseca</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Profit platforme', pct: 50, amount: profit, color: 'bg-gray-600' },
                      { label: 'Operativni troškovi', pct: 30, amount: operational, color: 'bg-gray-700' },
                      { label: '🎰 Lutrija pool', pct: 10, amount: lotteryPool, color: 'bg-amber-600' },
                      { label: '❤️ Donacija pool', pct: 10, amount: charityPool, color: 'bg-red-600' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-10 text-right text-white font-black text-sm">{item.pct}%</div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-300 text-sm">{item.label}</span>
                            <span className="text-white font-bold text-sm">€{item.amount.toFixed(0)}</span>
                          </div>
                          <div className="h-3 bg-gray-800 rounded-full">
                            <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Paddle info */}
                <div className="bg-blue-950/20 border border-blue-800/40 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-white mb-3">Paddle Dashboard</h3>
                  <p className="text-gray-400 text-sm mb-4">Detaljni finansijski izveštaji, refundi i upravljanje pretplatama dostupni su u Paddle admin panelu.</p>
                  <a href="https://vendors.paddle.com" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm">
                    Otvori Paddle Dashboard →
                  </a>
                </div>
              </div>
            )}

            {/* LOTTERY */}
            {activeTab === 'lottery' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>LUTRIJA 🎰</h2>

                {/* Draw machine */}
                <div className="bg-gradient-to-br from-amber-950/40 to-gray-900 border border-amber-800/40 rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-4">🎰</div>
                  <h3 className="text-xl font-black text-white mb-2">Izvlačenje - Avgust 2026</h3>
                  <p className="text-gray-400 text-sm mb-6">Pool: <strong className="text-amber-400">€{lotteryPool.toFixed(0)}</strong> • Učesnici: <strong className="text-white">{MOCK_MEMBER_COUNT.toLocaleString('sr-RS')}</strong></p>

                  {lotteryResult && (
                    <div className={`bg-gray-800 rounded-xl py-4 px-6 mb-6 text-xl font-black transition-all ${lotteryResult.includes('POBEDNIK') ? 'text-amber-400 text-2xl animate-pulse' : 'text-white'}`}>
                      {lotteryResult}
                    </div>
                  )}

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={runLotteryDraw}
                      disabled={lotteryDrawing}
                      className={`font-black text-lg px-8 py-4 rounded-xl transition-all duration-200 shadow-lg ${
                        lotteryDrawing
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-amber-600 hover:bg-amber-500 text-white hover:scale-105 shadow-amber-900/50'
                      }`}
                    >
                      {lotteryDrawing ? '🎲 Izvlačenje...' : '🎰 POKRENI IZVLAČENJE'}
                    </button>
                    {lotteryResult?.includes('POBEDNIK') && (
                      <button className="bg-green-600 hover:bg-green-500 text-white font-black text-lg px-8 py-4 rounded-xl transition-all hover:scale-105">
                        ✅ Potvrdi i isplati
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 text-xs mt-4">Provably fair algoritam • Auditabilno • Javno objavljeno u Telegram kanalu</p>
                </div>

                {/* History */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-white mb-4">Istorija izvlačenja</h3>
                  <div className="space-y-3">
                    {mockLotteryHistory.map(draw => (
                      <div key={draw.id} className="bg-gray-800/50 rounded-xl p-4 flex items-center gap-4">
                        <div className="text-3xl">🏆</div>
                        <div className="flex-1">
                          <div className="text-white font-bold">{draw.winnerName}</div>
                          <div className="text-gray-400 text-sm">{draw.month} • Donacija: {draw.charityFamily}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-amber-400 font-black">€{draw.winnerAmount}</div>
                          <div className="text-red-400 text-xs">+€{draw.charityAmount} donacija</div>
                          <div className="bg-green-600/20 text-green-400 text-xs px-2 py-0.5 rounded-full mt-1">Isplaćeno</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CHARITY */}
            {activeTab === 'charity' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>DONACIJE ❤️</h2>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-white">Nominovane porodice</h3>
                    <span className="text-gray-400 text-sm">8 nominacija ovog meseca</span>
                  </div>
                  <div className="space-y-4">
                    {mockCharityFamilies.map((family) => (
                       <div key={family.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-white font-bold">{family.familyName}</span>
                          <div className="flex gap-2">
                            {family.status === 'shortlisted' ? (
                              <span className="bg-amber-600/20 text-amber-400 text-xs px-2 py-0.5 rounded-full">✓ Shortlist</span>
                            ) : (
                              <button className="bg-amber-600/20 text-amber-400 hover:bg-amber-600/40 text-xs px-2 py-1 rounded-full transition-all font-bold">
                                + Shortlist
                              </button>
                            )}
                            <button className="bg-green-600/20 text-green-400 hover:bg-green-600/40 text-xs px-2 py-1 rounded-full transition-all font-bold">
                              ✓ Verifikuj
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm">{family.story}</p>
                        <div className="mt-2 text-gray-600 text-xs">Nominovao: {family.nominatedBy}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment section */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-white mb-4">Isplata donacije</h3>
                  <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 mb-4">
                    <p className="text-amber-400 font-bold text-sm">⚠️ Pobednik lutrije još nije izabrao porodicu</p>
                    <p className="text-gray-400 text-xs mt-1">Pobednik ima 48h da odabere porodicu iz shortliste.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-xl p-4 text-center">
                      <div className="text-amber-400 font-black text-xl">€{charityPool.toFixed(0)}</div>
                      <div className="text-gray-500 text-xs">Pool za donaciju</div>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-4 text-center">
                      <div className="text-gray-400 font-black text-xl">TBD</div>
                      <div className="text-gray-500 text-xs">Odabrana porodica</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TELEGRAM */}
            {activeTab === 'telegram' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>TELEGRAM ✈️</h2>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Bot status', value: '🟢 Online', sub: 'Vreme rada: 99.9%' },
                    { label: 'Telegram članovi', value: '11.203', sub: '1.284 bez Telegrama' },
                    { label: 'Aktivni danas', value: '3.471', sub: '27.6% engagement' },
                    { label: 'Poruke danas', value: '8.234', sub: 'Prosek: 7.1/članu' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                      <div className="text-xl font-black text-white">{stat.value}</div>
                      <div className="text-gray-500 text-sm">{stat.label}</div>
                      <div className="text-gray-600 text-xs mt-1">{stat.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Broadcast */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-white mb-4">Grupna poruka (Broadcast)</h3>
                  <textarea
                    placeholder="Napiši poruku za sve članove..."
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors resize-none mb-4"
                  />
                  <div className="flex gap-3">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm">
                      📤 Pošalji svim članovima
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm">
                      👁️ Preview
                    </button>
                  </div>
                </div>

                {/* Auto rules */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-white mb-4">Automatska pravila</h3>
                  <div className="space-y-3">
                    {[
                      { rule: 'Nova pretplata → Auto-add u Telegram grupu', active: true },
                      { rule: 'Otkazana pretplata → Auto-remove (after 30d)', active: true },
                      { rule: 'Lutrija izvučena → Auto-announce u #lutrija-i-donacije', active: true },
                      { rule: 'Pobednik odabran → Auto-announce porodicu', active: false }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                        <span className="text-gray-300 text-sm">{item.rule}</span>
                        <div className={`w-10 h-5 rounded-full flex items-center transition-all cursor-pointer ${item.active ? 'bg-green-600' : 'bg-gray-700'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full shadow transition-all ${item.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CONTENT */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>SADRŽAJ 📝</h2>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: '❓', title: 'Pitanja testa', desc: '15 aktivnih pitanja', btn: 'Uredi pitanja' },
                    { icon: '🛂', title: 'Pasoš template', desc: 'Dizajn i informacije', btn: 'Uredi template' },
                    { icon: '🏠', title: 'Landing page', desc: 'Copy i CTA tekstovi', btn: 'Uredi tekst' },
                    { icon: '📊', title: 'SEO podešavanja', desc: 'Meta tagovi, keywords', btn: 'Uredi SEO' }
].map((item) => (
                     <div key={item.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <div className="text-white font-bold">{item.title}</div>
                      <div className="text-gray-500 text-xs mb-3">{item.desc}</div>
                      <button className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg transition-all">
                        {item.btn} →
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-white mb-4">Blog post (SEO)</h3>
                  <div className="space-y-3">
                    <input type="text" placeholder="Naslov posta..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500" />
                    <textarea rows={5} placeholder="Sadržaj posta..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 resize-none" />
                    <div className="flex gap-3">
                      <button className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-2 rounded-xl transition-all text-sm">Objavi</button>
                      <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-5 py-2 rounded-xl transition-all text-sm">Draft</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
