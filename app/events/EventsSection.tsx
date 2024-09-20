import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import EventCard from './EventCard';
import EventCarousel from './EventCarousel';

interface Event {
  id: string;
  title: string;
  description: string;
  registerUrl: string;
  dateRange: string;
  image: string | null;
  status: 'upcoming' | 'finished';
  eventType: string;
  participants: number;
  isPartner?: boolean;
}

export default function EventsContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEventbriteEvents() {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching Eventbrite events:', error);
        throw error;
      }
    }

    async function fetchPartnerEvents() {
        try {
          console.log('Iniciando fetchPartnerEvents');
          const response = await fetch('/api/partner-events', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log('Resposta recebida:', response.status, response.statusText);
          
          if (!response.ok) {
            const errorBody = await response.text();
            console.error('Corpo da resposta de erro:', errorBody);
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
          }
          
          const data = await response.json();
          console.log('Dados recebidos:', data);
          
          return data.map((event: any) => ({
            id: event.id.toString(),
            title: event.title,
            description: event.description || '',
            registerUrl: event.url,
            dateRange: new Date(event.date).toLocaleDateString(),
            image: event.image_url,
            status: new Date(event.date) > new Date() ? 'upcoming' : 'finished',
            eventType: 'Partner Event',
            participants: 0,
            isPartner: true
          }));
        } catch (error) {
          console.error('Erro detalhado ao buscar eventos de parceiros:', error);
          throw error;
        }
      }

      async function fetchAllEvents() {
        setIsLoading(true);
        try {
          const [eventbriteEvents, partnerEvents] = await Promise.all([
            fetchEventbriteEvents().catch(error => {
              console.error('Erro ao buscar eventos do Eventbrite:', error);
              return [];
            }),
            fetchPartnerEvents().catch(error => {
              console.error('Erro ao buscar eventos de parceiros:', error);
              return [];
            })
          ]);
          
          setEvents([...eventbriteEvents, ...partnerEvents]);
          setError(null);
        } catch (error) {
          console.error('Erro ao buscar todos os eventos:', error);
          setError('Falha ao carregar alguns eventos. Por favor, tente novamente mais tarde.');
        } finally {
          setIsLoading(false);
        }
      }

    fetchAllEvents();
  }, []);

  const upcomingEvents = events.filter(event => event.status === 'upcoming' && !event.isPartner);
  const pastEvents = events.filter(event => event.status === 'finished' && !event.isPartner);
  const partnerEvents = events.filter(event => event.isPartner);

  return (
    <div className="space-y-12">
      <header className="bg-gray-100 dark:bg-black py-12 rounded-lg">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Discover Upcoming Events in Our Startup Community
          </h1>
          <p className="mt-4 text-gray-500 md:text-xl dark:text-gray-400 max-w-2xl mx-auto">
            Explore a diverse range of events, workshops, and meetups tailored to support and connect entrepreneurs,
            developers, and innovators in our vibrant startup community.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6">
        <section>
          <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
          {isLoading ? (
            <p>Loading events...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <EventCarousel events={upcomingEvents} />
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Past Events</h2>
          {isLoading ? (
            <p>Loading events...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <EventCarousel events={pastEvents} />
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Partner Events</h2>
          {isLoading ? (
            <p>Loading events...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <EventCarousel events={partnerEvents} />
          )}
        </section>
      </main>
    </div>
  );
}