import React, { useState, useEffect, useMemo } from 'react';
import { CreativeSession, InspirationImage, GeneratedImage } from '../types';
import { generateFinalPrompt, generateImages } from '../services/geminiService';
import Loader from './Loader';
import { BackIcon, GenerateIcon, SparklesIcon, PromptStrengthIcon, CompositionIcon, SeedIcon } from './icons';

interface PhaseTwoProps {
  sessionData: CreativeSession;
  onBack: () => void;
}

const PhaseTwo: React.FC<PhaseTwoProps> = ({ sessionData, onBack }) => {
  const [session, setSession] = useState<CreativeSession>(sessionData);
  const [finalPrompt, setFinalPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSeed, setCurrentSeed] = useState<number | null>(null);

  const initialNegativePrompt = useMemo(() => {
    const dislikedTags = new Set<string>();
    sessionData.dislikedImages.forEach(img => {
      if (img.alt_description) {
        img.alt_description.split(/, | /).forEach(tag => {
            if (tag.length > 3) dislikedTags.add(tag);
        });
      }
    });
    return Array.from(dislikedTags).slice(0, 10).join(', ');
  }, [sessionData.dislikedImages]);

  useEffect(() => {
    setSession(prev => ({...prev, negativePrompt: initialNegativePrompt }));
  }, [initialNegativePrompt]);
  
  useEffect(() => {
    const prompt = generateFinalPrompt(session);
    setFinalPrompt(prompt);
  }, [session]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedImages([]);
    const seedToUse = currentSeed ?? Math.floor(Math.random() * 1000000);
    setCurrentSeed(seedToUse);
    const images = await generateImages(finalPrompt, seedToUse);
    setGeneratedImages(images);
    setIsLoading(false);
  };
  
  const handleSelectCompositionGuide = (image: InspirationImage) => {
    setSession(prev => ({ ...prev, compositionGuideUrl: prev.compositionGuideUrl === image.urls.regular ? null : image.urls.regular }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSession(prev => ({...prev, [name]: parseFloat(value)}));
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSession(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      <div className="lg:col-span-1 space-y-6">
        <div className="p-6 bg-gray-800 rounded-lg animate-slide-up">
          <button onClick={onBack} className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-4">
             <BackIcon className="w-5 h-5" /> Back to Discovery
          </button>

          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><SparklesIcon className="w-6 h-6 text-blue-400"/> Final Prompt</h3>
          <p className="text-sm text-gray-400 mb-2">This is the final prompt crafted from your choices. You can edit it directly for advanced control.</p>
          <textarea
            value={finalPrompt}
            onChange={(e) => setFinalPrompt(e.target.value)}
            className="w-full h-48 p-3 bg-gray-700 text-gray-300 rounded-md border border-gray-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="p-6 bg-gray-800 rounded-lg animate-slide-up" style={{animationDelay: '100ms'}}>
            <h3 className="text-xl font-semibold mb-4">Advanced Controls</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="guidanceScale" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                        <PromptStrengthIcon className="w-5 h-5" /> Prompt Strength (Guidance)
                    </label>
                    <input
                        id="guidanceScale"
                        name="guidanceScale"
                        type="range"
                        min="1"
                        max="20"
                        step="0.5"
                        value={session.guidanceScale}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                     <div className="text-xs text-gray-500 text-right">{session.guidanceScale}</div>
                </div>
                <div>
                     <label htmlFor="compositionInfluence" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                        <CompositionIcon className="w-5 h-5" /> Composition Influence
                    </label>
                    <input
                        id="compositionInfluence"
                        name="compositionInfluence"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={session.compositionInfluence}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                        disabled={!session.compositionGuideUrl}
                    />
                    <div className="text-xs text-gray-500 text-right">{session.compositionInfluence}</div>
                </div>
            </div>
        </div>

        <div className="p-6 bg-gray-800 rounded-lg animate-slide-up" style={{animationDelay: '200ms'}}>
          <h3 className="text-xl font-semibold mb-4">Composition Guide</h3>
          <p className="text-sm text-gray-400 mb-4">Select an image to guide the structure. Enables the 'Influence' slider.</p>
          <div className="grid grid-cols-3 gap-2">
            {sessionData.approvedImages.map(img => (
              <img
                key={img.id}
                src={img.urls.thumb}
                alt={img.alt_description || `Inspiration ${img.id}`}
                onClick={() => handleSelectCompositionGuide(img)}
                className={`rounded-md cursor-pointer transition-all duration-200 ${session.compositionGuideUrl === img.urls.regular ? 'ring-4 ring-blue-500 scale-105' : 'opacity-70 hover:opacity-100'}`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-800 rounded-lg animate-slide-up" style={{animationDelay: '300ms'}}>
            <h3 className="text-xl font-semibold mb-4">Negative Prompt</h3>
            <p className="text-sm text-gray-400 mb-2">Describe elements to avoid. Pre-filled from your disliked images.</p>
            <textarea
                name="negativePrompt"
                value={session.negativePrompt}
                onChange={handleTextChange}
                placeholder="e.g., blurry, text, watermark, deformed hands"
                className="w-full h-24 p-3 bg-gray-700 text-gray-300 rounded-md border border-gray-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
        </div>
        
        <div className="sticky bottom-8">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition disabled:bg-gray-600 disabled:cursor-not-allowed text-lg shadow-lg"
            >
              {isLoading ? <><Loader /> Generating...</> : <><GenerateIcon className="w-6 h-6"/> Generate Images</>}
            </button>
        </div>
      </div>

      <div className="lg:col-span-2 p-6 bg-gray-800 rounded-lg animate-slide-up" style={{animationDelay: '400ms'}}>
        <h3 className="text-2xl font-semibold mb-4">Generated Visions</h3>
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-96 text-gray-400">
            <Loader size="lg"/>
            <p className="mt-4 text-lg">Weaving your vision...</p>
            <p className="text-sm">This may take a moment.</p>
          </div>
        )}
        {!isLoading && generatedImages.length === 0 && (
           <div className="flex flex-col items-center justify-center h-96 text-gray-500 border-2 border-dashed border-gray-700 rounded-lg">
            <p className="text-lg">Your generated images will appear here.</p>
            <p>Click "Generate Images" to start.</p>
          </div>
        )}
        {generatedImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {generatedImages.map((img, index) => (
              <div key={index} className="group relative aspect-square bg-gray-700 rounded-lg overflow-hidden animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                <img src={img.src} alt={`Generated image ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                        onClick={() => setCurrentSeed(img.seed)}
                        className="w-full text-xs text-white bg-gray-700/80 hover:bg-blue-600 rounded-md p-1 flex items-center justify-center gap-1 transition-colors"
                    >
                        <SeedIcon className="w-4 h-4" /> Reuse Seed: {img.seed}
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaseTwo;
