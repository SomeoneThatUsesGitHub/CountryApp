import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { EconomicData } from '@shared/schema';
import { Trash, LineChart as LineChartIcon } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// GDP history data point schema
const gdpDataPointSchema = z.object({
  year: z.string().min(1, "Year is required"),
  gdp: z.coerce.number().min(0, "GDP value must be positive").nullable().optional(),
});

// Schema for economic data form
const economicDataSchema = z.object({
  gdp: z.coerce.number().min(0, "GDP must be a positive number").optional().nullable(),
  gdpPerCapita: z.coerce.number().min(0, "GDP per capita must be a positive number").optional().nullable(),
  gdpGrowth: z.string().optional().nullable(),
  inflation: z.string().optional().nullable(),
  exchangeRate: z.string().optional().nullable(),
  gdpHistory: z.array(gdpDataPointSchema).optional(),
});

type EconomicDataFormValues = z.infer<typeof economicDataSchema>;

interface EconomicDataEditorProps {
  countryId: number;
}

const EconomicDataEditor: React.FC<EconomicDataEditorProps> = ({ countryId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch economic data for the selected country
  const { data: economicData, isLoading } = useQuery<EconomicData>({
    queryKey: [`/api/countries/${countryId}/economy`],
    enabled: countryId !== null,
  });
  
  // Setup form with validation
  const form = useForm<EconomicDataFormValues>({
    resolver: zodResolver(economicDataSchema),
    defaultValues: {
      gdp: null,
      gdpPerCapita: null,
      gdpGrowth: null,
      inflation: null,
      exchangeRate: null,
    },
  });
  
  // State for managing GDP history data points
  const [gdpHistory, setGdpHistory] = useState<Array<{
    year: string;
    gdp: number | null;
  }>>([]);

  // Default years for GDP history if none exists
  const defaultYears = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];

  // Update form when economic data is loaded
  useEffect(() => {
    if (economicData) {
      console.log('Economic data loaded:', economicData);
      console.log('GDP History data:', economicData.gdpHistory);
      
      // Initialize GDP history from existing data or create default entries
      let gdpHistoryData = economicData.gdpHistory ? 
        (Array.isArray(economicData.gdpHistory) ? economicData.gdpHistory : []) : 
        [];
      
      console.log('Parsed GDP History data:', gdpHistoryData);
        
      // If no history exists, create default entries based on current GDP value
      if (gdpHistoryData.length === 0 && economicData.gdp) {
        gdpHistoryData = defaultYears.map((year, index) => {
          // Create a progressive pattern with a dip for 2020 (COVID)
          let factor = 0.9 + (index * 0.02);
          // Add COVID dip
          if (year === '2020') factor = 0.88;
          return {
            year,
            gdp: Math.round(economicData.gdp! * factor)
          };
        });
        
        console.log('Created default GDP history:', gdpHistoryData);
      }
      
      setGdpHistory(gdpHistoryData);
      
      form.reset({
        gdp: economicData.gdp || null,
        gdpPerCapita: economicData.gdpPerCapita || null,
        gdpGrowth: economicData.gdpGrowth || null,
        inflation: economicData.inflation || null,
        exchangeRate: economicData.exchangeRate || null,
        gdpHistory: gdpHistoryData,
      });
    }
  }, [economicData, form]);
  
  // Handle adding a new GDP history entry
  const handleAddGdpHistoryEntry = () => {
    // Find a year that's not already in the data
    const existingYears = gdpHistory.map(entry => entry.year);
    const nextYear = (parseInt(existingYears[existingYears.length - 1] || '2023') + 1).toString();
    
    const newGdpHistory = [...gdpHistory, { year: nextYear, gdp: gdpHistory.length > 0 ? gdpHistory[gdpHistory.length - 1].gdp : null }];
    setGdpHistory(newGdpHistory);
    form.setValue('gdpHistory', newGdpHistory);
  };
  
  // Handle removing a GDP history entry
  const handleRemoveGdpHistoryEntry = (index: number) => {
    const newGdpHistory = gdpHistory.filter((_, i) => i !== index);
    setGdpHistory(newGdpHistory);
    form.setValue('gdpHistory', newGdpHistory);
  };
  
  // Handle GDP history field changes
  const handleGdpHistoryChange = (index: number, field: string, value: any) => {
    const newGdpHistory = [...gdpHistory];
    if (field === 'gdp' && value !== '') {
      value = Number(value);
    }
    if (field === 'gdp' && value === '') {
      value = null;
    }
    newGdpHistory[index] = { ...newGdpHistory[index], [field]: value };
    setGdpHistory(newGdpHistory);
    form.setValue('gdpHistory', newGdpHistory);
  };
  
  // Handle update of main economic indicators only
  const updateEconomicIndicators = async () => {
    try {
      // Get form values excluding companies
      const formValues = form.getValues();
      const economicIndicators = {
        gdp: formValues.gdp,
        gdpPerCapita: formValues.gdpPerCapita,
        gdpGrowth: formValues.gdpGrowth,
        inflation: formValues.inflation,
        exchangeRate: formValues.exchangeRate,
      };
      
      // Format growth and inflation if they don't already have % symbol
      if (economicIndicators.gdpGrowth && !economicIndicators.gdpGrowth.includes('%')) {
        economicIndicators.gdpGrowth = `${economicIndicators.gdpGrowth}%`;
      }
      
      if (economicIndicators.inflation && !economicIndicators.inflation.includes('%')) {
        economicIndicators.inflation = `${economicIndicators.inflation}%`;
      }
      
      if (economicData?.id) {
        // Update existing economic indicators only
        await apiRequest('PATCH', `/api/countries/${countryId}/economy/${economicData.id}`, {
          ...economicIndicators,
          countryId,
        });
        
        toast({
          title: 'Economic Indicators Updated',
          description: 'The economic indicators have been successfully updated.',
        });
        
        // Refresh the data
        queryClient.invalidateQueries({ queryKey: [`/api/countries/${countryId}/economy`] });
      }
    } catch (error) {
      console.error('Error updating economic indicators:', error);
      toast({
        title: 'Error',
        description: 'There was an error updating the economic indicators. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle update of GDP history only
  const updateGdpHistory = async () => {
    try {
      if (economicData?.id) {
        console.log('Updating GDP history with data:', gdpHistory);
        
        // Make sure all GDP values are numbers, not strings
        const formattedGdpHistory = gdpHistory.map(entry => ({
          year: entry.year,
          gdp: typeof entry.gdp === 'string' ? parseFloat(entry.gdp) : entry.gdp
        }));
        
        console.log('Formatted GDP history for update:', formattedGdpHistory);
        
        // Update only the GDP history data
        await apiRequest('PATCH', `/api/countries/${countryId}/economy/${economicData.id}`, {
          gdpHistory: formattedGdpHistory,
          countryId,
        });
        
        toast({
          title: 'GDP History Updated',
          description: 'The GDP history data has been successfully updated.',
        });
        
        // Refresh the data
        queryClient.invalidateQueries({ queryKey: [`/api/countries/${countryId}/economy`] });
      }
    } catch (error) {
      console.error('Error updating GDP history:', error);
      toast({
        title: 'Error',
        description: 'There was an error updating the GDP history. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle form submission for all data
  const onSubmit = async (data: EconomicDataFormValues) => {
    try {
      console.log('Form submission with data:', data);
      
      // Format growth and inflation if they don't already have % symbol
      if (data.gdpGrowth && !data.gdpGrowth.includes('%')) {
        data.gdpGrowth = `${data.gdpGrowth}%`;
      }
      
      if (data.inflation && !data.inflation.includes('%')) {
        data.inflation = `${data.inflation}%`;
      }
      
      // Format GDP history data to ensure numbers
      const formattedGdpHistory = data.gdpHistory?.map(entry => ({
        year: entry.year,
        gdp: typeof entry.gdp === 'string' ? parseFloat(entry.gdp) : entry.gdp
      })) || [];
      
      console.log('Formatted GDP history:', formattedGdpHistory);
      
      // Prepare the request payload
      const payload = {
        ...data,
        gdpHistory: formattedGdpHistory,
        countryId,
      };
      
      console.log('Sending payload:', payload);
      
      if (economicData?.id) {
        // Update existing economic data
        await apiRequest('PATCH', `/api/countries/${countryId}/economy/${economicData.id}`, payload);
        
        toast({
          title: 'Economic Data Updated',
          description: 'The economic data has been successfully updated.',
        });
      } else {
        // Create new economic data
        await apiRequest('POST', `/api/countries/${countryId}/economy`, payload);
        
        toast({
          title: 'Economic Data Added',
          description: 'The economic data has been successfully added.',
        });
      }
      
      // Refresh the data after successful submission
      queryClient.invalidateQueries({ queryKey: [`/api/countries/${countryId}/economy`] });
    } catch (error) {
      console.error('Error saving economic data:', error);
      toast({
        title: 'Error',
        description: 'There was an error saving the economic data. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-4">Loading economic data...</div>;
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gdp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GDP (in billions USD)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g. 22500" 
                    {...field} 
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Gross Domestic Product in billions of USD</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gdpPerCapita"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GDP Per Capita (USD)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g. 65000" 
                    {...field} 
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>GDP per capita in USD</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gdpGrowth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GDP Growth Rate</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. 3.1%" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>Annual GDP growth rate (include % symbol)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="inflation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inflation Rate</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. 2.5%" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>Annual inflation rate (include % symbol)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="exchangeRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exchange Rate (EUR to USD)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. 1.08" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>Current exchange rate from Euro to US Dollar</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* GDP History Chart and Editor */}
        <div className="border rounded-lg p-4 bg-gray-50 my-6">
          <h3 className="text-lg font-semibold mb-3">GDP Historical Data (2018-2024)</h3>
          <p className="text-sm text-gray-500 mb-4">
            Add or edit historical GDP data for the country. This will appear as a chart on the country's economy page.
          </p>
          
          {/* Chart Preview */}
          <div className="mb-6">
            <Card>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-3">Chart Preview</CardTitle>
                <div className="h-56 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={gdpHistory}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${(value / 1000).toFixed(1)}T`}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
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
              </CardContent>
            </Card>
          </div>
          
          {/* Data Editor */}
          <div className="mb-3">
            <h4 className="text-md font-medium mb-2">Edit GDP Data Points</h4>
            
            {gdpHistory.map((dataPoint, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-3 items-center">
                <div className="col-span-3">
                  <Input
                    placeholder="Year"
                    value={dataPoint.year}
                    onChange={(e) => handleGdpHistoryChange(index, 'year', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="col-span-8">
                  <Input
                    type="number"
                    placeholder="GDP Value (billions)"
                    value={dataPoint.gdp || ''}
                    onChange={(e) => handleGdpHistoryChange(index, 'gdp', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveGdpHistoryEntry(index)}
                  >
                    <Trash className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={handleAddGdpHistoryEntry}
            >
              Add Year
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between">
          <div className="space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              disabled={isLoading || !economicData}
              onClick={updateEconomicIndicators}
            >
              Update Economic Indicators Only
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              disabled={isLoading || !economicData || gdpHistory.length === 0}
              onClick={updateGdpHistory}
            >
              Update GDP History Only
            </Button>
          </div>
          <Button type="submit" disabled={isLoading}>
            {economicData ? 'Update All Data' : 'Save Economic Data'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EconomicDataEditor;