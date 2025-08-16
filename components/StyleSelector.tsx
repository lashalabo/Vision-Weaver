
import React from 'react';
import { Style } from '../types';

interface StyleSelectorProps {
  styles: Style[];
  selectedStyle: Style | null;
  onSelect: (style: Style) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedStyle, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {styles.map((style) => (
        <button
          key={style.id}
          onClick={() => onSelect(style)}
          className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
            selectedStyle?.id === style.id ? 'border-blue-500 scale-105' : 'border-transparent hover:border-blue-600'
          }`}
        >
          <img src={style.thumbnail} alt={style.name} className="w-full h-20 object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">{style.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default StyleSelector;
