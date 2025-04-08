import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, Building2, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BusinessSearchProps {
  onSelect: (businessInfo: {
    name: string;
    address?: string;
    website?: string;
    businessType: string;
  }) => void;
}

// Mock business data for demonstration
const MOCK_BUSINESSES = [
  {
    id: 1,
    name: 'Acme Corporation',
    address: '123 Business Ave, Suite 100, San Francisco, CA 94107',
    website: 'www.acmecorp.com',
    businessType: 'enterprise',
  },
  {
    id: 2,
    name: 'TechStart Solutions',
    address: '456 Innovation Blvd, Palo Alto, CA 94301',
    website: 'www.techstart.io',
    businessType: 'technology',
  },
  {
    id: 3,
    name: 'Green Earth Cafe',
    address: '789 Organic Street, Berkeley, CA 94704',
    website: 'www.greenearthcafe.com',
    businessType: 'restaurant',
  },
];

const BUSINESS_TYPES = [
  { value: 'retail', label: 'Retail Store' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'technology', label: 'Technology Company' },
  { value: 'logistics', label: 'Logistics Company' },
];

export default function BusinessSearch({ onSelect }: BusinessSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [manualInfo, setManualInfo] = useState({
    name: '',
    address: '',
    website: '',
    businessType: '',
  });

  const filteredBusinesses = MOCK_BUSINESSES.filter(business =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInfo.name && manualInfo.businessType) {
      onSelect({
        name: manualInfo.name,
        address: manualInfo.address,
        website: manualInfo.website,
        businessType: manualInfo.businessType,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
          Find your business
        </h2>
        <p className="text-muted-foreground mt-2">
          Search for your business or enter the details manually
        </p>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Manual Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for your business..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary/50 border-secondary focus:border-primary input-glow"
            />
          </div>

          <div className="space-y-2">
            {filteredBusinesses.map((business) => (
              <Card
                key={business.id}
                className="p-4 hover:bg-secondary/50 cursor-pointer transition-colors"
                onClick={() => onSelect(business)}
              >
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">{business.name}</h3>
                    <p className="text-sm text-muted-foreground">{business.address}</p>
                    {business.website && (
                      <p className="text-sm text-primary">{business.website}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Type: {BUSINESS_TYPES.find(type => type.value === business.businessType)?.label}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="manual">
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={manualInfo.name}
                onChange={(e) => setManualInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your business name"
                className="bg-secondary/50 border-secondary focus:border-primary input-glow"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select
                value={manualInfo.businessType}
                onValueChange={(value) => setManualInfo(prev => ({ ...prev, businessType: value }))}
              >
                <SelectTrigger className="bg-secondary/50 border-secondary focus:border-primary input-glow">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress">Business Address</Label>
              <Input
                id="businessAddress"
                value={manualInfo.address}
                onChange={(e) => setManualInfo(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter your business address"
                className="bg-secondary/50 border-secondary focus:border-primary input-glow"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessWebsite">Website (Optional)</Label>
              <Input
                id="businessWebsite"
                value={manualInfo.website}
                onChange={(e) => setManualInfo(prev => ({ ...prev, website: e.target.value }))}
                placeholder="Enter your business website"
                className="bg-secondary/50 border-secondary focus:border-primary input-glow"
              />
            </div>

            <Button
              type="submit"
              className="w-full button-glow bg-primary hover:bg-primary/90"
              disabled={!manualInfo.name || !manualInfo.businessType}
            >
              Continue
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
} 