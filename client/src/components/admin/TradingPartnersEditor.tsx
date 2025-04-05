import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';
import { EconomicData } from '@shared/schema';
import { Plus, Trash2, Globe, Briefcase } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Schema for the trading partners form
const tradingPartnerSchema = z.object({
  country: z.string().min(1, "Country name is required"),
  relationship: z.string().optional(),
  tradeVolume: z.string().min(1, "Trade volume is required"),
});

// Schema for the industry specializations form
const industrySpecializationSchema = z.object({
  name: z.string().min(1, "Industry name is required"),
  description: z.string().optional(),
  contribution: z.string().min(1, "GDP contribution is required"),
});

// Schema for the entire form
const tradePartnersFormSchema = z.object({
  tradingPartners: z.array(tradingPartnerSchema).optional(),
  industrySpecializations: z.array(industrySpecializationSchema).optional(),
});

type TradePartnersFormValues = z.infer<typeof tradePartnersFormSchema>;

interface TradingPartnersEditorProps {
  countryId: number;
}

const TradingPartnersEditor: React.FC<TradingPartnersEditorProps> = ({ countryId }) => {
  // Fetch economic data for the selected country
  const { data: economicData, isLoading: isLoadingEconomicData } = useQuery<EconomicData>({
    queryKey: [`/api/countries/${countryId}/economy`],
    enabled: countryId !== null,
  });

  // Set up form with default values
  const form = useForm<TradePartnersFormValues>({
    resolver: zodResolver(tradePartnersFormSchema),
    defaultValues: {
      tradingPartners: [],
      industrySpecializations: [],
    },
  });

  // Set up field arrays for trading partners and industry specializations
  const tradingPartnersArray = useFieldArray({
    control: form.control,
    name: "tradingPartners",
  });

  const industrySpecializationsArray = useFieldArray({
    control: form.control,
    name: "industrySpecializations",
  });

  // Update form when economic data is loaded
  useEffect(() => {
    if (economicData) {
      // Handle trading partners data
      let tradingPartners: Array<{
        country: string;
        relationship?: string;
        tradeVolume: string;
      }> = [];
      if (economicData.tradingPartners && Array.isArray(economicData.tradingPartners)) {
        tradingPartners = economicData.tradingPartners;
      }

      // Handle industry specializations data
      let industrySpecializations: Array<{
        name: string;
        description?: string;
        contribution: string;
      }> = [];
      if (economicData.industrySpecializations && Array.isArray(economicData.industrySpecializations)) {
        industrySpecializations = economicData.industrySpecializations;
      }

      // Reset form with the fetched data
      form.reset({
        tradingPartners,
        industrySpecializations,
      });
    }
  }, [economicData, form]);

  // Handle form submission
  const onSubmit = async (data: TradePartnersFormValues) => {
    try {
      // Get the current economic data
      const currentData = economicData || {};

      // Prepare update payload with the existing and new data
      const updatePayload = {
        ...currentData,
        tradingPartners: data.tradingPartners || [],
        industrySpecializations: data.industrySpecializations || [],
      };

      // Update the economic data
      await apiRequest(
        economicData ? 'PATCH' : 'POST',
        `/api/countries/${countryId}/economy${economicData ? `/${economicData.id}` : ''}`,
        updatePayload
      );

      // Invalidate the query to refetch the data
      queryClient.invalidateQueries({ queryKey: [`/api/countries/${countryId}/economy`] });

      toast({
        title: 'Success',
        description: 'Trading partners and industry specializations have been updated.',
      });
    } catch (error) {
      console.error('Failed to update trading partners and industry specializations:', error);
      toast({
        title: 'Error',
        description: 'There was an error updating the trading partners and industry specializations.',
        variant: 'destructive',
      });
    }
  };

  if (isLoadingEconomicData) {
    return <div className="p-6 text-center">Loading economic data...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="trading-partners">
          <TabsList className="mb-4">
            <TabsTrigger value="trading-partners">Trading Partners</TabsTrigger>
            <TabsTrigger value="industry-specializations">Industry Specializations</TabsTrigger>
          </TabsList>

          {/* Trading Partners Tab */}
          <TabsContent value="trading-partners">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center mb-4">
                  <Globe className="h-5 w-5 mr-2 text-purple-600" />
                  <h3 className="text-lg font-medium">Trading Partners</h3>
                </div>

                <div className="space-y-4">
                  {tradingPartnersArray.fields.map((field, index) => (
                    <div key={field.id} className="flex items-start space-x-2">
                      <div className="grid grid-cols-3 gap-4 flex-1">
                        <FormField
                          control={form.control}
                          name={`tradingPartners.${index}.country`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., United States" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`tradingPartners.${index}.relationship`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Relationship</FormLabel>
                              <Select
                                value={field.value || ''}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select relationship" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Primary Export Market">Primary Export Market</SelectItem>
                                  <SelectItem value="Main Import Source">Main Import Source</SelectItem>
                                  <SelectItem value="Strategic Partner">Strategic Partner</SelectItem>
                                  <SelectItem value="Growing Market">Growing Market</SelectItem>
                                  <SelectItem value="Free Trade Agreement">Free Trade Agreement</SelectItem>
                                  <SelectItem value="Bilateral Agreement">Bilateral Agreement</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`tradingPartners.${index}.tradeVolume`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Trade Volume (Billions $)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., 42.5" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="mt-8"
                        onClick={() => tradingPartnersArray.remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => tradingPartnersArray.append({ country: '', relationship: '', tradeVolume: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Trading Partner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Industry Specializations Tab */}
          <TabsContent value="industry-specializations">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center mb-4">
                  <Briefcase className="h-5 w-5 mr-2 text-cyan-600" />
                  <h3 className="text-lg font-medium">Industry Specializations</h3>
                </div>

                <div className="space-y-4">
                  {industrySpecializationsArray.fields.map((field, index) => (
                    <div key={field.id} className="flex items-start space-x-2">
                      <div className="grid grid-cols-3 gap-4 flex-1">
                        <FormField
                          control={form.control}
                          name={`industrySpecializations.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Industry</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., Automotive" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`industrySpecializations.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Brief description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`industrySpecializations.${index}.contribution`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GDP Contribution (%)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., 12.5" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="mt-8"
                        onClick={() => industrySpecializationsArray.remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => industrySpecializationsArray.append({ name: '', description: '', contribution: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Industry Specialization
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </Form>
  );
};

export default TradingPartnersEditor;