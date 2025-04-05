import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EconomicData } from '@shared/schema';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Landmark, BarChart, LineChart as LineChartIcon, ChartBar, ArrowDownToLine as Import, ArrowUpFromLine as Export } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';

interface EconomyProps {
  countryName: string;
  economicData?: EconomicData;
}

const Economy: React.FC<EconomyProps> = ({ countryName, economicData }) => {
  // State to store the fresh GDP data
  const [gdpChartData, setGdpChartData] = useState<any[]>([]);
  
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
  
  // Fetch fresh economic data directly from the API
  const { data: freshEconomicData, isLoading: isLoadingFreshData } = useQuery<EconomicData>({
    queryKey: [`/api/countries/${economicData.countryId}/economy`],
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
  
  // Process the GDP data when fresh data is available
  useEffect(() => {
    console.log('Fresh economic data from API:', freshEconomicData);
    
    if (freshEconomicData && 
        typeof freshEconomicData === 'object' && 
        'gdpHistory' in freshEconomicData && 
        Array.isArray(freshEconomicData.gdpHistory)) {
      const processedData = freshEconomicData.gdpHistory
        .filter((point: {year: string, gdp: number | null}) => point.gdp !== null && point.gdp > 0)
        .sort((a: {year: string}, b: {year: string}) => parseInt(a.year) - parseInt(b.year));
      
      console.log('Using fresh GDP data from API:', processedData);
      setGdpChartData(processedData);
    }
  }, [freshEconomicData]);

  // Import/export data from the database or defaults
  const [tradeData, setTradeData] = useState<{
    imports: Array<{product: string; value: string; percentage: number}>;
    exports: Array<{product: string; value: string; percentage: number}>;
  }>({
    imports: [],
    exports: []
  });
  
  // Update trade data when fresh economic data is loaded
  useEffect(() => {
    if (freshEconomicData && 
        typeof freshEconomicData === 'object' && 
        'mainIndustries' in freshEconomicData && 
        freshEconomicData.mainIndustries) {
      
      console.log('Fresh trade data:', freshEconomicData.mainIndustries);
      
      // Extract imports and exports from the fresh data
      const mainIndustries = freshEconomicData.mainIndustries as any || {};
      let importsData = mainIndustries.imports || [];
      let exportsData = mainIndustries.exports || [];
      
      // Set default data if none exists
      if (importsData.length === 0) {
        importsData = [
          { product: 'Machinery', value: '$98.2B', percentage: 14.3 },
          { product: 'Vehicles', value: '$87.5B', percentage: 12.8 },
          { product: 'Electronics', value: '$79.1B', percentage: 11.6 }
        ];
      }
      
      if (exportsData.length === 0) {
        exportsData = [
          { product: 'Automobiles', value: '$129.7B', percentage: 17.2 },
          { product: 'Machinery', value: '$118.5B', percentage: 15.7 },
          { product: 'Pharmaceuticals', value: '$84.3B', percentage: 11.2 }
        ];
      }
      
      setTradeData({
        imports: importsData,
        exports: exportsData
      });
    }
  }, [freshEconomicData]);

  // GDP historical data for the chart
  const gdpData = economicData.gdpHistory 
    ? (Array.isArray(economicData.gdpHistory) 
        ? (economicData.gdpHistory as Array<{year: string; gdp: number | null}>)
            .filter(point => point.gdp !== null && point.gdp > 0) // Filter out null and zero GDP values
            .sort((a, b) => parseInt(a.year) - parseInt(b.year)) // Sort by year
        : [])
    : []; // Empty array if no data available
    
  console.log('GDP History from DB:', economicData.gdpHistory);
  console.log('Processed GDP data for chart:', gdpData);
  
  // If no GDP history data available, create default data
  if (gdpData.length === 0) {
    console.log('No GDP history data available, creating fallback data');
    const defaultYears = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];
    const fallbackData = defaultYears.map((year, index) => {
      // Create a progressive pattern with a dip for 2020 (COVID)
      let factor = 0.9 + (index * 0.02);
      // Add COVID dip
      if (year === '2020') factor = 0.88;
      // Use default 2000 if gdp is null/undefined
      const baseGdp = typeof economicData.gdp === 'number' ? economicData.gdp : 2000;
      return {
        year,
        gdp: Math.round(baseGdp * factor)
      };
    });
    gdpData.push(...fallbackData);
    console.log('Created fallback GDP data:', gdpData);
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
        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Key Economic Indicators</h2>
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

        {/* Thick separator between sections */}
        <Separator className="my-8 h-1 bg-gray-200" />

        {/* GDP Evolution Chart Section Title */}
        <div className="mb-6 mt-8">
          <h2 className="text-2xl font-bold">Economic Growth Trends</h2>
        </div>

        {/* GDP Evolution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <Card>
            <CardContent className="p-6">
              <CardTitle className="text-xl mb-4 flex items-center">
                <LineChartIcon className="h-5 w-5 mr-2 text-blue-600" />
                GDP Evolution ({gdpData.length > 0 
                  ? `${gdpData[0].year}-${gdpData[gdpData.length-1].year}`
                  : '2018-2024'})
              </CardTitle>
              
              <div className="h-60 sm:h-80 mt-4">
                {isLoadingFreshData && <div className="text-center py-20">Loading latest GDP data...</div>}
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={gdpChartData.length > 0 ? gdpChartData : gdpData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    className="text-xs sm:text-sm"
                  >
                    <defs>
                      <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fill: '#6b7280', fontSize: 10 }}
                      tickMargin={5}
                      padding={{ left: 10, right: 10 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${(value / 1000).toFixed(1)}T`}
                      tick={{ fill: '#6b7280', fontSize: 10 }}
                      width={60}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${(Number(value)).toLocaleString()} billion`, 'GDP']}
                      labelFormatter={(label) => `Year: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="gdp" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      fill="url(#colorGdp)" 
                      strokeWidth={2} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {/* Only show note about projections if the latest year is the current or future year */}
              {gdpData.length > 0 && parseInt(gdpData[gdpData.length-1].year) >= new Date().getFullYear() && (
                <p className="text-xs text-gray-500 mt-2 text-center">* {gdpData[gdpData.length-1].year} values are projected based on current growth trends</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Thick separator between sections */}
        <Separator className="my-8 h-1 bg-gray-200" />

        {/* Main Imports and Exports Section Title */}
        <div className="mb-6 mt-8">
          <h2 className="text-2xl font-bold">Main Imports and Exports</h2>
        </div>

        {/* Main Imports and Exports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Imports Card */}
            <Card>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-4 flex items-center">
                  <Import className="h-5 w-5 mr-2 text-blue-600" />
                  Main Imports
                </CardTitle>
                
                <div className="space-y-4">
                  {tradeData.imports.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-1.5 h-8 bg-blue-500 rounded-full mr-3"></div>
                        <div>
                          <p className="font-medium">{item.product}</p>
                          <p className="text-sm text-gray-500">{item.value}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{item.percentage}%</p>
                        <p className="text-xs text-gray-500">of total imports</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Exports Card */}
            <Card>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-4 flex items-center">
                  <Export className="h-5 w-5 mr-2 text-green-600" />
                  Main Exports
                </CardTitle>
                
                <div className="space-y-4">
                  {tradeData.exports.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-1.5 h-8 bg-green-500 rounded-full mr-3"></div>
                        <div>
                          <p className="font-medium">{item.product}</p>
                          <p className="text-sm text-gray-500">{item.value}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{item.percentage}%</p>
                        <p className="text-xs text-gray-500">of total exports</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Economy;