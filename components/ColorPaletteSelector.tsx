
import React from 'react';

interface ColorPaletteSelectorProps {
  palettes: { name: string; colors: string[] }[];
  selectedPalette: string[];
  onSelect: (colors: string[]) => void;
}

const ColorPaletteSelector: React.FC<ColorPaletteSelectorProps> = ({ palettes, selectedPalette, onSelect }) => {
  const isSelected = (paletteColors: string[]) => JSON.stringify(paletteColors) === JSON.stringify(selectedPalette);

  return (
    <div className="grid grid-cols-2 gap-3">
      {palettes.map((palette) => (
        <button
          key={palette.name}
          onClick={() => onSelect(palette.colors)}
          className={`p-2 rounded-lg border-2 transition-all duration-200 ${
            isSelected(palette.colors) ? 'border-blue-500 bg-gray-700' : 'border-transparent hover:bg-gray-700'
          }`}
        >
          <div className="flex justify-center items-center h-8 space-x-1">
            {palette.colors.map((color, index) => (
              <div
                key={index}
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 mt-1 block">{palette.name}</span>
        </button>
      ))}
    </div>
  );
};

export default ColorPaletteSelector;
