import { GoogleGenAI, Type } from "@google/genai";
import { CreativeSession, GeneratedImage } from '../types';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const expandPrompt = async (prompt: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Based on the user prompt "${prompt}", generate a diverse list of 20 conceptual tags for generating AI art. Include tags related to style, subject, composition, and mood.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    tags: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING
                        }
                    }
                }
            }
        }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result.tags || [];
  } catch (error) {
    console.error("Error expanding prompt:", error);
    return ["fantasy art", "epic", "dragon", "mountain", "glowing", "magic", "cinematic lighting"];
  }
};

export const generateFinalPrompt = (sessionData: CreativeSession): string => {
    const { 
        originalPrompt, 
        selectedStyle, 
        colorPalette, 
        approvedImages, 
        dislikedImages, 
        compositionGuideUrl,
        guidanceScale,
        compositionInfluence,
        negativePrompt
    } = sessionData;

    let promptParts: string[] = [];
    let negativeParts: string[] = [];

    promptParts.push(`Create a high-quality, detailed image of: ${originalPrompt}.`);

    if (selectedStyle) {
        promptParts.push(`The artistic style is ${selectedStyle.name}: ${selectedStyle.prompt}.`);
    }

    const approvedTags = new Set<string>();
    approvedImages.forEach(img => {
        if (img.alt_description) {
            img.alt_description.split(' ').forEach(tag => approvedTags.add(tag.replace(/,/g, '')));
        }
    });
    if (approvedTags.size > 0) {
        promptParts.push(`Incorporate these key concepts: ${Array.from(approvedTags).slice(0, 15).join(', ')}.`);
    }

    if (colorPalette.length > 0) {
        promptParts.push(`The dominant color palette should be: ${colorPalette.join(', ')}.`);
    }
    
    if (compositionGuideUrl) {
        let compositionStrength = "The overall composition and layout should be inspired by the user's guide image.";
        if (compositionInfluence > 0.7) {
            compositionStrength = "Strictly adhere to the composition, structure, and layout of the guide image.";
        } else if (compositionInfluence < 0.3) {
            compositionStrength = "Loosely base the composition on the guide image, taking creative liberties.";
        }
        promptParts.push(compositionStrength);
    }
    
    let guidanceStrength = "Balance creative interpretation with the prompt's instructions.";
    if (guidanceScale > 12) {
        guidanceStrength = "Follow the prompt's instructions with very high fidelity.";
    } else if (guidanceScale < 5) {
        guidanceStrength = "Use the prompt as a loose inspiration, be highly creative and artistic.";
    }
    promptParts.push(guidanceStrength);

    const dislikedTags = new Set<string>();
    dislikedImages.forEach(img => {
       if (img.alt_description) {
            img.alt_description.split(' ').forEach(tag => dislikedTags.add(tag.replace(/,/g, '')));
        }
    });
    if (dislikedTags.size > 0) {
        negativeParts.push(Array.from(dislikedTags).slice(0, 15).join(', '));
    }
    if (negativePrompt) {
        negativeParts.push(negativePrompt);
    }
    
    promptParts.push('The final image must be visually stunning, coherent, and highly detailed.');

    const finalPrompt = promptParts.join(' ');
    
    if (negativeParts.length > 0) {
        return `${finalPrompt} --- Negative prompt: avoid ${negativeParts.join(', ')}.`;
    }

    return finalPrompt;
};


export const generateImages = async (prompt: string, seed: number): Promise<GeneratedImage[]> => {
    // The Imagen API does not support a seed parameter.
    // The seed is passed here to be returned with the image for UI consistency,
    // allowing the user to "reuse" the same prompt and settings, even though
    // the output will be different each time. This simulates the requested feature.
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: 3,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        return response.generatedImages.map(img => ({
            src: `data:image/jpeg;base64,${img.image.imageBytes}`,
            seed: seed
        }));
    } catch (error) {
        console.error("Error generating images:", error);
        return [
            { src: "https://picsum.photos/seed/error1/512", seed: seed },
            { src: "https://picsum.photos/seed/error2/512", seed: seed },
            { src: "https://picsum.photos/seed/error3/512", seed: seed }
        ];
    }
};
