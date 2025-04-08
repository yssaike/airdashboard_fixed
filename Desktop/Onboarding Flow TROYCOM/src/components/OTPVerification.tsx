import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface OTPVerificationProps {
  phoneNumber: string;
  onVerificationComplete: () => void;
}

export default function OTPVerification({ phoneNumber, onVerificationComplete }: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState<string>('');
  const [isResending, setIsResending] = useState(false);

  // For demo purposes, we'll use a fixed OTP
  const DEMO_OTP = '123456';

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Check if OTP is complete and valid
  useEffect(() => {
    const enteredOTP = otp.join('');
    if (enteredOTP.length === 6) {
      if (enteredOTP === DEMO_OTP) {
        // Auto-proceed when correct OTP is entered
        onVerificationComplete();
      } else {
        setError('Invalid OTP. Please try again.');
      }
    }
  }, [otp, onVerificationComplete]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple digits
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name=otp-${index + 1}]`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name=otp-${index - 1}]`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
    
    // Handle Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
      const enteredOTP = otp.join('');
      if (enteredOTP.length === 6) {
        handleVerify();
      }
    }
  };

  const handleVerify = () => {
    const enteredOTP = otp.join('');
    if (enteredOTP === DEMO_OTP) {
      onVerificationComplete();
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleResend = () => {
    setIsResending(true);
    setTimer(30);
    setError('');
    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
          Verify your phone number
        </h2>
        <p className="text-muted-foreground mt-2">
          Enter the 6-digit code sent to {phoneNumber}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              name={`otp-${index}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl bg-secondary/50 border-secondary focus:border-primary input-glow"
            />
          ))}
        </div>

        <Button
          onClick={handleVerify}
          className="w-full button-glow bg-primary hover:bg-primary/90"
          disabled={otp.some(digit => !digit)}
        >
          Verify OTP
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          {timer > 0 ? (
            <p>Resend code in {timer}s</p>
          ) : (
            <Button
              variant="link"
              onClick={handleResend}
              disabled={isResending}
              className="text-primary"
            >
              {isResending ? 'Resending...' : 'Resend code'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 