import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface NumberSelectionProps {
  onSelect: (number: string) => void;
}

// Mock data for available numbers by country
const availableNumbers = {
  USA: [
    '+1 (415) 555-0123',
    '+1 (415) 555-0124',
    '+1 (415) 555-0125',
    '+1 (415) 555-0126',
  ],
  FRA: [
    '+33 1 23 45 67 89',
    '+33 1 23 45 67 90',
    '+33 1 23 45 67 91',
    '+33 1 23 45 67 92',
  ],
  DEU: [
    '+49 30 1234567',
    '+49 30 1234568',
    '+49 30 1234569',
    '+49 30 1234570',
  ],
  ESP: [
    '+34 911 23 45 67',
    '+34 911 23 45 68',
    '+34 911 23 45 69',
    '+34 911 23 45 70',
  ],
  GRC: [
    '+30 21 1234 5678',
    '+30 21 1234 5679',
    '+30 21 1234 5680',
    '+30 21 1234 5681',
  ],
  TUR: [
    '+90 212 345 6789',
    '+90 212 345 6790',
    '+90 212 345 6791',
    '+90 212 345 6792',
  ],
  MEX: [
    '+52 55 1234 5678',
    '+52 55 1234 5679',
    '+52 55 1234 5680',
    '+52 55 1234 5681',
  ],
  CAN: [
    '+1 (604) 555-0123',
    '+1 (604) 555-0124',
    '+1 (604) 555-0125',
    '+1 (604) 555-0126',
  ],
  CHN: [
    '+86 10 1234 5678',
    '+86 10 1234 5679',
    '+86 10 1234 5680',
    '+86 10 1234 5681',
  ],
  TWN: [
    '+886 2 1234 5678',
    '+886 2 1234 5679',
    '+886 2 1234 5680',
    '+886 2 1234 5681',
  ],
};

const countries = [
  { value: 'FRA', label: '🇫🇷 France' },
  { value: 'DEU', label: '🇩🇪 Germany' },
  { value: 'ESP', label: '🇪🇸 Spain' },
  { value: 'GRC', label: '🇬🇷 Greece' },
  { value: 'TUR', label: '🇹🇷 Turkey' },
  { value: 'USA', label: '🇺🇸 United States' },
  { value: 'MEX', label: '🇲🇽 Mexico' },
  { value: 'CAN', label: '🇨🇦 Canada' },
  { value: 'CHN', label: '🇨🇳 China' },
  { value: 'TWN', label: '🇹🇼 Taiwan' },
];

export default function NumberSelection({ onSelect }: NumberSelectionProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedNumber, setSelectedNumber] = useState<string>('');

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedNumber(''); // Reset selected number when country changes
  };

  const handleNumberSelect = (number: string) => {
    setSelectedNumber(number);
    onSelect(number);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
          Choose Your Number
        </h2>
        <p className="text-muted-foreground mt-2">
          Select a country to see available numbers
        </p>
      </div>

      <div className="space-y-6">
        <Select value={selectedCountry} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-full bg-secondary/50 border-secondary focus:border-primary input-glow">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem 
                key={country.value} 
                value={country.value}
                className="focus:bg-primary/20"
              >
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedCountry && (
          <div className="space-y-4">
            <RadioGroup
              value={selectedNumber}
              onValueChange={handleNumberSelect}
              className="grid gap-4"
            >
              {availableNumbers[selectedCountry as keyof typeof availableNumbers].map((number) => (
                <Card key={number} className="relative">
                  <RadioGroupItem
                    value={number}
                    id={number}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={number}
                    className="flex items-center justify-between p-4 h-full w-full rounded-md border-2 border-muted bg-secondary/50 hover:bg-secondary/80 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                  >
                    <span className="font-medium">{number}</span>
                  </Label>
                </Card>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>
    </div>
  );
} 