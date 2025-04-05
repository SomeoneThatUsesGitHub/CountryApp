import React from 'react';
import { useLocation } from 'wouter';
import { Country } from '@/types';
import { formatNumber } from '@/lib/helpers';
import { motion } from 'framer-motion';
import { Users, MapPin, Building2 } from 'lucide-react';

interface CountryCardProps {
  country: Country;
  accentColor?: string;
}

const CountryCard: React.FC<CountryCardProps> = ({ country, accentColor = 'bg-primary' }) => {
  const [_, setLocation] = useLocation();
  const textColor = accentColor.replace('bg-', 'text-');

  const handleClick = () => {
    const countryCode = country.alpha3Code || '';
    console.log(`Navigating to country: ${country.name}, code: ${countryCode}`);
    // Use wouter navigation but use the full URL including query params
    setLocation(`/country?code=${countryCode}`);
  };

  // Fallback values for missing data
  const population = country.population || 0;
  const capital = country.capital || 'N/A';
  const governmentForm = country.countryInfo?.governmentForm || 'Republic';

  return (
    <motion.div 
      className="rounded-xl overflow-hidden hover:cursor-pointer shadow-md hover:shadow-xl transition-all bg-white relative h-full"
      onClick={handleClick}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Card content */}
      <div className="flex flex-col h-full">
        {/* Flag area */}
        <div 
          className="h-36 bg-cover bg-center relative" 
          style={{ backgroundImage: `url(${country.flagUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          
          {/* Country badge */}
          <div className="absolute top-3 right-3">
            <div className="text-xs font-medium px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
              {country.alpha2Code}
            </div>
          </div>
          
          {/* Country name & govt */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h4 className="font-bold text-xl mb-1 drop-shadow-sm">{country.name}</h4>
            <div className="flex items-center gap-1.5 text-sm opacity-90">
              <Building2 className="h-3.5 w-3.5" />
              <span className="truncate">{governmentForm}</span>
            </div>
          </div>
        </div>
        
        {/* Country info */}
        <div className="p-4 flex-grow">
          <div className="flex flex-col gap-3">
            <div className="flex items-center text-sm text-gray-700 gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${accentColor} bg-opacity-10 ${textColor}`}>
                <Users className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Population</div>
                <div className="font-medium">{formatNumber(population)}</div>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-700 gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${accentColor} bg-opacity-10 ${textColor}`}>
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Capital</div>
                <div className="font-medium truncate">{capital}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer with link */}
        <div className="p-3 border-t border-gray-100">
          <div className={`text-center text-sm ${textColor} font-medium`}>
            View Details
          </div>
        </div>
      </div>
      
      {/* Low-poly effect */}
      <div className="absolute top-0 right-0 w-1/4 h-1/4 opacity-10 z-0">
        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,0 100,0 100,100" fill="currentColor" className={textColor} />
        </svg>
      </div>
    </motion.div>
  );
};

export default CountryCard;
