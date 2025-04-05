import React from 'react';
import { motion } from 'framer-motion';
import { EconomicData } from '@shared/schema';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Landmark, BarChart, Building2, Factory, Briefcase } from 'lucide-react';

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
        className="mb-6"
      >
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


        {/* Top Companies Section */}
        {economicData.topCompanies && (economicData.topCompanies as any[]).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8"
          >
            <Card>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  Top Companies
                </CardTitle>
                
                <div className="space-y-4">
                  {(economicData.topCompanies as Array<{name: string; industry: string; revenue: string}>).map((company, index) => (
                    <div key={index} className="flex items-center p-3 rounded-md bg-gray-50 border">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        index === 0 ? 'bg-amber-100' : 
                        index === 1 ? 'bg-gray-200' : 
                        'bg-amber-50'
                      }`}>
                        {index === 0 ? (
                          <Building2 className="h-5 w-5 text-amber-600" />
                        ) : index === 1 ? (
                          <Factory className="h-5 w-5 text-gray-600" />
                        ) : (
                          <Briefcase className="h-5 w-5 text-amber-500" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold">{company.name}</h4>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-gray-500">{company.industry}</span>
                          {company.revenue && (
                            <span className="text-sm font-medium">{company.revenue}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
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
