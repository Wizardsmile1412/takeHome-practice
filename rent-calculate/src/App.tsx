import { properties } from './data/generateProperties'
import PropertyList from './components/PropertyList';
import { usePropertyFilters } from './hooks/usePropertyFilters';

function App() {
  const { filteredProperties, filters, setFilters} = usePropertyFilters(properties);

  return (
    <div className='flex flex-col h-screen bg-gray-100'>
      <header className='bg-white shadow-sm px-4 py-3 shrink-0'>
        <h1 className='text-xl font-bold text-gray-900'>🏠 Rental Properties</h1>
        <p className='text-sm text-gray-500'>Showing {filteredProperties.length} of {properties.length} properties</p>
      </header>
      <main className='flex-1 overflow-hidden'>
        <PropertyList properties={filteredProperties}/>
      </main>
    </div>
  )
}

export default App
