import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function buildPrompt({ terms, metadata, content }) {
    return `
        Você é um especialista em genética humana e bioinformática.  
        Seu objetivo é extrair informações de artigos científicos.
        Leia os dados do artigo a seguir (título, journal, data, etc) e também seu conteúdo.  
        Em seguida, retorne **APENAS** um JSON válido, em português brasileiro, seguindo EXATAMENTE esta estrutura:
        {
            "gene": "array com os nomes dos genes estudados no artigo",
            "polymorphism": "array com os polimorfismos gênicos associados à ${terms}",
            "pValue": "array com os valores da significância p",
            "pSig": "array com 'Significativo' ou 'Não Significativo'",
            "population": "array com o nome do país ou etnia estudada",
            "sample": "array com os número de participantes",
            "conclusion": "conclusão do artigo",
            "clinicalRelevance": "texto curto sobre a possível aplicação clínica dos achados"
        }
        REGRAS IMPORTANTES:
        - Não inclua nenhum texto fora do JSON.
        - Não use markdown, blocos de código ou comentários.
        - Caso qualquer campo não seja encontrado, coloque: null.
        - Os valores devem ser curtos, diretos e objetivos.
        - Mesmo que genes, polimorfismos, populações, etc, tenha só um valor, retorne como array.
        - Se houver múltiplos genes, polimorfismos, populações, etc, use arrays ordenados por relevância.
        - Se houver múltiplos p-values, escolha o principal ou o que estiver relacionado à ${terms}.
        - O campo "clinicalRelevance" deve ser:
         - Uma interpretação científica plausível;
         - Não categórica (use termos como "pode", "sugere", "potencial");
         - Não deve afirmar aplicação clínica estabelecida;
         - Baseada nos achados do estudo e conhecimento biomédico geral;
         - Se não for possível inferir relevância clínica, retorne null.
        ===============================
        DADOS DO ARTIGO:
        ${JSON.stringify(metadata, null, 2)}
        ===============================
        ABSTRACT:
        ${content}
        ===============================
    `;
}

export async function analyzeArticleWithGemini({ terms, metadata, content }) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = buildPrompt({ terms, metadata, content });
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        try {
            const jsonString = extractJsonObject(text);
            return JSON.parse(jsonString);
        } catch(err) {
            console.error('Erro ao converter resposta em JSON:', err);
            console.log('Resposta recebida:', text);
            return {
                gene: null,
                polymorphism: null,
                pValue: null,
                pSig: null,
                population: null,
                sample: null,
                conclusion: null
            };
        }
    } catch(error) {
        console.error('Erro ao processar artigo com Gemini:', error);
        return { error: error.message };
    }
}

function extractJsonObject(text) {
    const match = text.match(/\{[\s\S]*\}/);
    if(!match) throw new Error('JSON não encontrado');
    return match[0];
}