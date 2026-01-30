'use client'
import { useState } from 'react';
import { useDataList } from '@/hooks/useDataList';
import { countGenes, countP, countPolymorphism } from '@/utils/genes';
import { filterBySearch } from '@/utils/filter';
import { Box } from '@/components/containers/Box';
import { Main } from '@/components/containers/Main';
import { TextInput } from '@/components/inputs/TextInput';
import { ArticleList } from '@/presentation/articles/ArticleList';
import { VerticalBarsChart } from '@/components/charts/VerticalBarsChart';

export default function HomePage() {

    const articlesData = useDataList({ 
        table: 'articles',
        order: 'registerDate'
    });
    
    const [search, setSearch] = useState('');
    const filteredList = filterBySearch(articlesData.list, search, [
        'analysis.polymorphism',
        'analysis.gene',
        'metadata.title',
        'metadata.pmid',
    ]);
    console.log(countP(filteredList))

    const pCounts = countP(filteredList);

    return (
        <Main>
            <Box>
                <TextInput placeholder='Buscar...' 
                    value={search}
                    setValue={setSearch}
                />
                <span className='text-xs'>
                    Registros: {filteredList.length}
                </span>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 my-4'>
                    <VerticalBarsChart labelKey='gene'
                        data={countGenes(filteredList)} 
                        onBarClick={data => setSearch(data.gene)}
                    />
                    <VerticalBarsChart labelKey='polymorphism'
                        data={countPolymorphism(filteredList)} 
                        onBarClick={data => setSearch(data.polymorphism)}
                    />
                </div>
                <div className={`
                    flex justify-between gap-2
                `}>
                    <span className='bg-item-background w-full rounded p-2'>Significativos: {pCounts[0].count}</span>
                    <span className='bg-item-background w-full rounded p-2'>Não Significativos: {pCounts[1].count}</span>
                    <span className='bg-item-background w-full rounded p-2'>Anomalias: {pCounts[2].count}</span>
                </div>
                <ArticleList list={filteredList} />
            </Box>
        </Main>
    );
}