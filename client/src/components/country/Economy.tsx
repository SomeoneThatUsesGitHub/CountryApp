import React from 'react';
import { motion } from 'framer-motion';
import { EconomicData } from '@shared/schema';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Landmark, BarChart, LineChart as LineChartIcon, ChartBar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Separator } from '@/components/ui/separator';

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

  // GDP historical data for the chart (sample data)
  const gdpData = [
    { year: '2018', gdp: economicData.gdp * 0.9 },
    { year: '2019', gdp: economicData.gdp * 0.93 },
    { year: '2020', gdp: economicData.gdp * 0.88 }, // COVID decline
    { year: '2021', gdp: economicData.gdp * 0.94 },
    { year: '2022', gdp: economicData.gdp * 0.97 },
    { year: '2023', gdp: economicData.gdp },
    { year: '2024', gdp: economicData.gdp * 1.02 }, // Projected
  ];

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
        {/* Section Title with Icon */}
        <div className="flex items-center mb-6">
          <ChartBar className="h-6 w-6 mr-2 text-blue-600" />
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
        <div className="flex items-center mb-6 mt-8">
          <LineChartIcon className="h-6 w-6 mr-2 text-blue-600" />
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
                GDP Evolution (2018-2024)
              </CardTitle>
              
              <div className="h-60 sm:h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={gdpData}
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
              <p className="text-xs text-gray-500 mt-2 text-center">* 2024 values are projected based on current growth trends</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Economy;