import { ArticleBox } from '@/presentation/articles/ArticleBox';

export function ArticleList({ list = [] }) {
    return (
        <div className='flex flex-col gap-2'>
            <ul className='flex flex-col gap-1'>
                {list.map(article => (
                    <li key={article.id}>
                        <ArticleBox article={article} />
                    </li>
                ))}
            </ul>
        </div>
    )
}