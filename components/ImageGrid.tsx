import React from 'react';
import { InspirationImage } from '../types';
import { CheckIcon, CloseIcon } from './icons';

interface ImageGridProps {
  images: InspirationImage[];
  onImageInteraction: (image: InspirationImage, type: 'approve' | 'dislike') => void;
  approvedImageIds: string[];
  dislikedImageIds: string[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageInteraction, approvedImageIds, dislikedImageIds }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {images.map((image) => {
        const isApproved = approvedImageIds.includes(image.id);
        const isDisliked = dislikedImageIds.includes(image.id);
        
        let overlayClass = 'opacity-0 group-hover:opacity-100';
        if (isApproved) overlayClass = 'opacity-100 bg-green-900/70';
        if (isDisliked) overlayClass = 'opacity-100 bg-red-900/70';

        return (
          <div key={image.id} className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer">
            <img src={image.urls.regular} alt={image.alt_description || `Inspiration ${image.id}`} className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${overlayClass}`}>
              <div className="flex justify-center items-center h-full gap-4">
                <button
                  onClick={() => onImageInteraction(image, 'approve')}
                  className={`p-3 rounded-full transition ${isApproved ? 'bg-green-500' : 'bg-gray-700/80 hover:bg-green-600'}`}
                >
                  <CheckIcon className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => onImageInteraction(image, 'dislike')}
                  className={`p-3 rounded-full transition ${isDisliked ? 'bg-red-500' : 'bg-gray-700/80 hover:bg-red-600'}`}
                >
                  <CloseIcon className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImageGrid;
