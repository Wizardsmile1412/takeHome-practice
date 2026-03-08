import { useState, useEffect } from 'react';
import { List } from 'react-window';
import type { RowComponentProps } from 'react-window';
import type { Property } from '../types/property';
import PropertyCard from './PropertyCard';

type RowProps = { properties: Property[]}

const PropertyRow = function PropertyRow({
    index,
    style,
    ariaAttributes,
    properties,
}: RowComponentProps<RowProps>) {
    return (
        <div style={style} {...ariaAttributes}>
            <div className="px-3 py-2">
                <PropertyCard property={properties[index]} />
            </div>
        </div>
    );
};

interface PropertyListProps {
    properties: Property[]
}

export default function PropertyList({ properties }: PropertyListProps) {
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
            rowProps={{ properties }}
            rowCount={properties.length}
            rowHeight={rowHeight}
            style={{ height: '100%'}}
        />
    );
};