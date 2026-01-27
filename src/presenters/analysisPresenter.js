import { callOpenai } from '@/services/openaiService';
import { callGemini } from '@/services/geminiService';
import { buildAnalysisPrompt } from '@/utils/prompts';
import { AI_PROVIDER } from '@/models/AiProviderEnum';
import { AnalysisExtractionModel } from '@/models/AnalysisExtractionModel';

export async function analyzeArticle({ 
    terms, 
    metadata, 
    content, 
    provider 
}) {
    try {
        const prompt = buildAnalysisPrompt({ terms, metadata, content });
        let response;
        switch(provider) {
            case AI_PROVIDER.GEMINI:
                response = await callGemini({ prompt });
                break;
            case AI_PROVIDER.OPENAI:
            default:
                response = await callOpenai({ prompt });
                break;
        }
        const jsonString = extractJsonObject(response);
        return new AnalysisExtractionModel(JSON.parse(jsonString));
    } catch(error) {
        console.error('Erro ao processar artigo com OpenAI:', error);
        return { error: error.message };
    }
}

function extractJsonObject(text) {
    const match = text.match(/\{[\s\S]*\}/);
    if(!match) throw new Error('JSON não encontrado');
    return match[0];
}