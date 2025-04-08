import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import CountrySelection from '@/components/CountrySelection';
import PhoneSelection from '@/components/PhoneSelection';
import OTPVerification from '@/components/OTPVerification';
import BusinessSearch from '@/components/BusinessSearch';
import NumberSelection from '@/components/NumberSelection';

export type FormData = {
  country: string;
  phoneNumber: string;
  isPhoneVerified: boolean;
  businessSearch: {
    name: string;
    address?: string;
    website?: string;
    businessType: string;
  } | null;
  selectedNumber?: string;
};

const TOTAL_STEPS = 5;

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showGifOverlay, setShowGifOverlay] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    country: '',
    phoneNumber: '',
    isPhoneVerified: false,
    businessSearch: null,
    selectedNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleNumberSelect = (number: string) => {
    updateFormData({ selectedNumber: number });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!formData.country;
      case 2:
        return !!formData.phoneNumber;
      case 3:
        return formData.isPhoneVerified;
      case 4:
        return !!formData.businessSearch?.name;
      case 5:
        return !!formData.selectedNumber;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setShowGifOverlay(true);
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Submission failed: ${response.status} ${response.statusText}${errorData ? ` - ${errorData}` : ''}`);
      }
      
      setSubmitStatus('success');
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred during form submission');
    } finally {
      setIsSubmitting(false);
      if (submitStatus === 'error') {
        setShowGifOverlay(false);
      }
    }
  };

  const handleVerificationComplete = () => {
    updateFormData({ isPhoneVerified: true });
    handleNext();
  };

  const handleBusinessSearch = (businessInfo: { name: string; address?: string; website?: string; businessType: string }) => {
    updateFormData({ businessSearch: businessInfo });
    handleNext();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CountrySelection value={formData.country} onChange={(country) => updateFormData({ country })} />;
      case 2:
        return <PhoneSelection country={formData.country} value={formData.phoneNumber} onChange={(phoneNumber) => updateFormData({ phoneNumber })} />;
      case 3:
        return <OTPVerification phoneNumber={formData.phoneNumber} onVerificationComplete={handleVerificationComplete} />;
      case 4:
        return <BusinessSearch onSelect={handleBusinessSearch} />;
      case 5:
        return <NumberSelection onSelect={handleNumberSelect} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-xl p-8 glass-card relative overflow-hidden">
        {showGifOverlay ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
            <div className="w-full h-full flex items-center justify-center p-8">
              <img 
                src="/ThinkAnswer-ezgif.com-optimize.gif" 
                alt="Building your number" 
                className="w-full h-full object-cover"
                style={{ minHeight: '400px' }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Progress 
                value={(currentStep / TOTAL_STEPS) * 100} 
                className="h-1 bg-secondary"
              />
              <p className="text-sm text-muted-foreground text-right">
                Step {currentStep} of {TOTAL_STEPS}
              </p>
            </div>

            <div className="min-h-[400px] mt-8">
              {renderStep()}
            </div>

            {submitStatus && (
              <Alert variant={submitStatus === 'success' ? 'default' : 'destructive'}>
                <AlertDescription className="flex items-center gap-2">
                  {submitStatus === 'success' ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Form submitted successfully!
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4" />
                      {errorMessage || 'There was an error submitting the form. Please try again.'}
                    </>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between pt-8">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="button-glow"
              >
                Back
              </Button>
              
              {currentStep === TOTAL_STEPS ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className="button-glow bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? 'Building...' : 'Build Your Number'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="button-glow bg-primary hover:bg-primary/90"
                >
                  Next
                </Button>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default App;