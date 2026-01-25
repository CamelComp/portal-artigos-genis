import { PmidListResponseModel } from "@/models/pubmed/PmidListResponseModel";

export async function getMetadata(params) {
    if(!params.id) {
        throw new Error('Missing required parameters');
    }
    try {
        const response = await fetch(params.buildUrl());
        const data = await response.json(); 
        const result = data.result?.[params.id];
        if(!result) {
            throw new Error(`No data returned for PMID ${params.id}`);
        }
        return result;
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

export async function getPmidList(params){
    if(!params.term || !params.mindate || !params.maxdate) {
        throw new Error('Missing required parameters');
    }
    try {
        const response = await fetch(params.buildUrl());
        const json = await response.json();
        return new PmidListResponseModel({ params, json });
    } catch(error) {
        console.error(error);
        return null;
    }
}