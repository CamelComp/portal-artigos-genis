export class MetadataResponseModel {
    pmid;
    doi;
    pmcid;
    title;
    authors;
    journal;
    pubDate;

    constructor({ json }) {
        this.pmid = json.uid ?? null;
        this.doi = json.articleids?.find(id => id.idtype === 'doi')?.value ?? null;
        this.pmcid = json.articleids?.find(id => id.idtype === 'pmc')?.value ?? null;
        this.title = json.title ?? null;
        this.authors = json.authors?.map(author => author.name) ?? [];
        this.journal = json.fulljournalname ?? null;
        this.pubDate = json.pubdate ?? null;
    }
}