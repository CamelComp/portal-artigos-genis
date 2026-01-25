import { NcbiRequestModel } from '@/models/pubmed/NcbiRequestModel';

export class MetadataParamsModel extends NcbiRequestModel {

    constructor(config = {}) {
        super(config);
        this.endpoint = 'esummary.fcgi';
        this.id = String(config.pmid)
    }

}