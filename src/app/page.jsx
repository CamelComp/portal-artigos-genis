'use client'
import { useState } from 'react';
import { useDataList } from '@/hooks/useDataList';
import { countGenes, countPolymorphism } from '@/utils/genes';
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
                <ArticleList list={filteredList} />
            </Box>
        </Main>
    );
}