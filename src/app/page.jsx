'use client'
import { useDataList } from '@/hooks/useDataList';
import { useEffect, useState } from 'react';

export default function HomePage() {

    const queries = useDataList({
        table: 'queries',
        order: 'initialDate'
    });

    const [activeQuery, setActiveQuery] = useState();
    useEffect(() => {
        !activeQuery && setActiveQuery(queries.list.find(q => q.isActive));
    }, [queries]);

    return (
        <div>
            tetetett
        </div>
    );
}