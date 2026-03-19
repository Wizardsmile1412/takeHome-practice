import { useState, useEffect } from 'react';
import { List } from 'react-window';
import type { RowComponentProps } from 'react-window';
import type { Property } from '../types/property';
import PropertyCard from './PropertyCard';

type RowProps = { 
    properties: Property[]
    onCardClick: (property: Property) => void
}

const PropertyRow = function PropertyRow({
    index,
    style,
    ariaAttributes,
    properties,
    onCardClick,
}: RowComponentProps<RowProps>) {
    return (
        <div style={style} {...ariaAttributes}>
            <div className="px-3 py-2">
                <PropertyCard 
                    property={properties[index]} 
                    onClick={()=> onCardClick(properties[index])}
                />
            </div>
        </div>
    );
};

interface PropertyListProps {
    properties: Property[]
    onCardClick: (property: Property) => void
}

export default function PropertyList({ properties, onCardClick }: PropertyListProps) {
    const [rowHeight, setRowHeight] = useState(() =>
        window.matchMedia('(min-width: 768px)').matches ? 160 : 280
    );

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 768px)');
        const handler = (e: MediaQueryListEvent) => {
            setRowHeight(e.matches ? 160 : 280);
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler); // cleanup!
    }, []);

    return (
        <List
            rowComponent={PropertyRow}
            rowProps={{ properties, onCardClick }}
            rowCount={properties.length}
            rowHeight={rowHeight}
            style={{ height: '100%'}}
        />
    );
};