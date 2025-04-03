import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Edit, Trash, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Organization {
  name: string;
  acronym: string;
  joinDate?: string;
  role?: string;
  website?: string;
}

interface OrganizationsEditorProps {
  countryId: number;
  politicalSystemId: number | null;
  initialOrganizations?: Organization[];
}

const OrganizationsEditor: React.FC<OrganizationsEditorProps> = ({ 
  countryId, 
  politicalSystemId, 
  initialOrganizations = [] 
}) => {
  const { toast } = useToast();
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [acronym, setAcronym] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [role, setRole] = useState('');
  const [website, setWebsite] = useState('');
  
  // Load initial organizations
  useEffect(() => {
    if (initialOrganizations && initialOrganizations.length > 0) {
      setOrganizations(initialOrganizations);
    }
  }, [initialOrganizations]);
  
  const resetForm = () => {
    setName('');
    setAcronym('');
    setJoinDate('');
    setRole('');
    setWebsite('');
    setIsEditMode(false);
    setCurrentIndex(null);
  };
  
  const handleOpenDialog = (index?: number) => {
    if (index !== undefined) {
      // Edit mode
      const org = organizations[index];
      setName(org.name);
      setAcronym(org.acronym);
      setJoinDate(org.joinDate || '');
      setRole(org.role || '');
      setWebsite(org.website || '');
      setIsEditMode(true);
      setCurrentIndex(index);
    } else {
      // Add mode
      resetForm();
    }
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleSaveOrganization = async () => {
    if (!name || !acronym) {
      toast({
        title: "Validation Error",
        description: "Organization name and acronym are required.",
        variant: "destructive"
      });
      return;
    }
    
    const newOrg: Organization = {
      name,
      acronym,
      joinDate: joinDate || undefined,
      role: role || undefined,
      website: website || undefined
    };
    
    try {
      let updatedOrgs: Organization[];
      
      if (isEditMode && currentIndex !== null) {
        // Update existing organization
        updatedOrgs = organizations.map((org, index) => 
          index === currentIndex ? newOrg : org
        );
      } else {
        // Add new organization
        updatedOrgs = [...organizations, newOrg];
      }
      
      setOrganizations(updatedOrgs);
      
      // If there's no political system yet, we need to create one
      if (!politicalSystemId) {
        const result = await apiRequest('POST', `/api/countries/${countryId}/political-system`, {
          countryId,
          type: 'Democracy', // Default type
          organizations: updatedOrgs
        });
        
        // Update the political system ID from the response
        queryClient.invalidateQueries({ queryKey: [`/api/countries/${countryId}/political-system`] });
      } else {
        // Update existing political system
        await apiRequest('PATCH', `/api/countries/${countryId}/political-system/${politicalSystemId}`, {
          organizations: updatedOrgs
        });
        
        queryClient.invalidateQueries({ queryKey: [`/api/countries/${countryId}/political-system`] });
      }
      
      toast({
        title: isEditMode ? "Organization Updated" : "Organization Added",
        description: `The organization has been ${isEditMode ? 'updated' : 'added'} successfully.`
      });
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving organization:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? 'update' : 'add'} the organization.`,
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteOrganization = async (index: number) => {
    if (confirm('Are you sure you want to delete this organization?')) {
      try {
        const updatedOrgs = organizations.filter((_, i) => i !== index);
        setOrganizations(updatedOrgs);
        
        // Only update the database if we have a political system
        if (politicalSystemId) {
          await apiRequest('PATCH', `/api/countries/${countryId}/political-system/${politicalSystemId}`, {
            organizations: updatedOrgs
          });
          
          queryClient.invalidateQueries({ queryKey: [`/api/countries/${countryId}/political-system`] });
        }
        
        toast({
          title: "Organization Deleted",
          description: "The organization has been removed successfully."
        });
      } catch (error) {
        console.error('Error deleting organization:', error);
        toast({
          title: "Error",
          description: "Failed to delete the organization.",
          variant: "destructive"
        });
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">International Organizations</h3>
        <Button onClick={() => handleOpenDialog()} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Organization
        </Button>
      </div>
      
      {organizations.length === 0 ? (
        <div className="py-6 flex flex-col items-center justify-center text-center border rounded-md bg-gray-50">
          <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No international organizations added yet.</p>
          <p className="text-xs text-gray-400 mt-1">Add organizations that this country is a member of.</p>
        </div>
      ) : (
        <Table>
          <TableCaption>List of international organizations that the country is a member of</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Acronym</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{org.name}</TableCell>
                <TableCell>{org.acronym}</TableCell>
                <TableCell>{org.joinDate || '-'}</TableCell>
                <TableCell>{org.role || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => handleOpenDialog(index)} variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleDeleteOrganization(index)} variant="ghost" size="sm">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Organization' : 'Add New Organization'}</DialogTitle>
            <DialogDescription>
              Enter the details of the international organization membership.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name *</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="United Nations"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="acronym">Acronym *</Label>
                <Input 
                  id="acronym" 
                  value={acronym} 
                  onChange={(e) => setAcronym(e.target.value)}
                  placeholder="UN"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input 
                id="joinDate" 
                value={joinDate} 
                onChange={(e) => setJoinDate(e.target.value)}
                placeholder="e.g., 1945, October 24 1945, etc."
              />
              <p className="text-xs text-gray-500">
                Enter date in any format (e.g., "1945", "October 24, 1945")
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role or Status</Label>
              <Input 
                id="role" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Founding member, Observer, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input 
                id="website" 
                value={website} 
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://www.un.org"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveOrganization}>
              {isEditMode ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationsEditor;