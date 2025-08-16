import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from './quizData';
import { CloseIcon } from './icons';

interface DiscoveryQuizProps {
  onClose: () => void;
  onComplete: (tags: string[]) => void;
}

const DiscoveryQuiz: React.FC<DiscoveryQuizProps> = ({ onClose, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleSelectChoice = (tags: string[]) => {
    const newTags = [...selectedTags, ...tags];
    setSelectedTags(newTags);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };
  
  const handleFinishQuiz = () => {
    onComplete(selectedTags);
  };

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-6 sm:p-8 max-w-3xl w-full relative transform transition-all duration-300 animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <CloseIcon className="w-6 h-6" />
        </button>

        {!isFinished ? (
          <>
            <div className="text-center mb-6">
              <p className="text-sm font-semibold text-blue-400 tracking-wider uppercase">
                Step {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-white">{currentQuestion.question}</h2>
              <p className="text-gray-400 mt-2">{currentQuestion.dichotomy}: <span className="font-semibold text-gray-300">{currentQuestion.choices[0].label}</span> vs <span className="font-semibold text-gray-300">{currentQuestion.choices[1].label}</span></p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {currentQuestion.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectChoice(choice.tags)}
                  className="group relative rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <img src={choice.imageUrl} alt={choice.label} className="w-full h-48 sm:h-64 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-white text-lg font-semibold">{choice.label}</h3>
                  </div>
                </button>
              ))}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-8">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>
          </>
        ) : (
          <div className="text-center p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Discovery Complete!</h2>
              <p className="text-gray-400 mb-6">We've identified your key preferences. These will be added to your prompt to guide the AI.</p>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {Array.from(new Set(selectedTags)).map(tag => (
                      <span key={tag} className="bg-gray-700 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">{tag}</span>
                  ))}
              </div>
              <button
                onClick={handleFinishQuiz}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-300 text-lg shadow-lg"
              >
                Start Weaving
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoveryQuiz;
