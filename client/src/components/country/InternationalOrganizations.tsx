import React from 'react';
import { Globe, ExternalLink, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Organization {
  name: string;
  acronym: string;
  joinDate?: string;
  role?: string;
  website?: string;
}

interface InternationalOrganizationsProps {
  organizations?: Organization[];
  countryName: string;
}

const InternationalOrganizations: React.FC<InternationalOrganizationsProps> = ({ 
  organizations = [], 
  countryName 
}) => {
  // Sort organizations by name
  const sortedOrganizations = [...organizations].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  // Function to get role badge style
  const getRoleStyle = (role?: string) => {
    if (!role) return 'bg-gray-100 text-gray-800 border-gray-300';
    
    switch (role.toLowerCase()) {
      case 'founding member':
      case 'founder':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'full member':
      case 'member':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'associate member':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'observer':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'applicant':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'withdrawn':
      case 'former member':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Globe className="h-5 w-5 mr-2 text-primary" />
        <h3 className="text-lg font-medium">International Organizations</h3>
      </div>
      
      {organizations && organizations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedOrganizations.map((org, index) => (
            <Card key={index} className="border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow">
              <CardContent className="p-3 sm:p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-md">{org.name}</h4>
                    <Badge 
                      variant="outline" 
                      className="mt-1 bg-blue-50 text-blue-700"
                    >
                      {org.acronym}
                    </Badge>
                  </div>
                  {org.website && (
                    <a 
                      href={org.website.startsWith('http') ? org.website : `https://${org.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 my-2">
                  {org.role && (
                    <Badge 
                      variant="outline" 
                      className={cn("flex items-center", getRoleStyle(org.role))}
                    >
                      {org.role}
                    </Badge>
                  )}
                  
                  {org.joinDate && (
                    <Badge variant="outline" className="bg-gray-50">
                      Joined: {org.joinDate}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-6 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <Building2 className="h-6 w-6 text-gray-400" />
          </div>
          <h4 className="text-base font-medium mb-1">No International Organizations</h4>
          <p className="text-sm text-gray-500 max-w-md">
            {countryName} doesn't have any international organization memberships listed.
          </p>
        </div>
      )}
    </div>
  );
};

export default InternationalOrganizations;