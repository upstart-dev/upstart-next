"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Event {
  id: string;
  title: string;
  description: string;
  registerUrl: string;
  date: string;
  image: string | null;
  status: 'upcoming' | 'finished';
}

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out h-full flex flex-col drop-shadow-md">
      <div className="relative pb-[56.25%]">
        <div className="absolute inset-0"></div>
        <img 
          src={event.image || '/placeholder-image.jpg'} 
          alt={event.title} 
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
          {event.status === 'upcoming' ? 'Enroll' : 'Finished'}
        </div>
      </div>
      <div className="flex-grow flex flex-col justify-between p-6">
        <div>
          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
          <p className="text-sm mb-4">{event.description}</p>
          {event.status === 'upcoming' && (
            <p className="text-sm">{event.date}</p>
          )}
        </div>
        {event.status === 'upcoming' && (
          <div className="mt-4">
            <Button 
              onClick={() => window.open(event.registerUrl, '_blank')}
              className="w-full"
            >
              Register Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function EventCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg h-full flex flex-col drop-shadow-md">
      <div className="relative pb-[56.25%]">
        <Skeleton className="absolute top-0 left-0 w-full h-full" />
      </div>
      <div className="flex-grow flex flex-col justify-between p-6">
        <div>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </div>
  );
}

interface EventsSectionProps {
  id: string;
}

export function EventsSection({ id }: EventsSectionProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const parseDate = (dateString: string) => {
          const [day, month, year] = dateString.split('/').map(Number);
          return new Date(year, month - 1, day);
        };

        const sortedEvents = data.sort((a: Event, b: Event) => {
          const dateA = parseDate(a.date);
          const dateB = parseDate(b.date);
          return dateB.getTime() - dateA.getTime();
        });
        
        setEvents(sortedEvents);
        setError(null);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <section id={id} className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Upcoming UPSTART Events</h2>
          <p className="max-w-[900px] text-xl">
            Join us for exciting hackathons, workshops, and innovation challenges. 
            Expand your skills, connect with fellow innovators, and bring your ideas to life.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </>
          ) : error ? (
            <div className="col-span-full text-center text-red-500">{error}</div>
          ) : (
            events.map((event) => <EventCard key={event.id} event={event} />)
          )}
        </div>
      </div>
    </section>
  );
}