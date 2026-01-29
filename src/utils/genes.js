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