import React, { useState } from 'react';
import { questions } from '../data/questions';
import { Answer, TestResult, User } from '../types';
import { getTitleByPercentage } from '../data/questions';

interface TestProps {
  user: User;
  onComplete: (result: TestResult) => void;
}

const Test: React.FC<TestProps> = ({ user, onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const progress = ((currentQ) / questions.length) * 100;
  const question = questions[currentQ];

  const handleSelect = (optionIndex: number) => {
    if (isAnimating) return;
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null || isAnimating) return;

    const newAnswer: Answer = {
      questionId: question.id,
      selectedOption,
      points: question.points[selectedOption]
    };

    const newAnswers = [...answers, newAnswer];
    setIsAnimating(true);
    setDirection('forward');

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setAnswers(newAnswers);
        setCurrentQ(prev => prev + 1);
        setSelectedOption(null);
        setIsAnimating(false);
      } else {
        // Calculate results
        const totalScore = newAnswers.reduce((sum, a) => sum + a.points, 0);
        const maxScore = questions.length * 3;
        const percentage = Math.round((totalScore / maxScore) * 100);
        const { title, emoji } = getTitleByPercentage(percentage);

        const result: TestResult = {
          score: totalScore,
          percentage,
          title,
          titleEmoji: emoji,
          answers: newAnswers,
          completedAt: new Date()
        };
        onComplete(result);
      }
    }, 300);
  };

  const handlePrev = () => {
    if (currentQ === 0 || isAnimating) return;
    setDirection('backward');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQ(prev => prev - 1);
      setAnswers(prev => prev.slice(0, -1));
      // Restore previous answer
      const prevAnswer = answers[currentQ - 1];
      setSelectedOption(prevAnswer ? prevAnswer.selectedOption : null);
      setIsAnimating(false);
    }, 300);
  };

  // Fun loading messages based on current question
  const funMessages = [
    "Proveravamo tvoje balkanske gene...",
    "Konsultujemo se sa dedom...",
    "Pitamo komšije...",
    "Merimo nivo kafane...",
    "Analiziramo zalihe rakije..."
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇷🇸</span>
              <span className="text-gray-400 text-sm font-semibold">Pitanje {currentQ + 1} od {questions.length}</span>
            </div>
            <div className="text-gray-500 text-sm">
              {user.name.split(' ')[0]} • {Math.round(progress)}% završeno
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-8">
        <div className={`w-full max-w-2xl transition-all duration-300 ${isAnimating ? (direction === 'forward' ? 'opacity-0 translate-x-4' : 'opacity-0 -translate-x-4') : 'opacity-100 translate-x-0'}`}>
          {/* Question number badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg shadow-red-900/50">
              {currentQ + 1}
            </div>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i < currentQ ? 'bg-red-500 w-4' :
                    i === currentQ ? 'bg-amber-400 w-6' :
                    'bg-gray-800 w-3'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
              {question.text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-200 font-semibold text-lg
                  ${selectedOption === i
                    ? 'bg-red-600/20 border-red-500 text-white shadow-lg shadow-red-900/30 scale-[1.02]'
                    : 'bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800 hover:border-gray-600 hover:text-white'
                  }`}
              >
                <span className="inline-block w-8 h-8 rounded-full border-2 mr-3 text-center text-sm font-black leading-7 flex-shrink-0 align-middle
                  ${selectedOption === i ? 'border-red-500 bg-red-600 text-white' : 'border-gray-700 text-gray-500'}
                ">
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            {currentQ > 0 && (
              <button
                onClick={handlePrev}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-4 rounded-xl transition-all duration-200"
              >
                ← Nazad
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className={`flex-1 font-black text-lg py-4 rounded-xl transition-all duration-200 shadow-lg
                ${selectedOption !== null
                  ? 'bg-red-600 hover:bg-red-500 text-white hover:scale-105 active:scale-95 shadow-red-900/50'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }`}
            >
              {currentQ === questions.length - 1 ? '🔥 VIDI REZULTAT' : 'Sledeće pitanje →'}
            </button>
          </div>

          {/* Fun fact */}
          {currentQ > 2 && (
            <div className="mt-6 text-center text-gray-600 text-sm italic">
              {funMessages[currentQ % funMessages.length]}
            </div>
          )}
        </div>
      </div>

      {/* Bottom encouragement */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-900 py-3 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-2 text-gray-700 text-sm">
          <span>💡</span>
          <span>Budi iskren/a – Balkan ne trpi lažove!</span>
        </div>
      </div>
    </div>
  );
};

export default Test;
