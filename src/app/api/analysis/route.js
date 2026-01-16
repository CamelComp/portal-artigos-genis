import { getRecordByFilter, insertRecord } from '@/supabase/crud';
import { analyzeArticleWithGemini } from '@/services/geminiService';
import { getAbstractByPmid, getMetadataByPmid, getPmidListByQuery } from '@/services/pubmedService';

export async function POST() {
    try {
        const query = await getRecordByFilter({
            table: 'queries',
            where: 'isActive',
            value: true
        });
        const pmids = await getPmidListByQuery(query);
        const results = [];
        for(let i = 0; i < pmids.length; i++) {
            const pmid = pmids[i];
            console.log(`Processando PMID ${pmid} (${i + 1}/${pmids.length})`);
            const metadata = await getMetadataByPmid(pmid);
            const abstract = await getAbstractByPmid(pmid);
            const analysis = await analyzeArticleWithGemini({
                terms: query.terms.join(' AND '),
                metadata,
                content: abstract
            });
            const unified = { metadata, analysis };
            await insertRecord('articles', unified);
            results.push(unified);
        }
        return new Response(JSON.stringify({
            processed: results.length,
            results
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