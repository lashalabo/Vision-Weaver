export interface Style {
  id: string;
  name: string;
  prompt: string;
  thumbnail: string;
}

// Updated to reflect a structure compatible with the Unsplash API
export interface InspirationImage {
  id: string;
  urls: {
    thumb: string;
    regular: string;
  };
  alt_description: string | null;
}

export interface GeneratedImage {
  src: string;
  seed: number;
}

export interface CreativeSession {
  originalPrompt: string;
  expandedTags: string[];
  selectedStyle: Style | null;
  colorPalette: string[];
  approvedImages: InspirationImage[];
  dislikedImages: InspirationImage[];
  compositionGuideUrl: string | null;
  // New fields for advanced controls
  guidanceScale: number;
  compositionInfluence: number;
  negativePrompt: string;
  seed: number | null;
}
