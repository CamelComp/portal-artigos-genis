import { insertRecord } from '@/supabase/crud';
import { analyzeArticleWithOpenai } from '@/presenters/analysisPresenter';
import { getAbstractByPmid, getMetadataByPmid } from '@/services/pubmedService';

const PREDEFINED_PMIDS = [
    "39369762",
];

export async function POST() {
    try {
        const results = [];
        for (let i = 0; i < PREDEFINED_PMIDS.length; i++) {
            const pmid = PREDEFINED_PMIDS[i];
            console.log(`Processando PMID ${pmid} (${i + 1}/${PREDEFINED_PMIDS.length})`);

            const metadata = await getMetadataByPmid(pmid);
            const abstract = await getAbstractByPmid(pmid);

            const analysis = await analyzeArticleWithOpenai({
                terms: 'major depression AND genetic',
                metadata,
                content: abstract
            });

            const unified = {
                metadata,
                analysis,
                ia: 1
            };

            await insertRecord('articles', unified);
            results.push(unified);
        }

        return new Response(
            JSON.stringify({
                processed: results.length,
                results
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}