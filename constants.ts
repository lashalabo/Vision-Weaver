
import { Style } from './types';

export const ART_STYLES: Style[] = [
  { id: 'photorealistic', name: 'Photorealistic', prompt: 'hyperrealistic, photorealistic, 8k, detailed, sharp focus', thumbnail: 'https://picsum.photos/seed/photorealistic/200' },
  { id: 'anime', name: 'Anime', prompt: 'anime style, vibrant, detailed illustration, by Makoto Shinkai', thumbnail: 'https://picsum.photos/seed/anime/200' },
  { id: 'abstract', name: 'Abstract', prompt: 'abstract art, geometric shapes, non-representational, bold colors', thumbnail: 'https://picsum.photos/seed/abstract/200' },
  { id: 'impressionist', name: 'Impressionist', prompt: 'impressionistic painting, visible brush strokes, soft light, by Monet', thumbnail: 'https://picsum.photos/seed/impressionist/200' },
  { id: 'cyberpunk', name: 'Cyberpunk', prompt: 'cyberpunk city, neon lights, dystopian future, high-tech, Blade Runner aesthetic', thumbnail: 'https://picsum.photos/seed/cyberpunk/200' },
  { id: 'steampunk', name: 'Steampunk', prompt: 'steampunk, victorian era, gears and cogs, intricate machinery, brass and copper', thumbnail: 'https://picsum.photos/seed/steampunk/200' },
  { id: 'fantasy', name: 'Fantasy Art', prompt: 'epic fantasy art, mythical creatures, magical landscape, detailed, by Frank Frazetta', thumbnail: 'https://picsum.photos/seed/fantasy/200' },
  { id: 'minimalist', name: 'Minimalist', prompt: 'minimalist, clean lines, simple shapes, limited color palette, whitespace', thumbnail: 'https://picsum.photos/seed/minimalist/200' },
];

export const COLOR_PALETTES: { name: string; colors: string[] }[] = [
    { name: 'Sunset', colors: ['#FFC371', '#FF5F6D', '#A44A3F'] },
    { name: 'Ocean', colors: ['#0077be', '#00a8cc', '#90c5e8'] },
    { name: 'Forest', colors: ['#2F4F4F', '#556B2F', '#8FBC8F'] },
    { name: 'Neon', colors: ['#39ff14', '#fe019a', '#00f6fe'] },
    { name: 'Vintage', colors: ['#D4B996', '#A0522D', '#694E4E'] },
    { name: 'Monochrome', colors: ['#333333', '#888888', '#DDDDDD'] },
];
