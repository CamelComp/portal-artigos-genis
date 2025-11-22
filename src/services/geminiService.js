import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function buildPrompt({ metadata, content }) {
    return `
        Você é um especialista em genética humana e bioinformática.  
        Seu objetivo é extrair informações de artigos científicos.
        Leia os dados do artigo a seguir (título, journal, data, etc) e também seu conteúdo.  
        Em seguida, retorne **APENAS** um JSON válido, em português brasileiro, seguindo EXATAMENTE esta estrutura:
        {
            "gene": "apenas os nomes dos genes estudados no artigo",
            "polymorphism": "apenas os polimorfismos gênicos associados à hipertensão",
            "pValue": "apenas o valor da significância p",
            "pSig": "'Significativo' ou 'Não Significativo'",
            "population": "país ou etnia estudada",
            "sample": "somente o número de participantes",
            "conclusion": "conclusão do artigo"
        }
        REGRAS IMPORTANTES:
        - Não inclua nenhum texto fora do JSON.
        - Caso qualquer campo não seja encontrado, coloque exatamente: "N/E".
        - Os valores devem ser curtos, diretos e objetivos.
        - Se houver múltiplos genes ou polimorfismos, liste-os separados por vírgula.
        - Se houver múltiplos p-values, escolha o principal ou o que estiver relacionado à hipertensão.
        ===============================
        DADOS DO ARTIGO:
        ${JSON.stringify(metadata, null, 2)}
        ===============================
        ABSTRACT:
        ${content}
        ===============================
    `;
}

export async function analyzeArticleWithGemini({ metadata, content }) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = buildPrompt({ metadata, content });
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        try {
            return JSON.parse(text);
        } catch(err) {
            console.error('Erro ao converter resposta em JSON:', err);
            console.log('Resposta recebida:', text);
            return {
                gene: 'N/E',
                polymorphism: 'N/E',
                pValue: 'N/E',
                pSig: 'N/E',
                population: 'N/E',
                sample: 'N/E',
                conclusion: 'N/E'
            };
        }
    } catch(error) {
        console.error('Erro ao processar artigo com Gemini:', error);
        return {
            gene: 'N/E',
            polymorphism: 'N/E',
            pValue: 'N/E',
            pSig: 'N/E',
            population: 'N/E',
            sample: 'N/E',
            conclusion: 'N/E'
        };
    }
}