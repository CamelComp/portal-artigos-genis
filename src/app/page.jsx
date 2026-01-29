'use client'
import { Box } from '@/components/containers/Box';
import { Main } from '@/components/containers/Main';
import { useDataList } from '@/hooks/useDataList';
import { ArticleBox } from '@/presentation/articles/ArticleBox';

export default function HomePage() {

    const articlesData = useDataList({ 
        table: 'articles',
        order: 'registerDate'
    });
    console.log(articlesData);

    return (
        <Main>
            <Box>
                <ul className='flex flex-col gap-1'>
                    {articlesData.list.map(article => {
                        return (
                            <li key={article.id}>
                                <ArticleBox article={article} />
                            </li>
                        )
                    })}
                </ul>
            </Box>
        </Main>
    );
}