'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const TermsAndConditions: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAccept = () => {
    if (isClient) {
      const formData = searchParams.get('formData');
      if (formData) {
        localStorage.setItem('formData', formData);
      }
      router.push('/onboarding?accepted=true');
    }
  };

  const handleDecline = () => {
    if (isClient) {
      router.push('/onboarding');
    }
  };

  if (!isClient) {
    return null; // or a loading indicator
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
      <Card className="w-full max-w-3xl bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Terms of Use and Data Protection Agreement</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4 text-sm">
              <p>Welcome to Upstart! Before proceeding, we kindly ask you to carefully read our Terms of Use and Data Protection Policy. These terms are crucial to ensure the protection of your privacy and to establish guidelines for the use of our services.</p>

              <h2 className="text-lg font-semibold mt-4">Data Collection</h2>
              <p>By using our services, you agree to the collection and processing of personal information in accordance with our Data Protection Policy. This information may include your name, email address, phone number, and academic data.</p>

              <h2 className="text-lg font-semibold mt-4">Purpose of Collection</h2>
              <p>The collected data is used to personalize your experience on Upstart, facilitate communication, and provide relevant information about our events, opportunities, and initiatives. We will never share your data with third parties without your consent.</p>

              <h2 className="text-lg font-semibold mt-4">User Rights</h2>
              <p>You have the right to access, correct, and delete your personal data. Additionally, you can opt out of receiving future communications at any time.</p>

              <h2 className="text-lg font-semibold mt-4">Future Communications</h2>
              <p>By accepting these terms, you consent to receive communications from Upstart, including newsletters, updates, and event invitations. You can opt out of these communications at any time.</p>

              <h2 className="text-lg font-semibold mt-4">Data Security</h2>
              <p>We employ rigorous security measures to protect your data from unauthorized access or disclosure.</p>

              <p className="mt-4">By continuing to use our services, you agree to these Terms of Use and our Data Protection Policy. If you have questions or need more information, please contact us at general@upstart.pt.</p>

              <p className="mt-4">Thank you for trusting us!</p>
              <p>Best regards,<br />The Upstart Team</p>
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 pt-4">
          <Button onClick={handleDecline} variant="outline" className="bg-gray-100 text-700 hover:bg-red-600">
            Decline
          </Button>
          <Button onClick={handleAccept} className="text-white hover:bg-green-600">
            Accept
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TermsAndConditions;