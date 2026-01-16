import { getRecordsInList } from '@/supabase/crud';

export async function getMetadataByPmid(pmid) {
    if(!pmid) throw new Error('Missing PMID');
    const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi';
    const params = new URLSearchParams({
        db: 'pubmed',
        retmode: 'json',
        id: String(pmid),
        api_key: process.env.PUBMED_API_KEY
    });
    const url = `${baseUrl}?${params.toString()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`NCBI request error: ${response.status}`);
        }
        const data = await response.json(); 
        const result = data.result?.[pmid];
        if(!result) {
            throw new Error(`No data returned for PMID ${pmid}`);
        }
        const doi = result.articleids?.find(i => i.idtype === 'doi')?.value || null;
        const pmcid = result.articleids?.find(i =>
            i.idtype === 'pmcid' || i.idtype === 'pmc'
        )?.value || null;
        return {
            pmid,
            title: result.title,
            pubDate: result.pubdate,
            journal: result.fulljournalname,
            doi,
            pmcid
        };
    } catch(error) {
        console.error(error);
        return null;
    }
}

export async function getFullArticleByPmcid(pmcid) {
    if(!pmcid) throw new Error('Missing PMCID');
    const cleanPmcid = pmcid.replace(/^PMC/i, '');
    const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';
    const params = new URLSearchParams({
        db: 'pmc',
        id: cleanPmcid,
        retmode: 'xml', 
        rettype: 'full',
        api_key: process.env.PUBMED_API_KEY
    });
    const url = `${baseUrl}?${params.toString()}`;
    try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error(`PMC full-text request error: ${response.status}`);
        }
        const xml = await response.text();
        return xml?.trim() || null;
    } catch(error) {
        console.error(error);
        return null;
    }
}

export async function getAbstractByPmid(pmid) {
    if(!pmid) throw new Error('Missing PMID');
    const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';
    const params = new URLSearchParams({
        db: 'pubmed',
        retmode: 'text',
        rettype: 'abstract',
        id: String(pmid),
        api_key: process.env.PUBMED_API_KEY
    });
    const url = `${baseUrl}?${params.toString()}`;
    try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error(`NCBI abstract request error: ${response.status}`);
        }
        const text = await response.text();
        return text?.trim() || null;
    } catch(error) {
        console.error(error);
        return null;
    }
}

export async function getPmidListByQuery(query) {
    const newPmids = [];
    const retMax = query.retMax;
    let retStart = 0;
    while(newPmids.length < retMax) {
        const response = await pmidListRequest({
            query,
            retStart,
            retMax
        });
        const pmids = response.esearchresult.idlist;
        if(!pmids.length) break;
        const existing = await getRecordsInList({
            table: 'articles',
            select: 'pmid',
            column: 'pmid',
            values: pmids
        });
        const existingSet = new Set(existing?.map(a => a.pmid) || []);
        const fresh = pmids.filter(pmid => !existingSet.has(pmid));
        for(const pmid of fresh) {
            if(newPmids.length < retMax) {
                newPmids.push(pmid);
            } else {
                break;
            }
        }
        retStart += retMax;
    }
    return newPmids;
}

async function pmidListRequest({
    query, 
    retStart,
    retMax
}){
    if(!query.terms || !query.initialDate || !query.endDate) {
        throw new Error('Missing required parameters');
    }
    const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
    const params = new URLSearchParams({
        db: 'pubmed',
        term: query.terms.join(' AND '),
        mindate: query.initialDate,
        maxdate: query.endDate,
        rettype: 'xml',
        retmode: 'json',
        retmax: String(retMax),
        retstart: String(retStart),
        text_availability: 'Abstract',
        sort: 'pub date',
    });
    const url = `${baseUrl}?${params.toString()}`;
    const response = await fetch(url);
    if(!response.ok) {
        throw new Error(`NCBI request error: ${response.status}`);
    }
    const data = await response.json();
    return data;
}