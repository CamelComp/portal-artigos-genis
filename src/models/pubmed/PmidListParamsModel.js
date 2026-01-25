import { NcbiRequestModel } from '@/models/pubmed/NcbiRequestModel';

export class PmidListParamsModel extends NcbiRequestModel {

    constructor(config = {}) {
        super(config);
        this.endpoint = '/esearch.fcgi';
        this.maxdate = config.maxdate;
        this.mindate = config.mindate;
        this.retmax = config.retmax ?? 20;
        this.retstart = config.retstart ?? 0;
        this.rettype = 'xml';
        this.sort = 'pub date';
        this.term = config.terms.join(' AND ');
        this.text_availability = 'Abstract';
    }

}