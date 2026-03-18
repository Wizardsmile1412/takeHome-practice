import { useState } from 'react';
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
          overflow-y-auto shrink-0 md:w-72 max-h-[45vh] md:max-h-none
          ${filtersOpen ? 'block' : 'hidden'} md:block
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
            {viewMode === 'virtualized' ? (
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
