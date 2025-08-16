import { InspirationImage } from '../types';

// IMPORTANT: The key below is a placeholder.
// You MUST replace it with your own valid Unsplash Access Key to fetch real images.
// Get a free key from the Unsplash Developer portal: https://unsplash.com/developers
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY_HERE';
const BASE_URL = 'https://api.unsplash.com';

interface UnsplashApiResponse {
  results: {
    id: string;
    urls: {
      thumb: string;
      regular: string;
    };
    alt_description: string | null;
  }[];
}

export const searchUnsplashImages = async (query: string): Promise<InspirationImage[]> => {
  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY_HERE') {
    console.warn("Unsplash Access Key is a placeholder. Using fallback images. Please replace 'YOUR_UNSPLASH_ACCESS_KEY_HERE' in services/unsplashService.ts with your actual key.");
    return generateFallbackImages(query);
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=20&orientation=square`, {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ errors: [`Failed to parse error response from Unsplash.`] }));
      console.error(`Unsplash API error: ${response.status} ${response.statusText}`, errorData.errors);
      return generateFallbackImages(query);
    }
    
    const data: UnsplashApiResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Failed to fetch from Unsplash:", error);
    return generateFallbackImages(query);
  }
};

const generateFallbackImages = (query: string): InspirationImage[] => {
    console.log("Using fallback images.");
    return Array.from({ length: 20 }).map((_, i) => ({
        id: `fallback-${query}-${i}`,
        urls: {
            thumb: `https://picsum.photos/seed/${query}${i}/200`,
            regular: `https://picsum.photos/seed/${query}${i}/400`,
        },
        alt_description: `a random image for query: ${query}`
    }));
};
