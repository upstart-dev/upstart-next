import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import EventCard from './EventCard';

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

function EventCarousel({ events }: { events: Event[] }) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
  
    useEffect(() => {
      const checkArrows = () => {
        if (carouselRef.current) {
          setShowLeftArrow(carouselRef.current.scrollLeft > 0);
          setShowRightArrow(
            carouselRef.current.scrollLeft < 
            carouselRef.current.scrollWidth - carouselRef.current.clientWidth
          );
        }
      };
  
      checkArrows();
      window.addEventListener('resize', checkArrows);
      return () => window.removeEventListener('resize', checkArrows);
    }, [events]);
  
    const scroll = (direction: 'left' | 'right') => {
      if (carouselRef.current) {
        const scrollAmount = direction === 'left' ? -300 : 300; // Ajustado para o novo tamanho do card
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };
  
    return (
      <div className="relative">
        {showLeftArrow && (
          <Button 
            variant="outline" 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
            onClick={() => scroll('left')}
          >
            <ChevronLeft />
          </Button>
        )}
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto space-x-6 pb-6 scrollbar-hide" // Aumentado o espaço entre os cards
          onScroll={() => {
            if (carouselRef.current) {
              setShowLeftArrow(carouselRef.current.scrollLeft > 0);
              setShowRightArrow(
                carouselRef.current.scrollLeft < 
                carouselRef.current.scrollWidth - carouselRef.current.clientWidth
              );
            }
          }}
        >
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        {showRightArrow && (
          <Button 
            variant="outline" 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
            onClick={() => scroll('right')}
          >
            <ChevronRight />
          </Button>
        )}
      </div>
    );
  }

  export default EventCarousel;