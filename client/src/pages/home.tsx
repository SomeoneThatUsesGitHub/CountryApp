import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Country } from '@/types';
import { groupCountriesByRegion } from '@/lib/helpers';
import ContinentSection from '@/components/home/ContinentSection';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Globe, Search, MapPin, FileText, Coffee } from 'lucide-react';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);

  // Fetch all countries
  const { data: countries, isLoading, error } = useQuery<Country[]>({
    queryKey: ['/api/countries'],
  });

  // Group countries by region (continent)
  const groupedCountries = countries ? groupCountriesByRegion(countries) : {};
  
  // Filter countries by search query and selected continent
  const filteredGroupedCountries = Object.entries(groupedCountries).reduce((acc, [region, countries]) => {
    // If continent is selected and doesn't match current region, skip
    if (selectedContinent && selectedContinent !== region) {
      return acc;
    }
    
    // Apply search query filter if provided
    if (searchQuery) {
      const filteredCountries = countries.filter(country => 
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (filteredCountries.length > 0) {
        acc[region] = filteredCountries;
      }
    } else {
      acc[region] = countries;
    }
    
    return acc;
  }, {} as Record<string, Country[]>);
  
  // Handle continent filter click
  const handleContinentClick = (continent: string) => {
    // If same continent clicked again, clear filter
    if (selectedContinent === continent) {
      setSelectedContinent(null);
    } else {
      setSelectedContinent(continent);
      setSearchQuery(''); // Clear search when selecting continent
    }
  };

  // Continent icons for hero section
  const continentIcons = [
    { name: "Europe", color: "bg-blue-500", icon: <MapPin className="h-6 w-6" /> },
    { name: "Africa", color: "bg-amber-500", icon: <Globe className="h-6 w-6" /> },
    { name: "Asia", color: "bg-red-500", icon: <MapPin className="h-6 w-6" /> },
    { name: "Americas", color: "bg-green-500", icon: <FileText className="h-6 w-6" /> },
    { name: "Oceania", color: "bg-purple-500", icon: <Coffee className="h-6 w-6" /> },
  ];

  // Staggered animations for continents
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 transform rotate-12 opacity-20">
            <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <polygon points="0,0 200,100 100,200 50,50" fill="currentColor" className="text-white" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-96 h-96 transform -rotate-12 opacity-20">
            <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <polygon points="0,0 200,100 100,200 50,50" fill="currentColor" className="text-white" />
            </svg>
          </div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Explore <span className="text-yellow-300">World Politics</span>
            </h1>
            <p className="text-xl text-white/90 mb-10">
              Discover political systems, economic data, and historical timelines of countries around the world.
            </p>
            
            {/* Search Bar - Hero style */}
            <div className="max-w-md mx-auto mb-8 relative">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search for a country..." 
                  className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent shadow-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70">
                  <Search className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            {/* Continent quick links */}
            <motion.div 
              className="flex flex-wrap justify-center gap-3 mt-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {continentIcons.map((continent, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                  onClick={() => handleContinentClick(continent.name)}
                >
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${selectedContinent === continent.name ? 'bg-white/30' : 'bg-white/10'} backdrop-blur-sm hover:bg-white/20 transition-colors`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center ${continent.color} text-white`}>
                      {continent.icon}
                    </span>
                    <span className="text-white font-medium">{continent.name}</span>
                    {selectedContinent === continent.name && (
                      <span className="ml-1 bg-white/30 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        ✓
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-2">Countries by Continent</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-10">
            {[1, 2].map(i => (
              <div key={i} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Skeleton className="h-8 w-32" />
                  <div className="h-0.5 flex-grow bg-gray-200"></div>
                  <Skeleton className="h-6 w-16" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(j => (
                    <div key={j} className="rounded-xl overflow-hidden shadow-sm">
                      <Skeleton className="h-32 w-full" />
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-red-500 py-8 px-4 bg-red-50 rounded-xl shadow-sm max-w-md mx-auto"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-circle text-3xl text-red-500"></i>
            </div>
            <h3 className="text-lg font-bold text-red-700 mb-2">Unable to Load Countries</h3>
            <p className="text-red-600">Please try again later or refresh the page.</p>
          </motion.div>
        )}

        {/* Empty Search Results */}
        {!isLoading && !error && Object.keys(filteredGroupedCountries).length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">No Countries Found</h3>
            <p className="text-gray-600">No countries match your search query: "{searchQuery}"</p>
            <button 
              className="mt-4 px-4 py-2 text-primary hover:underline"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </button>
          </motion.div>
        )}

        {/* Countries by Region */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {!isLoading && !error && Object.entries(filteredGroupedCountries).map(([region, countries], index) => (
            <motion.div
              key={region}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ContinentSection 
                continent={region} 
                countries={countries}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
