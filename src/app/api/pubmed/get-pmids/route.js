import { getPmidListByQuery } from '@/services/pubmedService';
import { getRecordByFilter } from '@/supabase/crud';

export async function GET() {
    try {
        const query = await getRecordByFilter({
            table: 'queries',
            where: 'isActive',
            value: true
        });
        const pmids = await getPmidListByQuery(query);
        return new Response(JSON.stringify(pmids), {
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