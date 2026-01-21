import { getRecordByFilter, insertRecord } from '@/supabase/crud';
import { analyzeArticleWithOpenai } from '@/presenters/analysisPresenter';
import { getAbstractByPmid, getMetadataByPmid, getPmidListByQuery } from '@/services/pubmedService';

export async function POST(req) {
    try {

        const body = await req.json().catch(() => ({}));
        const save = body.save ?? true;

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

            const analysis = await analyzeArticleWithOpenai({
                terms: query.terms.join(' AND '),
                metadata,
                content: abstract
            });

            const unified = { metadata, analysis };
            results.push(unified);

            if(save) {
                await insertRecord('articles', unified);
            }

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