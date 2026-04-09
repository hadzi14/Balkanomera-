import { Question } from '../types';

export const questions: Question[] = [
  {
    id: 1,
    text: "Koliko rakije možeš da popiješ pre nego što počneš da pričaš o politici?",
    options: [
      "0 (ne pijem) 🍵",
      "1-2 čaše (turistički nivo) 🥃",
      "3-5 čaša (solid) 🍾",
      "Pitanje je glupo, rakija JE život 🔥"
    ],
    points: [0, 1, 2, 3]
  },
  {
    id: 2,
    text: "Da li si ikada lagao/la da si 'malo bolestan/na' da bi izbegao/la porodični ručak?",
    options: [
      "Nikad 😇",
      "Jednom-dvaput 😅",
      "Redovno 😏",
      "To mi je glavni hobi 😂"
    ],
    points: [0, 1, 2, 3]
  },
  {
    id: 3,
    text: "Koliko para u KEŠU držiš 'za crne dane' kod kuće?",
    options: [
      "Ništa (živim na kartici) 💳",
      "50-200€ 💵",
      "200-1000€ 💰",
      "Neću da kažem, al' je DOBRO 🤫"
    ],
    points: [0, 1, 2, 3]
  },
  {
    id: 4,
    text: "Koliko puta si rekao/la 'ajde bre' u poslednjih 24h?",
    options: [
      "0 🤔",
      "1-3 😌",
      "5-10 😄",
      "Gubim račun 🫠"
    ],
    points: [0, 1, 2, 3]
  },
  {
    id: 5,
    text: "Da li znaš šta je 'ćuška' i da li je praviš?",
    options: [
      "Nemam pojma šta je to 🤷",
      "Čuo/la sam ali ne znam 🤔",
      "Znam šta je ali ne pravim 😐",
      "Pravim i PONOSIM SE 🌶️"
    ],
    points: [0, 1, 2, 3]
  },
  {
    id: 6,
    text: "Koliko puta si se svađao/la sa komšijom u poslednjih godinu dana?",
    options: [
      "0 (nemam komšije / dobri smo) 🕊️",
      "1-2 puta (sitnice) 😤",
      "3-5 puta (redovno) 😠",
      "U ratu smo ⚔️"
    ],
    points: [0, 1, 2, 3]
  },
  {
    id: 7,
    text: "Da li si ikada kupio/la nešto samo zato što je bilo NA AKCIJI?",
    options: [
      "Ne, kupujem samo što mi treba 🎯",
      "Retko 🤏",
      "Često 🛒",
      "Imam zalihe za apokalipsu 📦"
    ],
    points: [0, 1, 2, 3]
  },
  {
    id: 8,
    text: "Šta radiš kad ti komšija ne pozdravi?",
    options: [
      "Ništa, možda me nije video/la 😌",
      "Ne pozdravljam ni ja sledeći put 😶",
      "Pitam šta mu je 🤨",
      "Rat do istrebljenja 💀"
    ],
    points: [0, 1, 2, 3]
  },
  {
    id: 9,
    text: "Koliko puta si poslao/la poruku bivšem/bivšoj posle ponoći?",
    options: [
      "Nikad 😇",
      "1-2 puta (greškom) 😳",
      "3-5 puta (slabost) 😬",
      "Redovno (ne kajem se) 😎"
    ],
    points: [0, 1, 2, 3]
  },
  {
    id: 10,
    text: "Da li koristiš reč 'fazon' u svakodnevnom govoru?",
    options: [
      "Ne znam šta znači 🤷",
      "Znam ali ne koristim 🙅",
      "Ponekad 🤌",
      "Fazon svaka druga reč 💬"
    ],
    points: [0, 1, 2, 3]
  },
  {
    id: 11,
    text: "Koliko kafica dnevno popiješ?",
    options: [
      "0-1 (espresso u prolazu) ☕",
      "2-3 (normalno) ☕☕",
      "4-6 (klasik) ☕☕☕",
      "Gubim račun, KAFA = ŽIVOT ⚡"
    ],
    points: [0, 1, 2, 3]
  },
  {
    id: 12,
    text: "Da li si ikada rekao/la 'ovo je POSLEDNJI PUT' a onda ponovio/la istu grešku?",
    options: [
      "Ne, kad kažem to mislim 💪",
      "Jednom-dvaput 😅",
      "Redovno 🔄",
      "To mi je mantra 🙏"
    ],
    points: [0, 1, 2, 3]
  },
  {
    id: 13,
    text: "Koliko dugo razgovaraš sa komšijom kad ga sretneš 'samo da kažem ćao'?",
    options: [
      "1-2 minuta ⏱️",
      "5-10 minuta 🕐",
      "20-30 minuta 🕑",
      "1h+ (izgubim pojam vremena) 🕰️"
    ],
    points: [0, 1, 2, 3]
  },
  {
    id: 14,
    text: "Da li imaš 'povez' za nešto?",
    options: [
      "Ne 🤷",
      "Imam za 1-2 stvari 😏",
      "Imam za dosta stvari 😎",
      "Imam povez ZA SVE 👑"
    ],
    points: [0, 1, 2, 3]
  },
  {
    id: 15,
    text: "Da li si spreman/na da se svađaš sa strankama o ceni?",
    options: [
      "Ne, plaćam koliko piše 🏷️",
      "Ako je previše skupo 🤔",
      "Uvek tražim popust 💰",
      "Svađa je DEO ISKUSTVA 🎭"
    ],
    points: [0, 1, 2, 3]
  }
];

export const getTitleByPercentage = (percentage: number): { title: string; emoji: string; description: string; color: string } => {
  if (percentage <= 20) return {
    title: "Turista",
    emoji: "🏖️",
    description: "Balkanska kultura te još nije dotakla. Ali ne brini, ima nade!",
    color: "from-blue-400 to-cyan-500"
  };
  if (percentage <= 40) return {
    title: "Balkan Beginner",
    emoji: "🥉",
    description: "Tek počinješ da otkivaš šta znači biti Balkanac. Dobro podnesi!",
    color: "from-amber-400 to-orange-500"
  };
  if (percentage <= 60) return {
    title: "Balkan Lite",
    emoji: "🥈",
    description: "Imaš dobar temelj. Još malo rakije i biće te puno!",
    color: "from-gray-400 to-gray-600"
  };
  if (percentage <= 80) return {
    title: "Pravi Balkanac",
    emoji: "🥇",
    description: "Prava balkanska krv teče kroz tvoje vene. Ponosimo se!",
    color: "from-yellow-400 to-amber-500"
  };
  if (percentage <= 95) return {
    title: "Balkan Šejtan",
    emoji: "😈",
    description: "Ti si legenda. Komšije se plaše, rakija te voli, Balkan te poštuje!",
    color: "from-red-500 to-rose-600"
  };
  return {
    title: "Balkan Bog",
    emoji: "👑",
    description: "Nisi čovek/žena - ti si POJAVA. Balkan se klanja pred tobom!",
    color: "from-purple-600 to-indigo-700"
  };
};
