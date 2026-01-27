import { GoogleGenerativeAI } from '@google/generative-ai';
import { IA_MODELS } from '@/utils/iaModels';

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function callGemini({ 
    prompt,
    model = IA_MODELS.gemini[2.5].flash,
    temperature = 0.2
}) {
    try {
        const generativeModel = gemini.getGenerativeModel({
            model,
            generationConfig: {
                temperature
            }
        });
        const result = await generativeModel.generateContent(prompt);
        return result.response.text().trim();
    } catch(error) {
        console.error('Erro ao chamar API Gemini:', error);
        throw error;
    }
}