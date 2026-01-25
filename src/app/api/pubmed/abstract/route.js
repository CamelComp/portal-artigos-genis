import { getAbstract } from '@/services/pubmedService';
import { AbstractParamsModel } from '@/models/pubmed/AbstractParamsModel';

export async function POST(req) {
    try {
        const body = await req.json().catch(() => ({}));
        const params = new AbstractParamsModel(body);
        const abstract = await getAbstract(params);
        return new Response(abstract, {
            status: 200,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    } catch(error) {
        return new Response(
            JSON.stringify({ error: error.message }), 
            { status: 500 }
        );
    }
}