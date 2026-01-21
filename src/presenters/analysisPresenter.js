import { callOpenai } from '@/services/openaiService';
import { buildAnalysisPrompt } from '@/utils/prompts';
import { AnalysisModel } from '@/models/AnalysisModel';

export async function analyzeArticleWithOpenai({ terms, metadata, content }) {
    try {
        const prompt = buildAnalysisPrompt({ terms, metadata, content });
        const text = await callOpenai({ prompt });
        try {
            const jsonString = extractJsonObject(text);
            return JSON.parse(jsonString);
        } catch(err) {
            console.error('Erro ao converter resposta em JSON:', err);
            console.log('Resposta recebida:', text);
            return AnalysisModel;
        }
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