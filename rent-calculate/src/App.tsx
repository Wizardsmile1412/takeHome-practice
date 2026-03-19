import { useEffect, useState } from 'react';
import { properties } from './data/generateProperties'
import PropertyList from './components/PropertyList';
import Filters from './components/Filters';
import SortControl from './components/SortControl';
import { usePropertyFilters } from './hooks/usePropertyFilters';
import type { Property } from './types/property';
import PropertyModal from './components/PropertyModal';
import Pagination from './components/Pagination';

function App() {
  const { filteredProperties, filters, setFilters, sortBy, setSortBy} = usePropertyFilters(properties);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [viewMode, setViewMode] = useState<'virtualized' | 'paginated'>('virtualized')
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(()=> setIsLoading(false), 1000);
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='flex flex-col h-screen bg-gray-100'>
      
      {/* Header */}
      <header className='bg-white shadow-sm px-4 py-3 shrink-0 flex items-center justify-between'>
        <h1 className='text-xl font-bold text-gray-900'>🏠 Rental Properties</h1>
        {/* This button only shows on mobile (md:hidden hides it on desktop) */}
        <button
          className='md:hidden text-sm text-blue-600 border border-blue-600 rounded px-3 py-1'
          onClick={() => setFiltersOpen(o => !o)}
        >
          {filtersOpen ? 'Hide Filters' : 'Filters'}
        </button>
      </header>

      {/* Body - vertical on mobile, horizontal on desktop */}
      <div className='flex-1 overflow-hidden flex flex-col md:flex-row'>

        {/* Filter panel */}
        <aside className={`
          bg-white border-b md:border-b-0 md:border-r border-gray-200
          overflow-y-auto shrink-0 md:w-72 md:max-h-none transition-all duration-300 ease-in-out
          ${filtersOpen ? 'max-h-[45vh] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} md:max-h-none md:opacity-100
          `}>
          <Filters
            filters={filters}
            setFilters={setFilters}
            totalCount={properties.length}
            filteredCount={filteredProperties.length}
          />
        </aside>

        {/* Main content */}
        <main className='flex-1 flex flex-col overflow-hidden'>
          <div className='bg-white border-b border-gray-200 px-4 py-2 shrink-0 flex items-center justify-between'>
            {/* Result count - only on mobile since filters panel (which has count) is hidden */}
            <p className='text-sm text-gray-500 md:hidden'>
              {filteredProperties.length} of {properties.length} properties
            </p>

            <SortControl sortBy={sortBy} setSortBy={setSortBy} />

            <button onClick={() => setViewMode(v => v ==='virtualized' ? 'paginated' : 'virtualized')}>
              {viewMode === 'virtualized' ? 'Paginated View' : 'Virtualized List'}
            </button>
          </div>
          
          <div className='flex-1 overflow-hidden'>
            { isLoading ? (
              <div className='flex items-center justify-center h-full'>
                <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'/>
              </div>
            )
              : filteredProperties.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full text-center p-8'>
                <p className='text-gray-500 text-lg mb-4'>No properties</p>
                <button
                  onClick={() => setFilters({ minPrice: 0, maxPrice:80000, bedrooms: null, availableMonth: null})}
                  className='px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50'
                >
                  Reset filters
                </button>
              </div>
            )
              : viewMode === 'virtualized' ? (
              <PropertyList 
                properties={filteredProperties}
                onCardClick={setSelectedProperty}
              />
            ) : (
              <Pagination
                key={sortBy + JSON.stringify(filters)}   // resets when filters/sort change 
                properties={filteredProperties}
                onCardClick={setSelectedProperty}
              />
            )
            }
          </div>
        </main>

      </div>

      {selectedProperty && (
      <PropertyModal
        property={selectedProperty}
        onClose={()=> setSelectedProperty(null)}
      />
    )}
    </div>
  )
}

export default App
