import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from 'lucide-react';

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

function EventCard({ event }: { event: Event }) {
  return (
    <Card className="w-72 h-96 flex flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="relative h-48">
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {event.status === 'finished' && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold py-1 px-2 rounded-full">
            Finished
          </div>
        )}
      </div>
      <CardContent className="flex-grow flex flex-col justify-between p-4">
        <div>
          <h3 className="text-xl font-semibold line-clamp-2 mb-2">{event.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-3">{event.description}</p>
        </div>
        <div className="mt-4">
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span className="flex items-center"><Calendar size={16} className="mr-1" />{event.dateRange}</span>
          </div>
          <Button
            variant={event.status === 'upcoming' ? "default" : "secondary"}
            className="w-full"
            onClick={() => window.open(event.registerUrl, '_blank')}
          >
            {event.status === 'upcoming' ? 'Enroll Now' : 'View Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default EventCard;