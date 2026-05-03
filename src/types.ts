export type EventCategory = 'Music' | 'Sports' | 'Workshop' | 'Fest' | 'Cultural' | 'Networking';

export type Tone = 'violet' | 'blue' | 'amber' | 'rose' | 'emerald' | 'gold';

export interface PassTier {
  id: string;
  name: string;
  price: number;
  seats: number;
  perks: string[];
  tone: Tone;
  featured?: boolean;
}

export interface EventItem {
  id: string;
  name: string;
  category: EventCategory;
  venue: string;
  dateLabel: string;
  startsAt: string;
  image: string;
  summary: string;
  seatsLeft: number;
  attendees: number;
  price: number;
  saved: boolean;
  tags: string[];
  gallery: string[];
  attendeeAvatars: string[];
  tiers: PassTier[];
}

export interface ClubItem {
  id: string;
  name: string;
  category: EventCategory;
  tagline: string;
  members: string;
  events: string;
  image: string;
  logo: string;
  venue: string;
}

export interface VenueItem {
  id: string;
  name: string;
  category: 'Venue';
  description: string;
  image: string;
  address: string;
  icon: string;
}

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  tone: 'neutral' | 'success' | 'warning';
}

export interface TicketDetails {
  eventId: string;
  eventName: string;
  venue: string;
  dateLabel: string;
  tier: string;
  bookingId: string;
  price: number;
  image: string;
}
