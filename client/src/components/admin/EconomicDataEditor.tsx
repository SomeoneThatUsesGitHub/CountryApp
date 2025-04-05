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
import { Trash } from 'lucide-react';

// Company schema for the form
const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  industry: z.string().optional(),
  revenue: z.string().optional(),
});

// Schema for economic data form
const economicDataSchema = z.object({
  gdp: z.coerce.number().min(0, "GDP must be a positive number").optional().nullable(),
  gdpPerCapita: z.coerce.number().min(0, "GDP per capita must be a positive number").optional().nullable(),
  gdpGrowth: z.string().optional().nullable(),
  inflation: z.string().optional().nullable(),
  topCompanies: z.array(companySchema).optional(),
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
    },
  });
  
  // State for managing companies
  const [companies, setCompanies] = useState<Array<{
    name: string;
    industry: string;
    revenue: string;
  }>>([]);

  // Update form when economic data is loaded
  useEffect(() => {
    if (economicData) {
      // Initialize companies from existing data or empty array
      const companyData = economicData.topCompanies ? 
        (economicData.topCompanies as Array<{name: string; industry: string; revenue: string}>) : 
        [];
      
      setCompanies(companyData);
      
      form.reset({
        gdp: economicData.gdp || null,
        gdpPerCapita: economicData.gdpPerCapita || null,
        gdpGrowth: economicData.gdpGrowth || null,
        inflation: economicData.inflation || null,
        topCompanies: companyData,
      });
    }
  }, [economicData, form]);
  
  // Handle adding a new company
  const handleAddCompany = () => {
    const newCompanies = [...companies, { name: '', industry: '', revenue: '' }];
    setCompanies(newCompanies);
    form.setValue('topCompanies', newCompanies);
  };
  
  // Handle removing a company
  const handleRemoveCompany = (index: number) => {
    const newCompanies = companies.filter((_, i) => i !== index);
    setCompanies(newCompanies);
    form.setValue('topCompanies', newCompanies);
  };
  
  // Handle company field changes
  const handleCompanyChange = (index: number, field: string, value: string) => {
    const newCompanies = [...companies];
    newCompanies[index] = { ...newCompanies[index], [field]: value };
    setCompanies(newCompanies);
    form.setValue('topCompanies', newCompanies);
  };
  
  // Handle form submission
  const onSubmit = async (data: EconomicDataFormValues) => {
    try {
      // Format growth and inflation if they don't already have % symbol
      if (data.gdpGrowth && !data.gdpGrowth.includes('%')) {
        data.gdpGrowth = `${data.gdpGrowth}%`;
      }
      
      if (data.inflation && !data.inflation.includes('%')) {
        data.inflation = `${data.inflation}%`;
      }
      
      if (economicData?.id) {
        // Update existing economic data
        await apiRequest('PATCH', `/api/countries/${countryId}/economy/${economicData.id}`, {
          ...data,
          countryId,
        });
        
        toast({
          title: 'Economic Data Updated',
          description: 'The economic data has been successfully updated.',
        });
      } else {
        // Create new economic data
        await apiRequest('POST', `/api/countries/${countryId}/economy`, {
          ...data,
          countryId,
        });
        
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
        </div>
        
        {/* Top Companies Section */}
        <div className="border rounded-lg p-4 bg-gray-50 my-6">
          <h3 className="text-lg font-semibold mb-3">Top Companies</h3>
          <p className="text-sm text-gray-500 mb-4">Add up to 3 major companies for this country</p>
          
          {companies.map((company, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mb-3 items-center">
              <div className="col-span-5">
                <Input
                  placeholder="Company Name"
                  value={company.name}
                  onChange={(e) => handleCompanyChange(index, 'name', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="col-span-3">
                <Input
                  placeholder="Industry"
                  value={company.industry}
                  onChange={(e) => handleCompanyChange(index, 'industry', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="col-span-3">
                <Input
                  placeholder="Revenue (e.g. $50B)"
                  value={company.revenue}
                  onChange={(e) => handleCompanyChange(index, 'revenue', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="col-span-1 flex justify-center">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemoveCompany(index)}
                >
                  <Trash className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>
          ))}
          
          {companies.length < 3 && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={handleAddCompany}
            >
              Add Company
            </Button>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {economicData ? 'Update Economic Data' : 'Save Economic Data'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EconomicDataEditor;