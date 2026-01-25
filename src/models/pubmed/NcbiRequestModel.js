export class NcbiRequestModel {

    constructor(config = {}) {
        this.api_key = process.env.PUBMED_API_KEY;
        this.baseUrl = config.baseUrl || 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
        this.db = config.db || 'pubmed';
        this.endpoint = config.endpoint;
        this.retmode = config.retmode || 'json';
        this.rettype = config.rettype;
    }

    toQueryParams() {
        return new URLSearchParams(
            Object.entries(this)
                .filter(([, v]) => v !== undefined && v !== null)
                .map(([k, v]) => [k, String(v)])
        );
    }

    buildUrl() {
        if(!this.endpoint) {
            throw new Error('endpoint não definido');
        }
        const params = this.toQueryParams().toString();
        return `${this.baseUrl}/${this.endpoint}?${params}`;
    }

}