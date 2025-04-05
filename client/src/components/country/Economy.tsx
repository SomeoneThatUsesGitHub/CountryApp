import React from 'react';
import { motion } from 'framer-motion';
import { EconomicData } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EconomyProps {
  countryName: string;
  economicData?: EconomicData;
}

const Industry = ({ name, percentage, color }: { name: string; percentage: number; color?: string }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm font-medium">{name}</span>
      <span className="text-sm text-gray-500">{percentage}%</span>
    </div>
    <Progress 
      value={percentage} 
      className="h-2" 
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.05)',
        '--tw-progress-fill-color': color || undefined
      } as React.CSSProperties} 
    />
  </div>
);

const Economy: React.FC<EconomyProps> = ({ countryName, economicData }) => {
  // Get industry data with percentages (main industries with distribution)
  const industries = React.useMemo(() => {
    if (!economicData?.mainIndustries) return [];
    
    try {
      // Handle different possible formats of mainIndustries data
      if (typeof economicData.mainIndustries === 'string') {
        return JSON.parse(economicData.mainIndustries);
      }
      
      // If it's already an array, use it directly
      if (Array.isArray(economicData.mainIndustries)) {
        return economicData.mainIndustries.map(industry => {
          if (typeof industry === 'string') {
            return { name: industry, percentage: 0 };
          }
          return industry;
        });
      }
      
      return [];
    } catch (error) {
      console.error('Error parsing mainIndustries:', error);
      return [];
    }
  }, [economicData?.mainIndustries]);
  
  // Industry colors for visualization
  const industryColors = [
    'var(--primary)', // Primary theme color
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#8b5cf6', // Purple
    '#14b8a6', // Teal
    '#f43f5e', // Rose
    '#0ea5e9', // Sky
  ];
  
  // If we don't have economic data yet, show loading or placeholder
  if (!economicData || (!economicData.gdp && industries.length === 0)) {
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

  return (
    <div className="space-y-8">
      {/* Key economic indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-4">Key Economic Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">GDP</p>
                <p className="text-3xl font-bold">${economicData.gdp ? economicData.gdp.toLocaleString() : 'N/A'} B</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">GDP Per Capita</p>
                <p className="text-3xl font-bold">${economicData.gdpPerCapita ? economicData.gdpPerCapita.toLocaleString() : 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">GDP Growth</p>
                <p className="text-3xl font-bold">{economicData.gdpGrowth || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Inflation Rate</p>
                <p className="text-3xl font-bold">{economicData.inflation || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
      
      {/* Economic sectors and industries */}
      {industries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold mb-4">Economic Sectors</h3>
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-lg font-semibold mb-4">Industry Distribution</h4>
              <div className="mb-6">
                {industries.map((industry, index) => (
                  <Industry 
                    key={industry.name || index}
                    name={industry.name || `Industry ${index + 1}`}
                    percentage={industry.percentage || 0}
                    color={industryColors[index % industryColors.length]}
                  />
                ))}
              </div>
              
              {/* Donut chart representation */}
              <div className="relative w-64 h-64 mx-auto mt-8">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {industries.map((industry, index) => {
                      // Calculate each sector's position in the pie chart
                      const total = industries.reduce((sum, ind) => sum + (ind.percentage || 0), 0);
                      const normalizedPercentage = industry.percentage / total * 100;
                      
                      // Calculate previous sectors' percentages for position
                      const previousPercentage = industries
                        .slice(0, index)
                        .reduce((sum, ind) => sum + (ind.percentage || 0), 0) / total * 100;
                      
                      // Convert percentages to coordinates on the circle
                      const startAngle = (previousPercentage / 100) * 2 * Math.PI - Math.PI/2;
                      const endAngle = ((previousPercentage + normalizedPercentage) / 100) * 2 * Math.PI - Math.PI/2;
                      
                      // Calculate the path
                      const startX = 50 + 40 * Math.cos(startAngle);
                      const startY = 50 + 40 * Math.sin(startAngle);
                      const endX = 50 + 40 * Math.cos(endAngle);
                      const endY = 50 + 40 * Math.sin(endAngle);
                      
                      // Flag for large arc (more than 180 degrees)
                      const largeArcFlag = normalizedPercentage > 50 ? 1 : 0;
                      
                      // Create the SVG path
                      const path = `
                        M 50 50
                        L ${startX} ${startY}
                        A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}
                        Z
                      `;
                      
                      return (
                        <path 
                          key={index}
                          d={path} 
                          fill={industryColors[index % industryColors.length]} 
                          stroke="white" 
                          strokeWidth="1"
                        />
                      );
                    })}
                    <circle cx="50" cy="50" r="25" fill="white" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-semibold">Economic</div>
                    <div className="text-lg font-semibold">Distribution</div>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-8">
                {industries.map((industry, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                      style={{ backgroundColor: industryColors[index % industryColors.length] }}
                    />
                    <span className="text-sm truncate">{industry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Trading Partners */}
      {economicData.tradingPartners && Array.isArray(economicData.tradingPartners) && economicData.tradingPartners.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold mb-4">Trading Partners</h3>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {economicData.tradingPartners.map((partner, index) => (
                  <div key={index} className="flex items-center p-3 border rounded-lg">
                    <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-full mr-3 flex-shrink-0">
                      <i className="fas fa-handshake"></i>
                    </div>
                    <div>
                      <h5 className="font-semibold">{partner}</h5>
                      <p className="text-sm text-gray-500">Trading Partner</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Economic Outlook and Challenges */}
      {((economicData.outlook && economicData.outlook.length > 0) || 
        (economicData.challenges && Array.isArray(economicData.challenges) && economicData.challenges.length > 0)) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold mb-4">Economic Outlook</h3>
          <Card>
            <CardContent className="pt-6">
              {economicData.outlook && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Future Outlook</h4>
                  <p className="text-gray-700">{economicData.outlook}</p>
                </div>
              )}
              
              {economicData.challenges && Array.isArray(economicData.challenges) && economicData.challenges.length > 0 && (
                <div>
                  <Separator className="my-4" />
                  <h4 className="text-lg font-semibold mb-4">Economic Challenges</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {economicData.challenges.map((challenge, index) => {
                      const title = typeof challenge === 'string' ? challenge : challenge.title;
                      const description = typeof challenge !== 'string' ? challenge.description : '';
                      const icon = typeof challenge !== 'string' ? challenge.icon : 'fa-exclamation-circle';
                      
                      return (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start">
                            <div className="mt-1 mr-3 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <i className={`fas ${icon}`}></i>
                            </div>
                            <div>
                              <h5 className="font-semibold">{title}</h5>
                              {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {economicData.reforms && Array.isArray(economicData.reforms) && economicData.reforms.length > 0 && (
                <div className="mt-6">
                  <Separator className="my-4" />
                  <h4 className="text-lg font-semibold mb-4">Economic Reforms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {economicData.reforms.map((reform, index) => {
                      const text = typeof reform === 'string' ? reform : reform.text;
                      const icon = typeof reform !== 'string' ? reform.icon : 'fa-check-circle';
                      
                      return (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex">
                            <div className="mt-1 mr-3 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <i className={`fas ${icon}`}></i>
                            </div>
                            <div>
                              <p className="text-gray-700">{text}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Economy;
