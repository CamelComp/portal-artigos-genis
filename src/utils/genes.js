export function countGenes(articles) {
    const geneCount = {};
    articles.forEach(article => {
        const genes = article?.analysis?.gene || [];
        genes.forEach(gene => {
            geneCount[gene] = (geneCount[gene] || 0) + 1;
        });
    });
    return Object.entries(geneCount).map(([gene, count]) => ({
        gene,
        count
    }));
}

export function countPolymorphism(articles) {
    const polymorphismCount = {};
    articles.forEach(article => {
        const polymorphisms = article?.analysis?.polymorphism || [];
        polymorphisms.forEach(p => {
            polymorphismCount[p] = (polymorphismCount[p] || 0) + 1;
        });
    });
    return Object.entries(polymorphismCount).map(([polymorphism, count]) => ({
        polymorphism,
        count
    }));
}

export function countP(articles) {
    const result = {
        significativo: 0,
        naoSignificativo: 0,
        anomalia: 0,
    };

    articles.forEach(article => {
        const ps = article?.analysis?.pSig || [];

        if (!Array.isArray(ps) || ps.length === 0) {
            result.anomalia++;
            return;
        }

        const hasSignificativo = ps.some(
            p => typeof p === 'string' && p.startsWith('Significativo')
        );

        const hasNaoSignificativo = ps.some(
            p => typeof p === 'string' && p.startsWith('Não Significativo')
        );

        if (hasSignificativo) {
            result.significativo++;
        } 
        else if (hasNaoSignificativo) {
            result.naoSignificativo++;
        } 
        else {
            result.anomalia++;
        }
    });

    return [
        { pSig: 'Significativo', count: result.significativo },
        { pSig: 'Não Significativo', count: result.naoSignificativo },
        { pSig: 'Anomalia', count: result.anomalia },
    ];
}