import { getMetadata, getPmidList } from '@/services/pubmedService';
import { PmidListParamsModel } from '@/models/pubmed/PmidListParamsModel';
import { MetadataParamsModel } from '@/models/pubmed/MetadataParamsModel';

export async function POST(req) {
    try {

        const body = await req.json().catch(() => ({}));

        const save = body.save ?? true;
        const pmidListParams = new PmidListParamsModel(body);

        const pmidListData = await getPmidList(pmidListParams);
        const pmidList = pmidListData.pmidList;
        console.log(pmidList);

        const results = [];

        for(let i = 0; i < pmidList.length; i++) {

            const pmid = pmidList[i];
            console.log(`Processando PMID ${pmid} (${i + 1}/${pmidList.length})`);

            const metadataParams = new MetadataParamsModel({ pmid });
            console.log(metadataParams)
            const metadata = await getMetadata(metadataParams);
            
            
            // const abstract = await getAbstractByPmid(pmid);

            // const analysis = await analyzeArticleWithOpenai({
            //     terms: query.terms.join(' AND '),
            //     metadata,
            //     content: abstract
            // });

            // const unified = { metadata, analysis };
            // results.push(unified);
            results.push(metadata);

            // if(save) {
            //     await insertRecord('articles', unified);
            // }

        }
        console.log(results)
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