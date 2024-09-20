'use client';

import { useEffect, useState } from 'react';
import Layout from "@/components/my-layout";
import EventsContent from "./EventsSection";

export default function EventsPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout
      pageTitle="Events"
      activePage="events"
    >
      <EventsContent />
    </Layout>
  );
}