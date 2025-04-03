import React from 'react';
import { Globe, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
  if (!organizations || organizations.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        No international organization data available for {countryName}.
      </div>
    );
  }

  // Sort organizations by name
  const sortedOrganizations = [...organizations].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Globe className="h-5 w-5 mr-2 text-blue-500" />
        <h3 className="text-lg font-medium">International Organizations</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedOrganizations.map((org, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-lg">{org.name}</h4>
                  <Badge variant="outline" className="mt-1">{org.acronym}</Badge>
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
              
              <Separator className="my-2" />
              
              <div className="mt-2 text-sm space-y-1">
                {org.joinDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Join Date:</span>
                    <span>{org.joinDate}</span>
                  </div>
                )}
                
                {org.role && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span>{org.role}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InternationalOrganizations;