import { MetadataResponseModel } from '@/models/pubmed/MetadataResponseModel';
import { PmidListResponseModel } from '@/models/pubmed/PmidListResponseModel';

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

export async function getMetadata(params) {
    if(!params.id) {
        throw new Error('Missing required parameters');
    }
    try {
        const response = await fetch(params.buildUrl());
        const json = await response.json();
        return new MetadataResponseModel({ json: json.result?.[params.id] })
    } catch(error) {
        console.error(error);
        return null;
    }
}


export async function getAbstract(params) {
    if(!params.id) {
        throw new Error('Missing required parameters');
    }
    try {
        const response = await fetch(params.buildUrl());
        const text = await response.text();
        return text?.trim() || null;
    } catch(error) {
        console.error(error);
        return null;
    }
}

// TODO: REVISÃO DESSA FUNÇÃO
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