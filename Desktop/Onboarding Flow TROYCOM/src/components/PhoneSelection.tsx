import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PhoneSelectionProps {
  country: string;
  value: string;
  onChange: (value: string) => void;
}

const phoneFormats = {
  // European Countries
  FRA: '+33 # ## ## ## ##', // France
  DEU: '+49 ### #######', // Germany
  ESP: '+34 ### ### ###', // Spain
  GRC: '+30 ### ### ####', // Greece
  
  // Turkey
  TUR: '+90 ### ### ####', // Turkey
  
  // North America
  USA: '+1 (###) ###-####', // United States
  MEX: '+52 ## #### ####', // Mexico
  CAN: '+1 (###) ###-####', // Canada
  
  // Asia
  CHN: '+86 ### #### ####', // China
  TWN: '+886 ### ### ###', // Taiwan
};

export default function PhoneSelection({ country, value, onChange }: PhoneSelectionProps) {
  const formatPhone = (input: string) => {
    const digits = input.replace(/\D/g, '');
    let format = phoneFormats[country as keyof typeof phoneFormats] || '';
    
    // If no format found for country, return the raw input
    if (!format) {
      return input;
    }
    
    let result = format;
    let digitIndex = 0;
    
    for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
      if (format[i] === '#') {
        result = result.replace('#', digits[digitIndex]);
        digitIndex++;
      }
    }
    
    // Remove any remaining # placeholders
    result = result.split('#')[0].trim();
    
    // If we have a partial number, keep the format visible
    if (result === format.split('#')[0].trim()) {
      return '';
    }
    
    return result;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    onChange(formatted);
  };

  const getPlaceholder = () => {
    const format = phoneFormats[country as keyof typeof phoneFormats];
    if (!format) return 'Enter phone number';
    return format.replace(/#/g, '0');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
          What's your phone number?
        </h2>
        <p className="text-muted-foreground mt-2">
          We'll use this to send important updates
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-foreground">
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder={getPlaceholder()}
          value={value}
          onChange={handleChange}
          className="bg-secondary/50 border-secondary focus:border-primary input-glow"
        />
      </div>
    </div>
  );
}