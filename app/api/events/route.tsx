import { NextRequest, NextResponse } from 'next/server';

interface EventbriteEvent {
  id: string;
  name: { text: string };
  description: { text: string };
  url: string;
  start: { utc: string };
  end: { utc: string };
  logo: { url: string } | null;
  status: string;
}

interface FormattedEvent {
  id: string;
  title: string;
  description: string;
  registerUrl: string;
  date: string;
  image: string | null;
  status: 'upcoming' | 'finished';
}

async function getOrganizationId(token: string): Promise<string> {
  const url = "https://www.eventbriteapi.com/v3/users/me/organizations/";
  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch organization ID: ${response.status}`);
  }

  const data = await response.json();
  return data.organizations[0].id;
}

export async function GET(request: NextRequest) {
  console.log('GET request received at /api/events');
  
  const EVENTBRITE_API_KEY = process.env.EVENTBRITE_API_KEY;

  if (!EVENTBRITE_API_KEY) {
    console.error('Eventbrite API key is missing');
    return NextResponse.json({ error: 'Eventbrite API key is missing' }, { status: 500 });
  }

  try {
    const organizationId = await getOrganizationId(EVENTBRITE_API_KEY);
    console.log('Organization ID:', organizationId);

    const url = `https://www.eventbriteapi.com/v3/organizations/${organizationId}/events/?expand=logo&status=all`;
    console.log('Fetching events from URL:', url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${EVENTBRITE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Eventbrite API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Raw Eventbrite response:', JSON.stringify(data, null, 2));

    const currentDate = new Date();
    let pastEventsCount = 0;

    const events: FormattedEvent[] = data.events
      .map((event: EventbriteEvent) => {
        const startDate = new Date(event.start.utc);
        const endDate = new Date(event.end.utc);
        const isPast = endDate < currentDate;

        if (isPast && pastEventsCount >= 4) {
          return null;
        }

        if (isPast) {
          pastEventsCount++;
        }

        return {
          id: event.id,
          title: event.name.text,
          description: event.description.text,
          registerUrl: event.url,
          date: startDate.toLocaleDateString(),
          image: event.logo?.url || null,
          status: isPast ? 'finished' : 'upcoming',
        };
      })
      .filter((event: FormattedEvent | null): event is FormattedEvent => event !== null);

    return NextResponse.json(events);
  } catch (error: unknown) {
    console.error('Error fetching events from Eventbrite:', error);
    
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: 'Error fetching events', details: errorMessage }, { status: 500 });
  }
}