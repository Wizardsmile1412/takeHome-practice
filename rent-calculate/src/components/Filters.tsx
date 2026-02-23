import { useState } from 'react';
import { type Dispatch, type SetStateAction } from 'react';
import type { FilterState } from "../hooks/usePropertyFilters";

interface FiltersProps {
    filters: FilterState;
    setFilters: Dispatch<SetStateAction<FilterState>>;
    totalCount: number;
    filteredCount: number;
}

function generateMonthOptions() {
    const options = [];
    const now = new Date();
    for (let i=0; i<6; i++){
        const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const value = `${year}-${month}`; // "2026-03"
        const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric'}); // "March 2026"
        options.push({value, label});
    }
    return options;
}


export default function Filters({ filters, setFilters, totalCount, filteredCount}: FiltersProps) {
    const [minInput, setMinInput] = useState(String(filters.minPrice));
    const [maxInput, setMaxInput] = useState(String(filters.maxPrice));

    return (
        <div className="bg-white p-4 space-y-4">

            {/* Result count*/}
            <p className="text-sm text-gray-500">
                Showing {filteredCount} of {totalCount} properties
            </p>

            {/* Price range*/}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (฿)</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minInput}
                        onChange={e => setMinInput(e.target.value)}
                        onBlur={e => {
                            const val = Number(e.target.value);
                            setFilters(prev => ({...prev, minPrice: isNaN(val) ? 0 : val}))
                        }}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxInput}
                        onChange={e => setMaxInput(e.target.value)}
                        onBlur={e => {
                            const val = Number(e.target.value);
                            setFilters(prev => ({ ...prev, maxPrice: isNaN(val) ? 80000 : val }))
                        }}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                </div>
            </div>

            {/* Bedrooms */}
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Bedrooms</label>
                <div className='flex gap-2'>
                    {[null, 1, 2, 3, 4, 5].map(n => (
                        <button
                            key={n ?? 'all'}
                            onClick={()=> setFilters(prev => ({...prev, bedrooms: n}))}
                            className={`px-3 py-1 rounded text-sm border ${
                                filters.bedrooms === n
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-700'
                            }`}
                        >
                            {n === null ? 'All' : n === 5 ? '5+' : n}
                        </button>
                    ))}
                </div>
            </div>

            {/* Available month */}
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Available Month</label>
                <select
                    value={filters.availableMonth ?? ''}
                    onChange={e => setFilters(prev => ({...prev, availableMonth: e.target.value === '' ? null : e.target.value}))}
                    className='w-full border border-gray-300 rounded px-2 py-1 text-sm'
                >
                    <option value="">All months</option>
                    {generateMonthOptions().map(({value, label}) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>

            {/* Reset button */}
            <button
                onClick={() => {
                    setMinInput('0');
                    setMaxInput('80000');
                    setFilters({ minPrice: 0, maxPrice: 80000, bedrooms: null, availableMonth: null });
                }}
                className='w-full py-1 text-sm text-gray-500 border border-gray-300 rounded hover:bg-gray-50'
            >
                Clear all filters
            </button>
        </div>
    )
}