import OpenAI from 'openai';
import { IA_MODELS } from '@/utils/iaModels';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function callOpenai({ 
    prompt,
    model = IA_MODELS.openai[4.1].mini,
    temperature = 0.2
}) {
    try {
        const completion = await openai.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            //temperature: temperature
        });
        return completion.choices[0].message.content.trim();
    } catch(error) {
        console.error('Erro ao chamar API OpenAI:', error);
        throw error;
    }
}