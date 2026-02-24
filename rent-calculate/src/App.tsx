import { properties } from './data/generateProperties'
import PropertyList from './components/PropertyList';
import Filters from './components/Filters';
import SortControl from './components/SortControl';
import { usePropertyFilters } from './hooks/usePropertyFilters';

function App() {
  const { filteredProperties, filters, setFilters, sortBy, setSortBy} = usePropertyFilters(properties);

  return (
    <div className='flex flex-col h-screen bg-gray-100'>
      <header className='bg-white shadow-sm px-4 py-3 shrink-0'>
        <h1 className='text-xl font-bold text-gray-900'>🏠 Rental Properties</h1>
      </header>
      <div className='flex-1 overflow-hidden flex flex-col'>
        <Filters
          filters={filters}
          setFilters={setFilters}
          totalCount={properties.length}
          filteredCount={filteredProperties.length}
        />
        <SortControl sortBy={sortBy} setSortBy={setSortBy} />
      </div>
      <main className='flex-1 overflow-hidden'>
        <PropertyList properties={filteredProperties}/>
      </main>
    </div>
  )
}

export default App
