

import { GoogleGenAI, Type } from "@google/genai";
import { CopywritingSuggestions, ElementType, LayoutSuggestion } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

type AspectRatio = '16:9' | '1:1' | '9:16' | '4:3' | '3:4';

export const generateImage = async (prompt: string, negativePrompt: string, style: string, aspectRatio: AspectRatio): Promise<string> => {
    try {
        const finalPrompt = `${style}, for an advertising billboard, ${prompt}${negativePrompt ? `, --no ${negativePrompt}` : ''}`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: finalPrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        throw new Error("No image was generated.");
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
};

export const generateCopywritingSuggestions = async (productName: string, targetAudience: string, keyMessage: string): Promise<CopywritingSuggestions> => {
    const prompt = `
        برای محصول و مخاطب زیر، چند گزینه متن تبلیغاتی جذاب و کوتاه به زبان فارسی تولید کن.
        - نام محصول: ${productName}
        - مخاطب هدف: ${targetAudience}
        - پیام کلیدی یا ویژگی اصلی: ${keyMessage}

        لطفا ۳ گزینه برای تیتر (headline) و ۳ گزینه برای شعار تبلیغاتی (slogan) ارائه بده.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "شما یک کپی‌رایتر تبلیغاتی خلاق و حرفه‌ای برای بازار ایران هستید. پاسخ‌های شما باید به زبان فارسی، کوتاه، گیرا و مناسب برای بیلبوردهای تبلیغاتی باشد.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        headlines: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "لیستی از ۳ تیتر تبلیغاتی جذاب"
                        },
                        slogans: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "لیستی از ۳ شعار تبلیغاتی کوتاه و به یاد ماندنی"
                        }
                    },
                    required: ["headlines", "slogans"]
                }
            }
        });

        const jsonText = response.text.trim();
        const suggestions = JSON.parse(jsonText) as CopywritingSuggestions;
        
        if (!suggestions.headlines || !suggestions.slogans) {
             throw new Error("Invalid JSON structure received from API.");
        }

        return suggestions;

    } catch (error) {
        console.error("Error generating copywriting suggestions:", error);
        throw error;
    }
};


export const generateLayoutSuggestions = async (
    elements: { id: string; type: ElementType; width: number; height: number; text?: string }[]
): Promise<LayoutSuggestion[][]> => {
    const elementDescriptions = elements.map(el =>
        `- Element ID: ${el.id}, Type: ${el.type}, Size: ${Math.round(el.width)}x${Math.round(el.height)}` + (el.text ? `, Text: "${el.text.substring(0, 30)}..."` : '')
    ).join('\n');

    const prompt = `
        You are a professional graphic designer creating layouts for a 1280x720 pixel advertising billboard.
        Given the following set of design elements:
        ${elementDescriptions}

        Generate 3 distinct, professional