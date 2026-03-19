import { useState } from 'react';
import type { Property } from '../types/property';
import PropertyCard from './PropertyCard';

const PAGE_SIZE = 20;

interface PaginationProps {
    properties: Property[];
    onCardClick: (property: Property) => void;
}

export default function Pagination({ properties, onCardClick}: PaginationProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPage = Math.max(1, Math.ceil(properties.length / PAGE_SIZE));
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pageItems = properties.slice(startIndex, startIndex + PAGE_SIZE);

    return(
        <div className="flex flex-col h-full overflow-y-auto">
            <div className='flex-1 px-3 py-2 space-y-3'>
                {pageItems.map(property => (
                    <PropertyCard
                        key={property.id}
                        property={property}
                        onClick={() => onCardClick(property)}
                    />
                ))}
            </div>

            {/* Pagination controls */}
            <div className='shrink-0 flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white'>
                <button 
                    onClick={() => setCurrentPage(p => p-1)}
                    disabled={currentPage === 1}
                    className='px-3 py-1 text-sm border rounded disabled:opacity-40'
                >
                    Previous
                </button>

                <span className='text-sm text-gray-600'>
                    Page {currentPage} of {totalPage}
                </span>

                <button
                    onClick={() => setCurrentPage(p=> p+1)}
                    disabled={currentPage === totalPage}
                    className='px-3 py-1 text-sm border rounded disabled:opacity-40'
                >
                    Next
                </button>
            </div>
        </div>
    )
}