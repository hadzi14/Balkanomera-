import { LotteryDraw, CharityFamily } from '../types';

export const mockLotteryHistory: LotteryDraw[] = [
  {
    id: '1',
    month: 'Januar 2026',
    drawDate: new Date('2026-02-01'),
    winnerName: 'M. Petrović',
    winnerAmount: 187,
    charityFamily: 'Porodica Nikolić (Niš)',
    charityAmount: 187,
    totalPool: 1870,
    status: 'paid'
  },
  {
    id: '2',
    month: 'Februar 2026',
    drawDate: new Date('2026-03-01'),
    winnerName: 'A. Jovanović',
    winnerAmount: 203,
    charityFamily: 'Porodica Marković (Beograd)',
    charityAmount: 203,
    totalPool: 2030,
    status: 'paid'
  },
  {
    id: '3',
    month: 'Mart 2026',
    drawDate: new Date('2026-04-01'),
    winnerName: 'S. Đorđević',
    winnerAmount: 241,
    charityFamily: 'Porodica Stojanović (Kragujevac)',
    charityAmount: 241,
    totalPool: 2410,
    status: 'paid'
  }
];

export const mockCharityFamilies: CharityFamily[] = [
  {
    id: '1',
    familyName: 'Porodica Milić',
    story: 'Majka sa troje dece, izgubila posao zbog bolesti. Jednosobni stan, deca idu u školu...',
    nominatedBy: 'Marko P.',
    status: 'shortlisted'
  },
  {
    id: '2',
    familyName: 'Porodica Stanković',
    story: 'Deda i baka, penzija jedva pokriva lekove. Unuk im pomaže koliko može...',
    nominatedBy: 'Ana J.',
    status: 'shortlisted'
  },
  {
    id: '3',
    familyName: 'Porodica Đurić',
    story: 'Mladi bračni par sa bebom od 6 meseci. Kuća im je oštećena u poplavi...',
    nominatedBy: 'Stefan M.',
    status: 'shortlisted'
  }
];

export const MOCK_MEMBER_COUNT = 12487;
export const MOCK_MONTHLY_REVENUE = 24974; // €2 × 12487
export const MOCK_TOTAL_DONATED = 8743;
export const MOCK_LUCKY_WINNERS = 3;
export const NEXT_DRAW_DATE = new Date('2026-08-01');
