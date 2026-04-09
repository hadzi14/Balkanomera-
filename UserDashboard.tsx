import React, { useState } from 'react';
import { User, TestResult } from '../types';
import { getTitleByPercentage } from '../data/questions';
import { mockLotteryHistory, mockCharityFamilies, NEXT_DRAW_DATE, MOCK_MEMBER_COUNT } from '../data/mockData';

interface UserDashboardProps {
  user: User;
  result?: TestResult;
  onRetakeTest: () => void;
  onLogout: () => void;
}

type DashboardTab = 'home' | 'lottery' | 'charity' | 'telegram' | 'settings' | 'passport';

const UserDashboard: React.FC<UserDashboardProps> = ({ user, result, onRetakeTest, onLogout }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('home');
  const [nominationForm, setNominationForm] = useState({ familyName: '', story: '' });
  const [nominationSubmitted, setNominationSubmitted] = useState(false);
  const [telegramClicked, setTelegramClicked] = useState(false);

  const titleInfo = result ? getTitleByPercentage(result.percentage) : null;

  // Days until next draw
  const now = new Date();
  const daysUntilDraw = Math.ceil((NEXT_DRAW_DATE.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Estimate lottery pool
  const estimatedPool = MOCK_MEMBER_COUNT * 2 * 0.1; // 10% of revenue

  const tabs = [
    { id: 'home' as DashboardTab, icon: '🏠', label: 'Početna' },
    { id: 'passport' as DashboardTab, icon: '🛂', label: 'Pasoš' },
    { id: 'lottery' as DashboardTab, icon: '🎲', label: 'Lutrija' },
    { id: 'charity' as DashboardTab, icon: '❤️', label: 'Donacije' },
    { id: 'telegram' as DashboardTab, icon: '✈️', label: 'Telegram' },
    { id: 'settings' as DashboardTab, icon: '⚙️', label: 'Podešavanja' },
  ];

  const generatePassport = () => {
    if (!result) return;
    const { emoji, title } = getTitleByPercentage(result.percentage);
    const passportWindow = window.open('', '_blank');
    if (!passportWindow) return;

    const passportHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Balkan Pasoš - ${user.name}</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { background:#1a1a2e; display:flex; justify-content:center; align-items:center; min-height:100vh; font-family:Arial,sans-serif; padding:20px; }
.passport { width:500px; background:linear-gradient(135deg,#1a0a0a 0%,#0d1117 50%,#0a1a0a 100%); border:3px solid #dc2626; border-radius:16px; overflow:hidden; box-shadow:0 25px 60px rgba(220,38,38,0.4); }
.passport-header { background:linear-gradient(90deg,#dc2626,#b91c1c); padding:20px 24px; display:flex; justify-content:space-between; align-items:center; }
.passport-header h1 { font-size:24px; color:white; letter-spacing:3px; font-weight:900; }
.passport-body { padding:30px 24px; }
.field { margin-bottom:16px; }
.field label { font-size:10px; color:#6b7280; text-transform:uppercase; letter-spacing:2px; display:block; margin-bottom:4px; }
.field value { font-size:16px; color:white; font-weight:700; display:block; }
.divider { height:1px; background:linear-gradient(90deg,transparent,#374151,transparent); margin:20px 0; }
.mrz { background:#0a0a0a; border:1px solid #1f2937; border-radius:6px; padding:12px; font-family:'Courier New',monospace; font-size:11px; color:#374151; letter-spacing:2px; line-height:1.8; }
.passport-footer { background:#0a0a0a; padding:12px 24px; display:flex; justify-content:space-between; font-size:10px; color:#374151; }
.print-btn { display:block; width:100%; padding:12px; background:#dc2626; color:white; border:none; cursor:pointer; font-size:16px; font-weight:700; margin-top:16px; border-radius:8px; }
@media print { .print-btn { display:none; } }
</style></head><body>
<div>
<div class="passport">
<div class="passport-header"><div><h1>🇷🇸 BALKAN PASOŠ</h1><div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:4px;">REPUBLIKA BALKAN • 2026</div></div><div style="font-size:40px;">${emoji}</div></div>
<div style="display:flex;height:6px;"><div style="flex:1;background:#dc2626;"></div><div style="flex:1;background:#1d4ed8;"></div><div style="flex:1;background:#f59e0b;"></div></div>
<div class="passport-body">
<div style="display:flex;gap:20px;margin-bottom:24px;">
<div style="width:100px;height:120px;background:#1f2937;border:2px solid #374151;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;">
<div style="font-size:50px;">${emoji}</div>
<div style="font-size:14px;font-weight:900;color:#f59e0b;">${result.percentage}%</div>
</div>
<div style="flex:1;">
<div class="field"><label>Ime nosača</label><value>${user.name}</value></div>
<div class="field"><label>Titula</label><value style="color:#f59e0b;font-size:20px;">${emoji} ${title.toUpperCase()}</value></div>
<div class="field"><label>Balkanska DNK</label><value style="color:#f59e0b;">${result.percentage}% Balkanac</value></div>
</div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
<div class="field"><label>ID Pasoša</label><value style="font-family:monospace;font-size:12px;color:#6b7280;">${user.passportId}</value></div>
<div class="field"><label>Datum</label><value style="font-size:14px;">${new Date().toLocaleDateString('sr-RS')}</value></div>
<div class="field"><label>Bodovi</label><value style="font-size:14px;">${result.score}/45</value></div>
<div class="field"><label>Rang</label><value style="font-size:14px;">${title}</value></div>
</div>
<div class="divider"></div>
<div class="mrz">BLK&lt;&lt;${user.name.replace(' ','&lt;&lt;').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br>${user.passportId}&lt;&lt;${result.percentage.toString().padStart(3,'0')}BLK&lt;&lt;&lt;&lt;&lt;&lt;</div>
</div>
<div class="passport-footer"><span>balkanomerac.com</span><span>Autentičan Balkanac</span></div>
</div>
<button class="print-btn" onclick="window.print()">🖨️ ŠTAMPAJ / SAČUVAJ KAO PDF (Ctrl+P)</button>
</div></body></html>`;
    passportWindow.document.write(passportHTML);
    passportWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-black">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-white">{user.name}</div>
              <div className="text-gray-500 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                Aktivan pretplatnik
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {result && (
              <div className="hidden sm:flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-1.5">
                <span className="text-xl">{titleInfo?.emoji}</span>
                <div>
                  <div className="text-white font-bold text-sm">{result.percentage}%</div>
                  <div className="text-gray-500 text-xs">{titleInfo?.title}</div>
                </div>
              </div>
            )}
            <button
              onClick={onLogout}
              className="text-gray-500 hover:text-white text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800"
            >
              Odjavi se
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
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
            {/* HOME TAB */}
            {activeTab === 'home' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  DOBRODOŠAO/LA, {user.name.split(' ')[0].toUpperCase()}! 👋
                </h2>

                {result ? (
                  <div className={`bg-gradient-to-br ${titleInfo?.color} p-[2px] rounded-2xl`}>
                    <div className="bg-gray-900 rounded-2xl p-6">
                      <div className="flex items-center gap-4">
                        <div className="text-6xl">{titleInfo?.emoji}</div>
                        <div>
                          <div className="text-gray-400 text-sm">Tvoj rezultat</div>
                          <div className="text-4xl font-black text-white">{result.percentage}% Balkanac</div>
                          <div className="text-amber-400 font-bold text-lg">{titleInfo?.title}</div>
                        </div>
                      </div>
                      <div className="mt-4 h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-amber-400 rounded-full transition-all duration-1000"
                          style={{ width: `${result.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
                    <div className="text-4xl mb-3">🔥</div>
                    <h3 className="text-xl font-black text-white mb-2">Test nije završen</h3>
                    <p className="text-gray-400 mb-4">Uradi test i otkrij koliko si Balkanac!</p>
                    <button onClick={onRetakeTest} className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-all">
                      POČNI TEST →
                    </button>
                  </div>
                )}

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">🎲</div>
                    <div className="text-xl font-black text-amber-400">€{estimatedPool.toFixed(0)}</div>
                    <div className="text-gray-500 text-xs">Lutrija pool</div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">📅</div>
                    <div className="text-xl font-black text-white">{daysUntilDraw}d</div>
                    <div className="text-gray-500 text-xs">Do sledećeg izvlačenja</div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">✅</div>
                    <div className="text-xl font-black text-green-400">Aktivan</div>
                    <div className="text-gray-500 text-xs">Status pretplate</div>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">👥</div>
                    <div className="text-xl font-black text-white">{(12487).toLocaleString('sr-RS')}</div>
                    <div className="text-gray-500 text-xs">Članova zajednice</div>
                  </div>
                </div>
              </div>
            )}

            {/* PASSPORT TAB */}
            {activeTab === 'passport' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>BALKAN PASOŠ 🛂</h2>
                {result ? (
                  <>
                    {/* Passport preview */}
                    <div className="bg-gradient-to-br from-gray-900 to-red-950/20 border border-red-800/40 rounded-2xl overflow-hidden">
                      <div className="bg-red-700 p-4 flex justify-between items-center">
                        <div>
                          <div className="font-black text-xl text-white" style={{ letterSpacing: '3px' }}>🇷🇸 BALKAN PASOŠ</div>
                          <div className="text-red-200 text-xs">REPUBLIKA BALKAN • 2026</div>
                        </div>
                        <div className="text-5xl">{titleInfo?.emoji}</div>
                      </div>
                      <div className="p-6 flex gap-4">
                        <div className="w-20 h-24 bg-gray-800 border border-gray-700 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                          <div className="text-3xl">{titleInfo?.emoji}</div>
                          <div className="text-amber-400 font-black text-sm">{result.percentage}%</div>
                        </div>
                        <div>
                          <div className="text-gray-400 text-xs mb-0.5">IME NOSAČA</div>
                          <div className="text-white font-bold text-lg">{user.name}</div>
                          <div className="text-gray-400 text-xs mt-3 mb-0.5">TITULA</div>
                          <div className="text-amber-400 font-black">{titleInfo?.emoji} {titleInfo?.title?.toUpperCase()}</div>
                          <div className="text-gray-400 text-xs mt-3 mb-0.5">ID PASOŠA</div>
                          <div className="text-gray-300 font-mono text-sm">{user.passportId}</div>
                        </div>
                      </div>
                      <div className="px-6 pb-4 font-mono text-xs text-gray-700 border-t border-gray-800 pt-3">
                        BLK&lt;&lt;{user.name.replace(' ', '<<').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br />
                        {user.passportId}&lt;&lt;{result.percentage.toString().padStart(3, '0')}BLK&lt;&lt;&lt;&lt;
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={generatePassport}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
                      >
                        📄 Preuzmi PDF
                      </button>
                      <button
                        onClick={onRetakeTest}
                        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all"
                      >
                        🔄 Uradi ponovo
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                    <div className="text-5xl mb-4">🛂</div>
                    <h3 className="text-xl font-black text-white mb-2">Uradi test prvo!</h3>
                    <p className="text-gray-400 mb-4">Pasoš se generiše nakon što završiš test.</p>
                    <button onClick={onRetakeTest} className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-all">
                      POČNI TEST →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* LOTTERY TAB */}
            {activeTab === 'lottery' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>MESEČNA LUTRIJA 🎲</h2>

                {/* Current draw */}
                <div className="bg-gradient-to-br from-amber-950/40 to-gray-900 border border-amber-800/40 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-amber-400 text-sm font-bold mb-1">SLEDEĆE IZVLAČENJE</div>
                      <div className="text-3xl font-black text-white">1. Avgust 2026</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-sm">Pool</div>
                      <div className="text-3xl font-black text-amber-400">€{estimatedPool.toFixed(0)}</div>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4 flex items-center gap-3">
                    <div className="text-3xl">🎰</div>
                    <div>
                      <div className="text-white font-bold">Ti si u igri!</div>
                      <div className="text-gray-400 text-sm">Svaki aktivan pretplatnik automatski učestvuje</div>
                    </div>
                    <div className="ml-auto">
                      <div className="bg-green-600/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-700/40">
                        AKTIVAN
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-amber-400 font-black">{daysUntilDraw}</div>
                      <div className="text-gray-600 text-xs">Dana</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-white font-black">{MOCK_MEMBER_COUNT.toLocaleString('sr-RS')}</div>
                      <div className="text-gray-600 text-xs">Učesnika</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-red-400 font-black">1/{MOCK_MEMBER_COUNT.toLocaleString('sr-RS')}</div>
                      <div className="text-gray-600 text-xs">Šansa</div>
                    </div>
                  </div>
                </div>

                {/* How it works */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-white mb-4">Kako funkcioniše?</h3>
                  <div className="space-y-3">
                    {[
                      { step: '1', icon: '🎰', title: 'Izvlačenje 1. u mesecu', desc: 'Random algoritam bira jednog aktivnog pretplatnika' },
                      { step: '2', icon: '💰', title: 'Pobednik dobija 10%', desc: `Direktna isplata na račun (≈€${estimatedPool.toFixed(0)} ovog meseca)` },
                      { step: '3', icon: '❤️', title: 'Pobednik bira porodicu', desc: 'Iz shortliste nominovanih porodica bira kojoj ide još 10%' },
                      { step: '4', icon: '📊', title: 'Javni izveštaj', desc: 'Sve transakcije su dokumentovane i objavljene u Telegram kanalu' }
                    ].map(item => (
                      <div key={item.step} className="flex items-start gap-3">
                        <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0 mt-0.5">
                          {item.step}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span>{item.icon}</span>
                            <span className="text-white font-bold text-sm">{item.title}</span>
                          </div>
                          <div className="text-gray-500 text-xs mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* History */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-white mb-4">Istorija dobitnika</h3>
                  <div className="space-y-3">
                    {mockLotteryHistory.map(draw => (
                      <div key={draw.id} className="bg-gray-800/50 rounded-xl p-4 flex items-center gap-4">
                        <div className="text-2xl">🏆</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">{draw.winnerName}</span>
                            <span className="bg-green-600/20 text-green-400 text-xs px-2 py-0.5 rounded-full">Isplaćeno</span>
                          </div>
                          <div className="text-gray-400 text-xs">{draw.month} • Porodica: {draw.charityFamily}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-amber-400 font-black">€{draw.winnerAmount}</div>
                          <div className="text-red-400 text-xs">+€{draw.charityAmount} donacija</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CHARITY TAB */}
            {activeTab === 'charity' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>DONACIJE ❤️</h2>

                {/* Shortlisted families */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-white">Nominovane porodice ovog meseca</h3>
                    <span className="bg-red-600/20 text-red-400 text-xs px-2 py-1 rounded-full font-bold">TOP 3</span>
                  </div>
                  <div className="space-y-4">
                    {mockCharityFamilies.map((family, i) => (
                      <div key={family.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-red-600/20 border border-red-700 rounded-full flex items-center justify-center text-red-400 text-xs font-black">
                              {i + 1}
                            </div>
                            <span className="text-white font-bold">{family.familyName}</span>
                          </div>
                          <span className="bg-amber-600/20 text-amber-400 text-xs px-2 py-0.5 rounded-full">Shortlist</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{family.story}</p>
                        <div className="mt-2 text-gray-600 text-xs">Nominovao: {family.nominatedBy}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs mt-4">
                    * Pobednik lutrije bira finalnu porodicu. Svaka porodica je verifikovana od strane admina.
                  </p>
                </div>

                {/* Nominate form */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-white mb-2">Nominiraj porodicu</h3>
                  <p className="text-gray-400 text-sm mb-4">Znaš porodicu koja treba pomoć? Predloži je! Sve nominacije prolaze verifikaciju.</p>

                  {nominationSubmitted ? (
                    <div className="text-center py-6">
                      <div className="text-5xl mb-3">✅</div>
                      <h4 className="text-xl font-black text-white mb-2">Nominacija primljena!</h4>
                      <p className="text-gray-400">Admin će verifikovati i dodati na shortlistu ako odgovara.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-400 text-sm font-semibold mb-1 block">Ime porodice</label>
                        <input
                          type="text"
                          value={nominationForm.familyName}
                          onChange={e => setNominationForm(prev => ({ ...prev, familyName: e.target.value }))}
                          placeholder="Porodica Petrović"
                          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm font-semibold mb-1 block">Njihova priča</label>
                        <textarea
                          value={nominationForm.story}
                          onChange={e => setNominationForm(prev => ({ ...prev, story: e.target.value }))}
                          placeholder="Ispričaj nam o ovoj porodici i zašto im treba pomoć..."
                          rows={4}
                          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors resize-none"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (nominationForm.familyName && nominationForm.story) setNominationSubmitted(true);
                        }}
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
                      >
                        ❤️ NOMINIRAJ PORODICU
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TELEGRAM TAB */}
            {activeTab === 'telegram' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>TELEGRAM ZAJEDNICA ✈️</h2>

                <div className="bg-gradient-to-br from-blue-950/40 to-gray-900 border border-blue-800/40 rounded-2xl p-6">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-3">✈️</div>
                    <h3 className="text-xl font-black text-white">Pridruži se najaktivnijoj balkanskoj zajednici</h3>
                    <p className="text-gray-400 mt-2">12.487+ članova • 24/7 aktivan • Premium sadržaj</p>
                  </div>

                  {telegramClicked ? (
                    <div className="bg-green-600/10 border border-green-700/40 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">✅</div>
                      <p className="text-green-400 font-bold">Odlično! Klikni na link u Telegramu da potvrdiš pristup.</p>
                      <p className="text-gray-500 text-xs mt-1">Link važi 24h. Ako istekne, generiši novi ovde.</p>
                    </div>
                  ) : (
                    <a
                      href="https://t.me/balkanomerac"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setTelegramClicked(true)}
                      className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-lg py-4 rounded-xl transition-all hover:scale-105 active:scale-95 text-center shadow-lg shadow-blue-900/50"
                    >
                      ✈️ PRIDRUŽI SE TELEGRAM GRUPI
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: '📢', name: '#dobrodošlica', desc: 'Uvod i pravila' },
                    { icon: '💬', name: '#glavni-chat', desc: 'Opšta priča' },
                    { icon: '🍲', name: '#recepti', desc: 'Balkanske delicije' },
                    { icon: '❤️', name: '#upoznavanje', desc: 'Dating i prijatelji' },
                    { icon: '⚔️', name: '#ratne-priče', desc: 'Anegdote' },
                    { icon: '🎲', name: '#lutrija', desc: 'Live izvlačenja' },
                    { icon: '📊', name: '#rezultati', desc: 'Balkanomerač' },
                    { icon: '🎯', name: '#balkanski-hackovi', desc: '"Povez" mreža' }
                  ].map((ch, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{ch.icon}</span>
                        <div>
                          <div className="text-blue-400 text-xs font-mono font-bold">{ch.name}</div>
                          <div className="text-gray-500 text-xs">{ch.desc}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>PODEŠAVANJA ⚙️</h2>

                {/* Profile */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-white mb-4">Profil</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm font-semibold mb-1 block">Ime i prezime</label>
                      <input type="text" defaultValue={user.name} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm font-semibold mb-1 block">Email adresa</label>
                      <input type="email" defaultValue={user.email} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" />
                    </div>
                    <button className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all">
                      Sačuvaj izmene
                    </button>
                  </div>
                </div>

                {/* Subscription */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-white mb-4">Pretplata</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400">Status</span>
                      <span className="bg-green-600/20 text-green-400 font-bold px-3 py-1 rounded-full text-sm">✅ Aktivna</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-800">
                      <span className="text-gray-400">Iznos</span>
                      <span className="text-white font-bold">€2.00/mesec</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-800">
                      <span className="text-gray-400">Sledeća naplata</span>
                      <span className="text-white font-bold">1. Avg 2026</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-800">
                      <span className="text-gray-400">Plaćanje</span>
                      <span className="text-white font-bold">•••• •••• •••• 4242</span>
                    </div>
                    <div className="pt-2 border-t border-gray-800">
                      <button className="w-full bg-gray-800 hover:bg-red-900/30 text-red-400 hover:text-red-300 font-bold py-3 rounded-xl transition-all border border-gray-700 hover:border-red-800">
                        ❌ Otkaži pretplatu
                      </button>
                      <p className="text-gray-600 text-xs text-center mt-2">Otkaz stupa odmah. Pristup traje do kraja plaćenog perioda.</p>
                    </div>
                  </div>
                </div>

                {/* Payment method */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-white mb-4">Način plaćanja</h3>
                  <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 bg-blue-900 rounded flex items-center justify-center text-xs text-white font-bold">VISA</div>
                      <span className="text-white">•••• •••• •••• 4242</span>
                    </div>
                    <span className="text-gray-500 text-sm">12/28</span>
                  </div>
                  <button className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors">
                    + Promeni karticu (Paddle)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
