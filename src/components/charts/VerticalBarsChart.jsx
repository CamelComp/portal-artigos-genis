import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const ROW_HEIGHT = 30;
const MAX_HEIGHT = 400;

export function VerticalBarsChart({ data, labelKey, onBarClick }) {

    if(!data?.length) return null;

    const sortedData = [...data].sort((a, b) => b.count - a.count);
    const chartHeight = sortedData.length * ROW_HEIGHT;

    return (
        <div className='bg-item-background rounded'
            style={{
                height: MAX_HEIGHT,
                overflowY: 'auto'
            }}
        >
            <ResponsiveContainer width='100%' height={chartHeight} outline='none' >
                <BarChart data={sortedData}
                    layout='vertical'
                    outline='none' 
                >
                    <XAxis type='number' />
                    <YAxis dataKey={labelKey} type='category' width={100} />
                    <Tooltip />
                    <Bar dataKey='count' 
                        fill='var(--primary)'
                        outline='none' 
                        onClick={data => {
                            onBarClick?.(data);
                        }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}