import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Country, TimelineEvent } from '@shared/schema';
import CountryBanner from '@/components/country/CountryBanner';
import CountryTabs from '@/components/country/CountryTabs';
import InteractiveTimeline from '@/components/country/InteractiveTimeline';
import { PopulationChart, GDPChart, ReligionChart, generateSamplePopulationData, generateSampleGDPData, generateSampleReligionData } from '@/components/country/ChartDisplay';
import EthnicityChart, { generateSampleEthnicGroups } from '@/components/country/EthnicityChart';
import GovernmentSystem from '@/components/country/GovernmentSystem';
import InternationalRelations from '@/components/country/InternationalRelations';
import Economy from '@/components/country/Economy';
import { Skeleton } from '@/components/ui/skeleton';

const CountryPage: React.FC = () => {
  const [location] = useLocation();
  // Extract alpha3Code from URL query parameter
  let code = '';
  
  // Use window.location.search to get query parameters directly
  const urlParams = new URLSearchParams(window.location.search);
  code = urlParams.get('code') || '';
  
  console.log("Country code from URL:", code);
  console.log("Current location:", location);
  console.log("Window search params:", window.location.search);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch country data
  const { data: country, isLoading: countryLoading, error: countryError } = useQuery<Country>({
    queryKey: [`/api/countries/code/${code}`],
    enabled: code.length > 0, // Only run query if code exists
  });
  
  // Fetch timeline events for the country
  const { data: timelineEvents = [], isLoading: eventsLoading, error: eventsError } = useQuery<TimelineEvent[]>({
    queryKey: [`/api/countries/${country?.id}/timeline`],
    enabled: !!country?.id, // Only run query if country ID exists
  });

  useEffect(() => {
    // Scroll to top when navigating to a new country
    window.scrollTo(0, 0);
  }, [code]);

  if (countryLoading || eventsLoading) {
    return (
      <div>
        <Skeleton className="h-80 w-full" />
        <div className="container mx-auto px-4 py-6">
          <div className="flex space-x-8 mb-8">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-8 w-32" />
            ))}
          </div>
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Country</h2>
        <p className="text-gray-600">
          We couldn't find information for this country. Please try another country or go back to the home page.
        </p>
      </div>
    );
  }

  return (
    <div>
      <CountryBanner country={country} />
      
      <CountryTabs 
        activeTab={activeTab} 
        onTabChange={(tabId) => setActiveTab(tabId)} 
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Political Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Political Timeline</h2>
            <div className="max-w-5xl">
              <InteractiveTimeline events={timelineEvents} />
            </div>
          </div>
        )}
        
        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div>
            <h2 className="text-2xl font-bold mb-8">Key Statistics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PopulationChart data={generateSamplePopulationData(country.name)} />
              <GDPChart data={generateSampleGDPData(country.name)} />
              <EthnicityChart ethnicGroups={generateSampleEthnicGroups(country.name)} />
              <ReligionChart data={generateSampleReligionData(country.name)} />
            </div>
          </div>
        )}
        
        {/* Political System Tab */}
        {activeTab === 'political-system' && (
          <div>
            <h2 className="text-2xl font-bold mb-8">Political System</h2>
            <GovernmentSystem countryName={country.name} />
            <div className="mt-8">
              <InternationalRelations countryName={country.name} />
            </div>
          </div>
        )}
        
        {/* Economy Tab */}
        {activeTab === 'economy' && (
          <div>
            <h2 className="text-2xl font-bold mb-8">Economy</h2>
            <Economy 
              countryName={country.name}
              economicData={{
                id: 1,
                countryId: country.id,
                gdp: 250,
                gdpPerCapita: 8500,
                gdpGrowth: "3.5%",
                inflation: "4.2%",
                mainIndustries: [
                  { name: "Services", percentage: 55 },
                  { name: "Industry", percentage: 25 },
                  { name: "Agriculture", percentage: 15 },
                  { name: "Other", percentage: 5 }
                ],
                tradingPartners: [
                  "United States", "China", "Germany", "Japan", "United Kingdom"
                ],
                challenges: [
                  { 
                    title: "Infrastructure", 
                    description: "Need for improved transportation and utilities",
                    icon: "fa-road"
                  },
                  { 
                    title: "Diversification", 
                    description: "Reliance on limited sectors",
                    icon: "fa-chart-pie"
                  },
                  { 
                    title: "Sustainability", 
                    description: "Balancing growth with environmental concerns",
                    icon: "fa-leaf"
                  }
                ],
                reforms: [
                  "Digital economy initiatives",
                  "Green energy investment",
                  "Educational reforms",
                  "Tax system modernization",
                  "Public-private partnerships"
                ]
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryPage;
