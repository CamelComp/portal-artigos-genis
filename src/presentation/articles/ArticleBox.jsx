import { useState } from 'react';
import { ChevronIcon } from '@/components/elements/ChevronIcon';

export function ArticleBox({ article }) {

    const metadata = article.metadata;
    const analysis = article.analysis;

    const [isOpened, setIsOpened] = useState(false);

    function formatPSigWithValue(pSig = [], pValue = []) {
        if (!Array.isArray(pSig) || !Array.isArray(pValue)) return [];

        return pSig.map((sig, i) => {
            const value = pValue[i];

            if (value === undefined || value === null) {
                return sig;
            }

            return `${sig} (${value})`;
        });
    }

    return (
        <div className='bg-item-background p-2 rounded'>
            <div onClick={() => setIsOpened(!isOpened)}
                className='flex justify-between gap-2 cursor-pointer'
            >
                <span className={`
                    block max-w-full overflow-hidden
                    text-ellipsis whitespace-nowrap
                `}>
                    {metadata.pmid} - {metadata.title}
                </span>
                <div className='flex items-center gap-1'>
                    {analysis.gene?.map(geneName => (
                        <span key={geneName}
                            className={`
                                flex items-center
                                bg-primary text-white text-xs rounded px-0.5
                            `}
                        >
                            {geneName}
                        </span>
                    ))}
                    <ChevronIcon open={isOpened} />
                </div>
            </div>
            <div 
                className={`
                    flex flex-col gap-1
                    border-t mt-2 pt-2
                `} 
                style={{
                    display: isOpened ? 'flex' : 'none'
                }}
            >
                <div>
                    <p>
                        <b>Polimorfismo:</b> {analysis.polymorphism 
                            ? analysis.polymorphism.join(', ') 
                            : 'não encontrado'
                        }
                    </p>
                </div>
                <div className='flex justify-between'>
                    <p className='w-full'>
                        <b>Polulação:</b> {analysis.population 
                            ? analysis.population.join(', ') 
                            : 'não encontrado'
                        }
                    </p>
                    <p className='w-full'>
                        <b>Amostra:</b> {analysis.sample 
                            ? analysis.sample.join(', ') 
                            : 'não encontrado'
                        }
                    </p>
                </div>
                <div className='flex justify-between'>
                    <p className='w-full'>
                        <b>Valor P:</b> {analysis.pSig?.length
                            ? formatPSigWithValue(
                                analysis.pSig,
                                analysis.pValue
                            ).join(', ')
                            : 'não encontrado'
                        }
                    </p>
                </div>
                <div>
                    <b>Conclusão:</b>
                    <p>{analysis.conclusion}</p>
                </div>
                <div>
                    <b>Análise Clínica:</b>
                    <p>{analysis.clinicalRelevance}</p>
                </div>
            </div>
        </div>
    )
}