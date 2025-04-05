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

// Schema for economic data form
const economicDataSchema = z.object({
  gdp: z.coerce.number().min(0, "GDP must be a positive number").optional().nullable(),
  gdpPerCapita: z.coerce.number().min(0, "GDP per capita must be a positive number").optional().nullable(),
  gdpGrowth: z.string().optional().nullable(),
  inflation: z.string().optional().nullable(),
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
  
  // Update form when economic data is loaded
  useEffect(() => {
    if (economicData) {
      form.reset({
        gdp: economicData.gdp || null,
        gdpPerCapita: economicData.gdpPerCapita || null,
        gdpGrowth: economicData.gdpGrowth || null,
        inflation: economicData.inflation || null,
      });
    }
  }, [economicData, form]);
  
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