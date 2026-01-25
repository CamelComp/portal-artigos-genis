import { getPmidList } from '@/services/pubmedService';
import { PmidListParamsModel } from '@/models/pubmed/PmidListParamsModel';

export async function POST(req) {
    try {
        const body = await req.json().catch(() => ({}));
        const params = new PmidListParamsModel(body);
        const pmidListData = await getPmidList(params);
        return new Response(JSON.stringify({...pmidListData }), {
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