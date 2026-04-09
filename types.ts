export type AppPage = 'landing' | 'paywall' | 'test' | 'result' | 'dashboard' | 'admin';

export interface Answer {
  questionId: number;
  selectedOption: number; // 0-3
  points: number;
}

export interface TestResult {
  score: number;
  percentage: number;
  title: string;
  titleEmoji: string;
  answers: Answer[];
  completedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'none';
  testCompleted: boolean;
  testResult?: TestResult;
  joinedAt: Date;
  passportId: string;
  telegramJoined: boolean;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  points: number[]; // points per option (0-3)
}

export interface LotteryDraw {
  id: string;
  month: string;
  drawDate: Date;
  winnerName: string;
  winnerAmount: number;
  charityFamily: string;
  charityAmount: number;
  totalPool: number;
  status: 'upcoming' | 'drawn' | 'paid';
}

export interface CharityFamily {
  id: string;
  familyName: string;
  story: string;
  nominatedBy: string;
  status: 'nominated' | 'shortlisted' | 'winner' | 'paid';
  amountReceived?: number;
  thankYouMessage?: string;
}
