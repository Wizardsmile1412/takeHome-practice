import type { SortOption } from "../hooks/usePropertyFilters";

interface SortControlProps {
    sortBy: SortOption;
    setSortBy: (value: SortOption) => void;
}

export default function SortControl({ sortBy, setSortBy}: SortControlProps) {
    return (
        <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-sm font-medium text-gray-600 whitespace-nowrap">
                Sort by:
            </label>
            <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="date-asc">Available: Soonest</option>
                <option value="date-desc">Available: Latest</option>
            </select>
        </div>
    )
}