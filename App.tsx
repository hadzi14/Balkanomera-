import { useState } from 'react';
import { AppPage, User, TestResult } from './types';
import LandingPage from './components/LandingPage';
import Paywall from './components/Paywall';
import Test from './components/Test';
import Result from './components/Result';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel';

// Secret admin access: click logo 5 times
let logoClickCount = 0;

export default function App() {
  const [page, setPage] = useState<AppPage>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [adminClickCount, setAdminClickCount] = useState(0);

  const handleLogoClick = () => {
    logoClickCount++;
    setAdminClickCount(logoClickCount);
    if (logoClickCount >= 5) {
      logoClickCount = 0;
      setAdminClickCount(0);
      setPage('admin');
    }
  };

  const handlePaymentSuccess = (newUser: User) => {
    setUser(newUser);
    setPage('test');
  };

  const handleTestComplete = (result: TestResult) => {
    setTestResult(result);
    if (user) {
      setUser(prev => prev ? { ...prev, testCompleted: true, testResult: result } : prev);
    }
    setPage('result');
  };

  const handleGoToDashboard = () => {
    setPage('dashboard');
  };

  const handleRetakeTest = () => {
    setTestResult(null);
    setPage('test');
  };

  const handleLogout = () => {
    setUser(null);
    setTestResult(null);
    setPage('landing');
  };

  return (
    <div onClick={page === 'landing' ? handleLogoClick : undefined}>
      {page === 'landing' && (
        <LandingPage onStartTest={() => setPage('paywall')} />
      )}
      {page === 'paywall' && (
        <Paywall
          onPaymentSuccess={handlePaymentSuccess}
          onBack={() => setPage('landing')}
        />
      )}
      {page === 'test' && user && (
        <Test
          user={user}
          onComplete={handleTestComplete}
        />
      )}
      {page === 'result' && testResult && user && (
        <Result
          result={testResult}
          user={user}
          onGoToDashboard={handleGoToDashboard}
        />
      )}
      {page === 'dashboard' && user && (
        <UserDashboard
          user={user}
          result={testResult || undefined}
          onRetakeTest={handleRetakeTest}
          onLogout={handleLogout}
        />
      )}
      {page === 'admin' && (
        <AdminPanel onExit={() => setPage('landing')} />
      )}

      {/* Admin hint when on landing */}
      {page === 'landing' && adminClickCount > 0 && adminClickCount < 5 && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-gray-400 text-xs px-3 py-2 rounded-lg opacity-50">
          Admin: {adminClickCount}/5 klikova
        </div>
      )}
    </div>
  );
}
