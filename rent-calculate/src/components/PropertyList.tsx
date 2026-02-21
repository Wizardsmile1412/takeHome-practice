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
    return (
        <List
            rowComponent={PropertyRow}
            rowProps={{ properties }}
            rowCount={properties.length}
            rowHeight={280}
            style={{ height: '100%'}}
        />
    );
};