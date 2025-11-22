import { getRecordByFilter } from '@/supabase/crud';
import { analyzeArticleWithGemini } from '@/services/geminiService';
import { getAbstractByPmid, getMetadataByPmid, getPmidListByQuery } from '@/services/pubmedService';

export async function GET() {
    try {
        const query = await getRecordByFilter({
            table: 'queries',
            where: 'isActive',
            value: true
        });
        const pmids = await getPmidListByQuery(query);
        const metadata = await getMetadataByPmid(pmids[0]);
        const abstract = await getAbstractByPmid(pmids[0]);
        const analysis = await analyzeArticleWithGemini({
            metadata: metadata,
            content: abstract
        });
        return new Response(JSON.stringify(analysis), {
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