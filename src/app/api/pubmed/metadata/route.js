import { getMetadata } from '@/services/pubmedService';
import { MetadataParamsModel } from '@/models/pubmed/MetadataParamsModel';

export async function POST(req) {
    try {
        const body = await req.json().catch(() => ({}));
        const params = new MetadataParamsModel(body);
        const metadata = await getMetadata(params);
        return new Response(JSON.stringify({
            params: params,
            metadata: metadata
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch(error) {
        return new Response(
            JSON.stringify({ error: error.message }), 
            { status: 500 }
        );
    }
}