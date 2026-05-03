import { clubs, events, venues } from './data';

export type SearchKind = 'event' | 'club' | 'venue';

export interface SearchResult {
  id: string;
  kind: SearchKind;
  name: string;
  category: string;
  subtitle: string;
  route: string;
}

const normalize = (value: string) => value.toLowerCase().trim();

const scoreMatch = (query: string, haystack: string[]) => {
  const term = normalize(query);
  if (!term) return 0;

  return haystack.reduce((score, value) => {
    const candidate = normalize(value);
    if (candidate === term) return score + 8;
    if (candidate.startsWith(term)) return score + 5;
    if (candidate.includes(term)) return score + 2;
    return score;
  }, 0);
};

export const findEventById = (eventId: string) => events.find((event) => event.id === eventId) ?? events[0];

export const findClubById = (clubId: string) => clubs.find((club) => club.id === clubId) ?? clubs[0];

export const findVenueById = (venueId: string) => venues.find((venue) => venue.id === venueId) ?? venues[0];

export const searchCatalog = (query: string): SearchResult[] => {
  const term = normalize(query);

  const eventResults = events
    .map((event) => ({
      item: event,
      score: scoreMatch(term, [event.name, event.category, event.venue, event.summary, ...event.tags]),
    }))
    .filter(({ score }) => score > 0)
    .map(({ item }) => ({
      id: item.id,
      kind: 'event' as const,
      name: item.name,
      category: item.category,
      subtitle: `${item.dateLabel} · ${item.venue}`,
      route: `/events/${item.id}`,
    }));

  const clubResults = clubs
    .map((club) => ({
      item: club,
      score: scoreMatch(term, [club.name, club.category, club.tagline, club.venue, club.members, club.events]),
    }))
    .filter(({ score }) => score > 0)
    .map(({ item }) => ({
      id: item.id,
      kind: 'club' as const,
      name: item.name,
      category: item.category,
      subtitle: `${item.members} · ${item.venue}`,
      route: `/clubs?club=${item.id}`,
    }));

  const venueResults = venues
    .map((venue) => ({
      item: venue,
      score: scoreMatch(term, [venue.name, venue.description, venue.address]),
    }))
    .filter(({ score }) => score > 0)
    .map(({ item }) => ({
      id: item.id,
      kind: 'venue' as const,
      name: item.name,
      category: item.category,
      subtitle: item.address,
      route: `/explore?venue=${item.id}`,
    }));

  return [...eventResults, ...clubResults, ...venueResults].slice(0, 12);
};
