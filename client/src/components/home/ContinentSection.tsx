import React from 'react';
import { Country } from '@/types';
import CountryCard from './CountryCard';
import { motion } from 'framer-motion';

interface ContinentSectionProps {
  continent: string;
  countries: Country[];
}

// Map continents to their color themes
const continentColors: Record<string, string> = {
  'Europe': 'bg-blue-500',
  'Africa': 'bg-amber-500',
  'Asia': 'bg-red-500',
  'Americas': 'bg-green-500',
  'Oceania': 'bg-purple-500',
  'Polar': 'bg-cyan-500',
  'Antarctic': 'bg-cyan-500'
};

const ContinentSection: React.FC<ContinentSectionProps> = ({ continent, countries }) => {
  // Take the first 4 countries for display
  const displayCountries = countries.slice(0, 4);
  
  // Get the color for this continent (or default)
  const continentColor = continentColors[continent] || 'bg-primary';
  const continentTextColor = continentColor.replace('bg-', 'text-');

  // Animation variants for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <section className="mb-16">
      <motion.div 
        className="flex items-center gap-3 mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`w-12 h-12 rounded-lg ${continentColor} flex items-center justify-center text-white font-bold text-xl`}>
          {continent.charAt(0)}
        </div>
        <h3 className="text-2xl font-bold text-gray-800">{continent}</h3>
        <div className={`h-0.5 flex-grow ${continentColor.replace('bg-', 'bg-')} opacity-20`}></div>
        <motion.button 
          className={`${continentTextColor} font-medium px-3 py-1 rounded-lg border border-current hover:bg-opacity-10 hover:bg-current transition-colors`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View All
        </motion.button>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {displayCountries.map((country) => (
          <motion.div key={country.id} variants={itemVariants}>
            <CountryCard country={country} accentColor={continentColor} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ContinentSection;
