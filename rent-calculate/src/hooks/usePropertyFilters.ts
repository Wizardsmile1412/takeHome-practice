import { useMemo, useState } from "react";
import type { Property } from "../types/property";

export interface FilterState {
    minPrice: number;
    maxPrice: number;
    bedrooms: number | null; // null = "All"
    availableMonth: string | null; //null = "All", format: "2026-03"
}

type SortOption = 'price-asc' | 'price-desc' | 'date-asc' | 'date-desc';

export function usePropertyFilters(properties: Property[]) {
    const [filters, setFilters] = useState<FilterState>({
        minPrice: 0,
        maxPrice: 80000,
        bedrooms: null,
        availableMonth: null,
    });
    const [sortBy, setSortBy] = useState<SortOption>('price-asc');

    const filteredProperties = useMemo(() => {
        return properties
        .filter(p=> p.price >= filters.minPrice && p.price <= filters.maxPrice)
        .filter(p => filters.bedrooms ? p.bedrooms === filters.bedrooms : true)
        .filter(p => {
            if (!filters.availableMonth) return true;
            return p.availableDate.startsWith(filters.availableMonth)
        })
        .sort((a,b) => {
            switch (sortBy) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'date-asc': return new Date(a.availableDate).getTime() - new Date(b.availableDate).getTime();
                case 'date-desc': return new Date(b.availableDate).getTime() - new Date(a.availableDate).getTime();
                default: return 0;
            }
        });
    }, [properties, filters, sortBy])

    return {
        filteredProperties,
        filters,
        setFilters,
        sortBy,
        setSortBy,
    };
}
