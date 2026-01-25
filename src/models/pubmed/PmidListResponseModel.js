export class PmidListResponseModel {
    total;
    pmidList;
    maxdate;
    mindate;
    retmax;
    retstart;
    sort;
    term;

    constructor({ params, json }) {
        this.total = json.esearchresult.count;
        this.pmidList = json.esearchresult.idlist;
        this.maxdate = params.maxdate;
        this.mindate = params.mindate;
        this.retmax = params.retmax;
        this.retstart = params.retstart;
		this.sort = params.sort;
        this.term = params.term;
    }

}