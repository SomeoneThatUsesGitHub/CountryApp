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
import { Trash, AreaChart, ArrowDownToLine as Import, ArrowUpFromLine as Export } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Schema for trade data item
const tradeItemSchema = z.object({
  product: z.string().min(1, "Product name is required"),
  value: z.string().min(1, "Value is required"),
  percentage: z.coerce.number().min(0, "Percentage must be 0 or greater").max(100, "Percentage cannot exceed 100"),
});

// Schema for imports/exports form
const tradeDataSchema = z.object({
  imports: z.array(tradeItemSchema),
  exports: z.array(tradeItemSchema),
});

type TradeDataFormValues = z.infer<typeof tradeDataSchema>;

interface ImportsExportsEditorProps {
  countryId: number;
}

const ImportsExportsEditor: React.FC<ImportsExportsEditorProps> = ({ countryId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch economic data for the selected country
  const { data: economicData, isLoading } = useQuery<EconomicData>({
    queryKey: [`/api/countries/${countryId}/economy`],
    enabled: countryId !== null,
  });
  
  // State for managing imports/exports data
  const [importItems, setImportItems] = useState<Array<{
    product: string;
    value: string;
    percentage: number;
  }>>([]);
  
  const [exportItems, setExportItems] = useState<Array<{
    product: string;
    value: string;
    percentage: number;
  }>>([]);
  
  // Setup form with validation
  const form = useForm<TradeDataFormValues>({
    resolver: zodResolver(tradeDataSchema),
    defaultValues: {
      imports: [],
      exports: [],
    },
  });

  // Update form when economic data is loaded
  useEffect(() => {
    if (economicData) {
      console.log('Economic data loaded for trade:', economicData);
      
      // Initialize imports and exports from existing data
      const mainIndustries = economicData.mainIndustries as any || {};
      
      let importsData = mainIndustries.imports ? 
        (Array.isArray(mainIndustries.imports) ? mainIndustries.imports : []) : 
        [];
      
      let exportsData = mainIndustries.exports ? 
        (Array.isArray(mainIndustries.exports) ? mainIndustries.exports : []) : 
        [];
      
      console.log('Parsed imports data:', importsData);
      console.log('Parsed exports data:', exportsData);
      
      // If no data exists, create some example entries
      if (importsData.length === 0) {
        importsData = [
          { product: '', value: '', percentage: 0 },
          { product: '', value: '', percentage: 0 },
          { product: '', value: '', percentage: 0 }
        ];
      }
      
      if (exportsData.length === 0) {
        exportsData = [
          { product: '', value: '', percentage: 0 },
          { product: '', value: '', percentage: 0 },
          { product: '', value: '', percentage: 0 }
        ];
      }
      
      setImportItems(importsData);
      setExportItems(exportsData);
      
      form.reset({
        imports: importsData,
        exports: exportsData,
      });
    }
  }, [economicData, form]);
  
  // Handle adding a new import item
  const handleAddImportItem = () => {
    const newImports = [...importItems, { product: '', value: '', percentage: 0 }];
    setImportItems(newImports);
    form.setValue('imports', newImports);
  };
  
  // Handle removing an import item
  const handleRemoveImportItem = (index: number) => {
    const newImports = importItems.filter((_, i) => i !== index);
    setImportItems(newImports);
    form.setValue('imports', newImports);
  };
  
  // Handle import field changes
  const handleImportChange = (index: number, field: string, value: any) => {
    const newImports = [...importItems];
    if (field === 'percentage' && value !== '') {
      value = Number(value);
    }
    newImports[index] = { ...newImports[index], [field]: value };
    setImportItems(newImports);
    form.setValue('imports', newImports);
  };
  
  // Handle adding a new export item
  const handleAddExportItem = () => {
    const newExports = [...exportItems, { product: '', value: '', percentage: 0 }];
    setExportItems(newExports);
    form.setValue('exports', newExports);
  };
  
  // Handle removing an export item
  const handleRemoveExportItem = (index: number) => {
    const newExports = exportItems.filter((_, i) => i !== index);
    setExportItems(newExports);
    form.setValue('exports', newExports);
  };
  
  // Handle export field changes
  const handleExportChange = (index: number, field: string, value: any) => {
    const newExports = [...exportItems];
    if (field === 'percentage' && value !== '') {
      value = Number(value);
    }
    newExports[index] = { ...newExports[index], [field]: value };
    setExportItems(newExports);
    form.setValue('exports', newExports);
  };
  
  // Submit imports and exports data
  const onSubmit = async (data: TradeDataFormValues) => {
    try {
      console.log('Form submission with trade data:', data);
      
      if (economicData?.id) {
        // Update existing economic data with trade info
        await apiRequest('PATCH', `/api/countries/${countryId}/economy/${economicData.id}`, {
          mainIndustries: {
            imports: data.imports,
            exports: data.exports
          },
          countryId,
        });
        
        toast({
          title: 'Trade Data Updated',
          description: 'The imports and exports data has been successfully updated.',
        });
      } else {
        // Create new economic data if it doesn't exist yet
        await apiRequest('POST', `/api/countries/${countryId}/economy`, {
          mainIndustries: {
            imports: data.imports,
            exports: data.exports
          },
          countryId,
        });
        
        toast({
          title: 'Trade Data Added',
          description: 'The imports and exports data has been successfully added.',
        });
      }
      
      // Refresh the data after successful submission
      queryClient.invalidateQueries({ queryKey: [`/api/countries/${countryId}/economy`] });
    } catch (error) {
      console.error('Error saving trade data:', error);
      toast({
        title: 'Error',
        description: 'There was an error saving the imports and exports data. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-4">Loading trade data...</div>;
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Imports Section */}
        <Card className="border border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Import className="h-5 w-5 mr-2 text-blue-600" />
              <CardTitle className="text-lg">Imports</CardTitle>
            </div>
            
            <div className="space-y-4">
              {importItems.map((item, index) => (
                <div key={`import-${index}`} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Input
                      placeholder="Product/Category Name"
                      value={item.product}
                      onChange={(e) => handleImportChange(index, 'product', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      placeholder="Value (e.g. $98.2B)"
                      value={item.value}
                      onChange={(e) => handleImportChange(index, 'value', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center">
                      <Input
                        type="number"
                        placeholder="% of imports"
                        value={item.percentage}
                        onChange={(e) => handleImportChange(index, 'percentage', e.target.value)}
                        className="w-full"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      <span className="ml-1">%</span>
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveImportItem(index)}
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
                onClick={handleAddImportItem}
              >
                Add Import Item
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Separator className="my-4" />
        
        {/* Exports Section */}
        <Card className="border border-green-100">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Export className="h-5 w-5 mr-2 text-green-600" />
              <CardTitle className="text-lg">Exports</CardTitle>
            </div>
            
            <div className="space-y-4">
              {exportItems.map((item, index) => (
                <div key={`export-${index}`} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Input
                      placeholder="Product/Category Name"
                      value={item.product}
                      onChange={(e) => handleExportChange(index, 'product', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      placeholder="Value (e.g. $129.7B)"
                      value={item.value}
                      onChange={(e) => handleExportChange(index, 'value', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center">
                      <Input
                        type="number"
                        placeholder="% of exports"
                        value={item.percentage}
                        onChange={(e) => handleExportChange(index, 'percentage', e.target.value)}
                        className="w-full"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      <span className="ml-1">%</span>
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveExportItem(index)}
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
                onClick={handleAddExportItem}
              >
                Add Export Item
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            Save Trade Data
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ImportsExportsEditor;