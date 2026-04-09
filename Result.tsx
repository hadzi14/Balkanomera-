import React, { useEffect, useRef, useState } from 'react';
import { TestResult, User } from '../types';
import { getTitleByPercentage } from '../data/questions';

interface ResultProps {
  result: TestResult;
  user: User;
  onGoToDashboard: () => void;
}

const Result: React.FC<ResultProps> = ({ result, user, onGoToDashboard }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { title, emoji, description, color } = getTitleByPercentage(result.percentage);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    generateCanvas();
  }, []);

  const generateCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 600;

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 600, 600);
    bgGrad.addColorStop(0, '#0f0f0f');
    bgGrad.addColorStop(0.5, '#1a0505');
    bgGrad.addColorStop(1, '#0f0f0f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 600, 600);

    // Red accent lines
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.lineTo(600, 100);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 500);
    ctx.lineTo(600, 500);
    ctx.stroke();

    // Flag stripes (top)
    const stripeColors = ['#dc2626', '#1d4ed8', '#ffffff20'];
    stripeColors.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(0, i * 6, 600, 5);
    });

    // Main emoji
    ctx.font = '100px serif';
    ctx.textAlign = 'center';
    ctx.fillText(emoji, 300, 200);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px Arial, sans-serif';
    ctx.fillText(title.toUpperCase(), 300, 265);

    // Percentage
    const pctGrad = ctx.createLinearGradient(150, 280, 450, 330);
    pctGrad.addColorStop(0, '#dc2626');
    pctGrad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = pctGrad;
    ctx.font = 'bold 88px Arial, sans-serif';
    ctx.fillText(`${result.percentage}%`, 300, 360);

    // Subtitle
    ctx.fillStyle = '#9ca3af';
    ctx.font = '22px Arial, sans-serif';
    ctx.fillText('BALKANSKA DNK', 300, 400);

    // Name
    ctx.fillStyle = '#e5e7eb';
    ctx.font = 'bold 26px Arial, sans-serif';
    ctx.fillText(user.name, 300, 450);

    // Flag bottom
    const flagStripes2 = ['#dc2626', '#1d4ed8'];
    flagStripes2.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(i * 300, 590, 300, 10);
    });

    // Watermark
    ctx.fillStyle = '#374151';
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText('balkanomerac.com', 300, 570);

    // Border
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 580, 580);

    setCanvasReady(true);
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `balkanomerac-${user.name.replace(' ', '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const generatePassportPDF = () => {
    // We'll generate a visual HTML-based passport and convert to downloadable format
    const passportWindow = window.open('', '_blank');
    if (!passportWindow) return;

    const passportHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Balkan Pasoš - ${user.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #1a1a2e; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: 'Inter', sans-serif; padding: 20px; }
    .passport { width: 500px; background: linear-gradient(135deg, #1a0a0a 0%, #0d1117 50%, #0a1a0a 100%); border: 3px solid #dc2626; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 60px rgba(220,38,38,0.4); }
    .passport-header { background: linear-gradient(90deg, #dc2626, #b91c1c); padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; }
    .passport-header h1 { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: white; letter-spacing: 3px; }
    .passport-header .country { font-size: 12px; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 2px; margin-top: 2px; }
    .flag-bar { display: flex; height: 6px; }
    .flag-bar div { flex: 1; }
    .passport-body { padding: 30px 24px; }
    .photo-section { display: flex; gap: 24px; margin-bottom: 24px; }
    .photo-placeholder { width: 120px; height: 140px; background: linear-gradient(135deg, #1f2937, #111827); border: 2px solid #374151; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; }
    .photo-placeholder .emoji { font-size: 60px; }
    .photo-placeholder .pct { font-size: 14px; font-weight: 900; color: #f59e0b; margin-top: 4px; }
    .info-section { flex: 1; }
    .field { margin-bottom: 16px; }
    .field label { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 4px; }
    .field value { font-size: 16px; color: white; font-weight: 700; display: block; }
    .field.title-field value { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: #f59e0b; letter-spacing: 1px; }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, #374151, transparent); margin: 20px 0; }
    .mrz { background: #0a0a0a; border: 1px solid #1f2937; border-radius: 6px; padding: 12px; font-family: 'Courier New', monospace; font-size: 11px; color: #374151; letter-spacing: 2px; line-height: 1.8; }
    .stamp { position: absolute; top: 50%; right: 20px; transform: translateY(-50%) rotate(-15deg); width: 80px; height: 80px; border: 3px solid #dc262640; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #dc262640; text-align: center; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }
    .badge { display: inline-block; background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px; margin-top: 8px; }
    .passport-footer { background: #0a0a0a; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #374151; }
    .qr-placeholder { width: 48px; height: 48px; background: #1f2937; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
    .print-btn { display: block; width: 100%; padding: 12px; background: #dc2626; color: white; border: none; cursor: pointer; font-size: 16px; font-weight: 700; font-family: 'Inter', sans-serif; margin-top: 16px; border-radius: 8px; }
    @media print { .print-btn { display: none; } body { background: white; } }
  </style>
</head>
<body>
  <div>
    <div class="passport">
      <div class="passport-header">
        <div>
          <h1>🇷🇸 BALKAN PASOŠ</h1>
          <div class="country">Republika Balkan • Zajednica Srca</div>
        </div>
        <div style="font-size: 40px;">👑</div>
      </div>
      <div class="flag-bar">
        <div style="background:#dc2626;"></div>
        <div style="background:#1d4ed8;"></div>
        <div style="background:#f59e0b;"></div>
        <div style="background:#059669;"></div>
      </div>
      <div class="passport-body">
        <div class="photo-section">
          <div class="photo-placeholder">
            <div class="emoji">${emoji}</div>
            <div class="pct">${result.percentage}%</div>
          </div>
          <div class="info-section">
            <div class="field">
              <label>Ime nosača</label>
              <value>${user.name}</value>
            </div>
            <div class="field title-field">
              <label>Balkanska Titula</label>
              <value>${emoji} ${title.toUpperCase()}</value>
            </div>
            <div class="field">
              <label>Balkanska DNK</label>
              <value style="color:#f59e0b; font-size:20px; font-weight:900;">${result.percentage}% Balkanac</value>
            </div>
          </div>
        </div>

        <div class="field">
          <label>ID Pasoša</label>
          <value style="font-family:monospace; font-size:14px; color:#6b7280;">${user.passportId}</value>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px;">
          <div class="field">
            <label>Datum izdavanja</label>
            <value style="font-size:14px;">${new Date().toLocaleDateString('sr-RS')}</value>
          </div>
          <div class="field">
            <label>Bodovi</label>
            <value style="font-size:14px;">${result.score}/45</value>
          </div>
        </div>

        <div class="divider"></div>

        <div class="mrz">
          BLK&lt;&lt;${user.name.replace(' ', '&lt;&lt;').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br>
          ${user.passportId}&lt;&lt;${result.percentage.toString().padStart(3,'0')}BLK&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
        </div>
      </div>
      <div class="passport-footer">
        <span>balkanomerac.com • 2026</span>
        <div class="qr-placeholder">⬛</div>
        <span>Autentičan Balkanac</span>
      </div>
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ ŠTAMPAJ / SAČUVAJ KAO PDF (Ctrl+P)</button>
  </div>
</body>
</html>`;

    passportWindow.document.write(passportHTML);
    passportWindow.document.close();
  };

  const shareText = `Ja sam ${result.percentage}% Balkanac! Moja titula: ${emoji} ${title}\nTestiraj se i ti na balkanomerac.com 🇷🇸`;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 40}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
                opacity: Math.random() * 0.8 + 0.2
              }}
            >
              {['🎉', '🇷🇸', '🥃', '🔥', '⭐', '🎊', '💪', '😈'][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className={`inline-block bg-gradient-to-br ${color} p-6 rounded-3xl mb-6 shadow-2xl`}>
            <div className="text-8xl">{emoji}</div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            {title.toUpperCase()}
          </h1>
          <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400 mb-4">
            {result.percentage}%
          </div>
          <p className="text-gray-400 text-xl max-w-md mx-auto">{description}</p>
          <div className="mt-4 text-gray-500 text-sm">
            Bodovi: <strong className="text-white">{result.score}/45</strong>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-black text-white mb-4">📊 Tvoji odgovori:</h3>
          <div className="grid grid-cols-5 gap-2">
            {result.answers.map((answer, i) => (
              <div
                key={i}
                className={`h-8 rounded flex items-center justify-center text-xs font-bold
                  ${answer.points === 3 ? 'bg-red-600 text-white' :
                    answer.points === 2 ? 'bg-amber-600 text-white' :
                    answer.points === 1 ? 'bg-gray-600 text-white' :
                    'bg-gray-800 text-gray-600'}`}
                title={`Pitanje ${i + 1}: ${answer.points} poena`}
              >
                {answer.points}
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-600 rounded" /> 3pt - Pravi Balkanac</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-600 rounded" /> 2pt - Solid</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-600 rounded" /> 1pt - Malo</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-800 rounded" /> 0pt - Tourist</span>
          </div>
        </div>

        {/* Meme Canvas */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-black text-white mb-4">🖼️ Tvoja slika za dijeljenje:</h3>
          <div className="flex justify-center mb-4">
            <canvas
              ref={canvasRef}
              className="rounded-xl max-w-full border border-gray-700"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          <button
            onClick={downloadMeme}
            disabled={!canvasReady}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            💾 Preuzmi sliku
          </button>
        </div>

        {/* Passport & Share */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="text-4xl mb-3">🛂</div>
            <h3 className="text-lg font-black text-white mb-2">Balkan Pasoš</h3>
            <p className="text-gray-400 text-sm mb-4">Zvanični dokument koji potvrđuje tvoju balkansku prirodu. Personalizovan, jedinstven.</p>
            <button
              onClick={generatePassportPDF}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              📄 Preuzmi Pasoš
            </button>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="text-4xl mb-3">📣</div>
            <h3 className="text-lg font-black text-white mb-2">Podeli rezultat</h3>
            <p className="text-gray-400 text-sm mb-4">Pokaži svetu koliko si Balkanac! Izazovi prijatelje da se testiraju.</p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'Balkanomerač', text: shareText, url: 'https://balkanomerac.com' });
                  } else {
                    navigator.clipboard.writeText(shareText + '\nhttps://balkanomerac.com');
                    alert('Link kopiran!');
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all duration-200"
              >
                📱 Podeli
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(shareText + '\nhttps://balkanomerac.com').then(() => alert('Kopirano!'))}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-xl transition-all duration-200 text-sm"
              >
                📋 Kopiraj tekst
              </button>
            </div>
          </div>
        </div>

        {/* Telegram & Dashboard CTA */}
        <div className="bg-gradient-to-r from-red-950/50 to-amber-950/30 border border-red-800/40 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            DOBRODOŠAO/LA U ZAJEDNICU!
          </h3>
          <p className="text-gray-300 mb-6">
            Sada si deo <strong className="text-amber-400">12.487 pravih Balkanaca</strong>. 
            Pridruži se Telegram zajednici i učestvuj u mesečnoj lutriji!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGoToDashboard}
              className="bg-red-600 hover:bg-red-500 text-white font-black text-lg px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              🏠 MOJ PANEL
            </button>
            <a
              href="https://t.me/balkanomerac"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white font-black text-lg px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 inline-block text-center"
            >
              ✈️ TELEGRAM ZAJEDNICA
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
