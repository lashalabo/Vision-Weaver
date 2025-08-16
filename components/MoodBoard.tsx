import React from 'react';
import { InspirationImage } from '../types';

interface MoodBoardProps {
  approvedImages: InspirationImage[];
  dislikedImages: InspirationImage[];
}

const MoodBoard: React.FC<MoodBoardProps> = ({ approvedImages, dislikedImages }) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-md font-semibold text-green-400 mb-2">Positive Inspiration ({approvedImages.length})</h4>
        <div className="flex flex-wrap gap-2">
          {approvedImages.length > 0 ? (
            approvedImages.map(img => (
              <img key={img.id} src={img.urls.thumb} alt={img.alt_description || `Approved ${img.id}`} className="w-12 h-12 rounded-md object-cover" />
            ))
          ) : (
            <p className="text-xs text-gray-500">Select images you like from the gallery.</p>
          )}
        </div>
      </div>
      <div>
        <h4 className="text-md font-semibold text-red-400 mb-2">Negative Inspiration ({dislikedImages.length})</h4>
        <div className="flex flex-wrap gap-2">
          {dislikedImages.length > 0 ? (
            dislikedImages.map(img => (
              <img key={img.id} src={img.urls.thumb} alt={img.alt_description || `Disliked ${img.id}`} className="w-12 h-12 rounded-md object-cover" />
            ))
          ) : (
            <p className="text-xs text-gray-500">Select images with elements to avoid.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodBoard;
