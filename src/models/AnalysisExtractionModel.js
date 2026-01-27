export class AnalysisExtractionModel {
    constructor(data = {}) {
        this.gene = data.gene ?? null;
        this.polymorphism = data.polymorphism ?? null;
        this.pValue = data.pValue ?? null;
        this.pSig = data.pSig ?? null;
        this.population = data.population ?? null;
        this.sample = data.sample ?? null;
        this.conclusion = data.conclusion ?? null;
        this.clinicalRelevance = data.clinicalRelevance ?? null;
    }
}