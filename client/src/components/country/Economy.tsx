import React from 'react';
import { motion } from 'framer-motion';
import { EconomicData } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Landmark, BarChart } from 'lucide-react';

interface EconomyProps {
  countryName: string;
  economicData?: EconomicData;
}

const Economy: React.FC<EconomyProps> = ({ countryName, economicData }) => {
  // If we don't have economic data yet, show a placeholder
  if (!economicData || !economicData.gdp) {
    return (
      <motion.div 
        className="flex items-center justify-center h-64 bg-gray-50 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-gray-500 text-lg">Economic data not available for {countryName}</p>
      </motion.div>
    );
  }

  // Extract growth value as a number for determining color
  const growthValue = parseFloat(economicData.gdpGrowth?.replace('%', '') || '0');
  const growthIsPositive = growthValue >= 0;
  
  // Extract inflation value for determining severity
  const inflationValue = parseFloat(economicData.inflation?.replace('%', '') || '0');
  const inflationSeverity = 
    inflationValue <= 2 ? 'low' : 
    inflationValue <= 5 ? 'moderate' : 
    'high';

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="flex flex-col items-center mb-8">
          <h3 className="text-2xl font-bold mb-2">Economic Overview</h3>
          <p className="text-gray-500 text-center max-w-2xl">
            Key economic indicators for {countryName}'s economy 
            including GDP, growth rate, and more.
          </p>
        </div>

        {/* Main Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* GDP Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="overflow-hidden border-t-4 border-t-blue-500 h-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Gross Domestic Product</p>
                    <h4 className="text-3xl font-bold mb-2">
                      ${economicData.gdp ? economicData.gdp.toLocaleString() : 'N/A'}<span className="text-lg font-normal text-gray-500 ml-1">B</span>
                    </h4>
                    <p className="text-xs text-gray-500">Total economic output</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* GDP Per Capita Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="overflow-hidden border-t-4 border-t-indigo-500 h-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">GDP Per Capita</p>
                    <h4 className="text-3xl font-bold mb-2">
                      ${economicData.gdpPerCapita ? economicData.gdpPerCapita.toLocaleString() : 'N/A'}
                    </h4>
                    <p className="text-xs text-gray-500">Average per person</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Landmark className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* GDP Growth Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className={`overflow-hidden border-t-4 ${growthIsPositive ? 'border-t-emerald-500' : 'border-t-red-500'} h-full`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Economic Growth</p>
                    <h4 className={`text-3xl font-bold mb-2 ${growthIsPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {economicData.gdpGrowth || '0%'}
                    </h4>
                    <p className="text-xs text-gray-500">Annual growth rate</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full ${growthIsPositive ? 'bg-emerald-100' : 'bg-red-100'} flex items-center justify-center flex-shrink-0`}>
                    {growthIsPositive ? (
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Inflation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card className={`overflow-hidden border-t-4 
              ${inflationSeverity === 'low' ? 'border-t-emerald-500' : 
                inflationSeverity === 'moderate' ? 'border-t-amber-500' : 
                'border-t-red-500'} h-full`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Inflation Rate</p>
                    <h4 className={`text-3xl font-bold mb-2 
                      ${inflationSeverity === 'low' ? 'text-emerald-600' : 
                        inflationSeverity === 'moderate' ? 'text-amber-600' : 
                        'text-red-600'}`}>
                      {economicData.inflation || '0%'}
                    </h4>
                    <p className="text-xs text-gray-500">Price level changes</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full 
                    ${inflationSeverity === 'low' ? 'bg-emerald-100' : 
                      inflationSeverity === 'moderate' ? 'bg-amber-100' : 
                      'bg-red-100'} flex items-center justify-center flex-shrink-0`}>
                    <BarChart className={`h-5 w-5 
                      ${inflationSeverity === 'low' ? 'text-emerald-600' : 
                        inflationSeverity === 'moderate' ? 'text-amber-600' : 
                        'text-red-600'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Economic Comparison */}
        {economicData.gdp && economicData.gdpPerCapita && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8"
          >
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold mb-4">Economic Standing</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">GDP Size</span>
                      <span className="text-sm text-gray-500">
                        {economicData.gdp >= 20000 ? 'Very Large' :
                         economicData.gdp >= 5000 ? 'Large' :
                         economicData.gdp >= 1000 ? 'Medium' :
                         economicData.gdp >= 200 ? 'Small' : 'Very Small'} Economy
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (economicData.gdp / 25000) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Standard of Living</span>
                      <span className="text-sm text-gray-500">
                        {economicData.gdpPerCapita >= 80000 ? 'Very High' :
                         economicData.gdpPerCapita >= 45000 ? 'High' :
                         economicData.gdpPerCapita >= 20000 ? 'Upper Middle' :
                         economicData.gdpPerCapita >= 5000 ? 'Lower Middle' : 'Low'} Income
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (economicData.gdpPerCapita / 100000) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Economic Growth</span>
                      <span className="text-sm text-gray-500">
                        {growthValue >= 5 ? 'Very High Growth' :
                         growthValue >= 3 ? 'Strong Growth' :
                         growthValue >= 1 ? 'Moderate Growth' :
                         growthValue >= 0 ? 'Slow Growth' : 'Contraction'}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${growthValue >= 0 ? 'bg-emerald-500' : 'bg-red-500'} rounded-full`}
                        style={{ 
                          width: `${Math.min(100, Math.abs(growthValue / 10) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Economy;
