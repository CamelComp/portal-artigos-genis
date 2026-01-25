import { NcbiRequestModel } from '@/models/pubmed/NcbiRequestModel';

export class AbstractParamsModel extends NcbiRequestModel {

    constructor(config = {}) {
        super(config);
        this.endpoint = 'efetch.fcgi';
        this.id = String(config.pmid),
        this.retmode = 'text';
        this.rettype = 'abstract';
    }

}