export async function getPmidListByQuery(query) {
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
        retmax: String(query.retMax),
        retstart: String(0),
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