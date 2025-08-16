import React, { useState, useCallback, useEffect } from 'react';
import { CreativeSession, InspirationImage, Style } from '../types';
import { ART_STYLES, COLOR_PALETTES } from '../constants';
import { expandPrompt } from '../services/geminiService';
import { searchUnsplashImages } from '../services/unsplashService';
import StyleSelector from './StyleSelector';
import ColorPaletteSelector from './ColorPaletteSelector';
import ImageGrid from './ImageGrid';
import MoodBoard from './MoodBoard';
import Loader from './Loader';
import { MagicWandIcon, NextIcon, CompassIcon } from './icons';
import DiscoveryQuiz from './DiscoveryQuiz';

interface PhaseOneProps {
  onComplete: (sessionData: CreativeSession) => void;
  initialSessionData: CreativeSession | null;
}

const PhaseOne: React.FC<PhaseOneProps> = ({ onComplete, initialSessionData }) => {
  const [session, setSession] = useState<CreativeSession>(initialSessionData || {
    originalPrompt: '',
    expandedTags: [],
    selectedStyle: null,
    colorPalette: [],
    approvedImages: [],
    dislikedImages: [],
    compositionGuideUrl: null,
    // Initialize new fields with defaults
    guidanceScale: 7.5,
    compositionInfluence: 0.5,
    negativePrompt: '',
    seed: null,
  });
  
  const [inspirationImages, setInspirationImages] = useState<InspirationImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isWeavingAfterQuiz, setIsWeavingAfterQuiz] = useState(false);


  const handlePromptExpansion = async () => {
    if (!session.originalPrompt) {
      alert("Please enter a prompt.");
      return;
    }
    setIsLoading(true);
    const tags = await expandPrompt(session.originalPrompt);
    setSession(prev => ({ ...prev, expandedTags: tags }));
    
    // Fetch real images from Unsplash based on tags
    const searchQuery = tags.slice(0, 5).join(' ') || session.originalPrompt;
    const images = await searchUnsplashImages(searchQuery);
    setInspirationImages(images);
    
    setIsLoading(false);
    setStep(1);
  };
  
  // Use an effect to run prompt expansion after the state has updated from the quiz
  useEffect(() => {
    if (isWeavingAfterQuiz && session.originalPrompt) {
      handlePromptExpansion();
      setIsWeavingAfterQuiz(false); // Reset the signal
    }
  }, [isWeavingAfterQuiz, session.originalPrompt]);

  const handleQuizComplete = (tags: string[]) => {
    setIsQuizOpen(false);
    if (tags.length > 0) {
      // Append quiz tags to the existing prompt or create a new one
      const newPrompt = session.originalPrompt
        ? `${session.originalPrompt}, ${tags.join(', ')}`
        : tags.join(', ');
      
      setSession(prev => ({ ...prev, originalPrompt: newPrompt }));
      // Set the signal to true to trigger the useEffect
      setIsWeavingAfterQuiz(true);
    }
  };

  const handleSelectStyle = useCallback((style: Style) => {
    setSession(prev => ({ ...prev, selectedStyle: style }));
  }, []);

  const handleSelectPalette = useCallback((colors: string[]) => {
    setSession(prev => ({ ...prev, colorPalette: colors }));
  }, []);

  const handleImageInteraction = (image: InspirationImage, type: 'approve' | 'dislike') => {
    setSession(prev => {
      const isApproved = prev.approvedImages.some(img => img.id === image.id);
      const isDisliked = prev.dislikedImages.some(img => img.id === image.id);
      
      let newApproved = [...prev.approvedImages];
      let newDisliked = [...prev.dislikedImages];

      if (type === 'approve') {
        if (isApproved) {
          newApproved = newApproved.filter(img => img.id !== image.id);
        } else {
          newApproved.push(image);
          newDisliked = newDisliked.filter(img => img.id !== image.id);
        }
      } else { // 'dislike'
        if (isDisliked) {
          newDisliked = newDisliked.filter(img => img.id !== image.id);
        } else {
          newDisliked.push(image);
          newApproved = newApproved.filter(img => img.id !== image.id);
        }
      }

      return { ...prev, approvedImages: newApproved, dislikedImages: newDisliked };
    });
  };
  
  const handleProceed = () => {
    if (session.approvedImages.length === 0) {
      alert("Please select at least one inspiration image for your mood board.");
      return;
    }
    onComplete(session);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {step === 0 && (
        <div className="text-center max-w-2xl mx-auto p-8 bg-gray-800 rounded-lg shadow-xl animate-slide-up">
          <h2 className="text-3xl font-bold mb-2 text-white">Start with an Idea</h2>
          <p className="text-gray-400 mb-6">Describe the image you want to create, or let us help you find your style.</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={session.originalPrompt}
              onChange={(e) => setSession(prev => ({...prev, originalPrompt: e.target.value}))}
              placeholder="e.g., a logo for a quiet bookstore, vintage style"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              onKeyPress={(e) => e.key === 'Enter' && handlePromptExpansion()}
            />
            <button
              onClick={handlePromptExpansion}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md flex items-center gap-2 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader /> : <> <MagicWandIcon className="w-5 h-5" /> Weave </ >}
            </button>
          </div>
          <div className="mt-4 flex items-center justify-center">
             <div className="h-px bg-gray-600 flex-grow"></div>
             <span className="mx-4 text-gray-500 text-sm">OR</span>
             <div className="h-px bg-gray-600 flex-grow"></div>
          </div>
          <button
            onClick={() => setIsQuizOpen(true)}
            className="mt-4 w-full sm:w-auto px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md flex items-center justify-center gap-2 transition"
          >
            <CompassIcon className="w-5 h-5" />
            Help Me Discover My Style
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 bg-gray-800 rounded-lg animate-slide-up">
              <h3 className="text-xl font-semibold mb-4">1. Select a Style</h3>
              <StyleSelector styles={ART_STYLES} selectedStyle={session.selectedStyle} onSelect={handleSelectStyle} />
            </div>
            <div className="p-6 bg-gray-800 rounded-lg animate-slide-up" style={{ animationDelay: '100ms' }}>
              <h3 className="text-xl font-semibold mb-4">2. Choose a Color Palette</h3>
              <ColorPaletteSelector palettes={COLOR_PALETTES} selectedPalette={session.colorPalette} onSelect={handleSelectPalette} />
            </div>
            <div className="p-6 bg-gray-800 rounded-lg animate-slide-up" style={{ animationDelay: '200ms' }}>
              <h3 className="text-xl font-semibold mb-4">3. Curate Your Mood Board</h3>
              <MoodBoard approvedImages={session.approvedImages} dislikedImages={session.dislikedImages} />
            </div>
            <div className="sticky bottom-8">
               <button
                  onClick={handleProceed}
                  disabled={session.approvedImages.length === 0}
                  className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition disabled:bg-gray-600 disabled:cursor-not-allowed text-lg shadow-lg"
                >
                  Proceed to Generation <NextIcon className="w-6 h-6" />
                </button>
            </div>
          </div>
          <div className="lg:col-span-2 p-6 bg-gray-800 rounded-lg animate-slide-up" style={{ animationDelay: '300ms' }}>
            <h3 className="text-xl font-semibold mb-4">Inspiration Gallery</h3>
            <p className="text-gray-400 mb-4">Click to approve (✅) or dislike (❌) images to build your mood board. This guides the AI.</p>
            <ImageGrid
              images={inspirationImages}
              onImageInteraction={handleImageInteraction}
              approvedImageIds={session.approvedImages.map(i => i.id)}
              dislikedImageIds={session.dislikedImages.map(i => i.id)}
            />
          </div>
        </div>
      )}

      {isQuizOpen && (
        <DiscoveryQuiz
          onClose={() => setIsQuizOpen(false)}
          onComplete={handleQuizComplete}
        />
      )}
    </div>
  );
};

export default PhaseOne;