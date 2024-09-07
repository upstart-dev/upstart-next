"use client";

import React, { Suspense } from "react";
import dynamic from 'next/dynamic';

// Importe o OnboardingForm usando dynamic import para garantir que ele seja carregado apenas no lado do cliente
const OnboardingForm = dynamic(() => import('./OnboardingForm'), { ssr: false });

// Componente de fallback enquanto o formulário está carregando
const FormSkeleton: React.FC = () => (
  <div className="max-w-4xl mx-auto p-6 mt-4">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-3/4 mb-8 mx-auto"></div>
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-300 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

const OnboardingPage: React.FC = () => {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <OnboardingForm />
    </Suspense>
  );
};

export default OnboardingPage;