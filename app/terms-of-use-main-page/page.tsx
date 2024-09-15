"use client";

import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';

const TermsOfUse: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-3xl bg-white shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-indigo-600 text-white p-6">
          <CardTitle className="text-3xl font-bold text-center">Terms of Use</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-6 p-6 text-gray-700">
              <p className="text-lg leading-relaxed">Welcome to Upstart! Before proceeding, we kindly ask you to carefully read our Terms of Use and Data Protection Policy. These terms are crucial to ensure the protection of your privacy and to establish guidelines for the use of our services.</p>
              
              <h2 className="text-2xl font-semibold text-indigo-700 mt-8">Data Collection</h2>
              <p>By using our services, you agree to the collection and processing of personal information in accordance with our Data Protection Policy. This information may include your name, email address, phone number, and academic data.</p>
              
              <h2 className="text-2xl font-semibold text-indigo-700 mt-8">Purpose of Collection</h2>
              <p>The collected data is used to personalize your experience on Upstart, facilitate communication, and provide relevant information about our events, opportunities, and initiatives. We will never share your data with third parties without your consent.</p>
              
              <h2 className="text-2xl font-semibold text-indigo-700 mt-8">User Rights</h2>
              <p>You have the right to access, correct, and delete your personal data. Additionally, you can opt out of receiving future communications at any time.</p>
              
              <h2 className="text-2xl font-semibold text-indigo-700 mt-8">Future Communications</h2>
              <p>By accepting these terms, you consent to receive communications from Upstart, including newsletters, updates, and event invitations. You can opt out of these communications at any time.</p>
              
              <h2 className="text-2xl font-semibold text-indigo-700 mt-8">Data Security</h2>
              <p>We employ rigorous security measures to protect your data from unauthorized access or disclosure.</p>
              
              <p className="mt-8 font-medium">By continuing to use our services, you agree to these Terms of Use and our Data Protection Policy. If you have questions or need more information, please contact us at general@upstart.pt.</p>
              
              <p className="mt-8 font-medium">Thank you for trusting us!</p>
              <p className="mt-4">Best regards,<br />The Upstart Team</p>
              
              <Separator className="my-8" />
              
              <p className="text-sm text-gray-600">If you have any questions about these Terms of Use, please contact us using the interface at the main page.</p>
              <p className="text-sm text-gray-600 mt-4">Last updated: September 2024</p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfUse;