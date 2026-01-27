import { getRecordByFilter, insertRecord, updateRecordByFilter } from '@/supabase/crud';
import { analyzeArticle } from '@/presenters/analysisPresenter';
import { getAbstract, getMetadata, getPmidList } from '@/services/pubmedService';
import { PmidListParamsModel } from '@/models/pubmed/PmidListParamsModel';
import { MetadataParamsModel } from '@/models/pubmed/MetadataParamsModel';
import { AbstractParamsModel } from '@/models/pubmed/AbstractParamsModel';

export async function POST(req) {
    try {

        let body = await req.json().catch(() => ({}));

        if(!body || Object.keys(body).length === 0) {
            body = await getRecordByFilter({
                table: 'queries',
                where: 'isActive',
                value: true
            });
        }

        const save = body.save ?? true;
        const provider = body.provider ?? 'GEMINI';
        const pmidListParams = new PmidListParamsModel(body);

        const pmidListData = await getPmidList(pmidListParams);
        const pmidList = pmidListData.pmidList;

        const results = [];

        for(let i = 0; i < pmidList.length; i++) {

            const pmid = pmidList[i];
            console.log(`Processando PMID ${pmid} (${i + 1}/${pmidList.length})`);

            const metadataParams = new MetadataParamsModel({ pmid });
            const metadata = await getMetadata(metadataParams);
            
            const abstractParams = new AbstractParamsModel({ pmid });
            const abstract = await getAbstract(abstractParams);
            
            const analysis = await analyzeArticle({
                terms: pmidListParams.term,
                metadata,
                content: abstract,
                provider: provider
            });

            const unified = { metadata, analysis };
            results.push(unified);

            if(save) {
                await insertRecord('articles', unified);
                await updateRecordByFilter({
                    table: 'queries',
                    values: { retstart: body.retstart + body.retmax },
                    where: 'isActive',
                    value: true
                });
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