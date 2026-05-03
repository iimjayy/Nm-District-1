import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import EventCard from '../components/EventCard';
import { events } from '../data';
import { staggerContainer, fadeInUp, buttonTap } from '../utils/motion';

interface ExplorePageProps {
  onNavigate: (page: string) => void;
  onStartBooking: (eventId: string) => void;
}

const filters = ['All', 'Today', 'This Week', 'Free', 'Music', 'Sports', 'Cultural', 'Workshops'];

export default function ExplorePage({ onNavigate, onStartBooking }: ExplorePageProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = event.name.toLowerCase().includes(query) || event.category.toLowerCase().includes(query);
      const matchesFilter =
        activeFilter === 'All' ||
        event.category === activeFilter ||
        event.tags?.includes(activeFilter);
      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="py-12 px-6 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-2">
            Discover Events
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-slate-400 mb-6">
            Find the perfect event to attend
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2"
          >
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg outline-none focus:border-purple-600 transition-colors"
            />
          </motion.div>
        </div>
      </section>

      {/* Filter chips */}
      <section className="sticky top-0 z-40 py-4 px-6 bg-slate-950/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <motion.button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                  activeFilter === filter
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {filter}
              </motion.button>
            ))}
            <motion.button
              onClick={() => setShowAdvanced(!showAdvanced)}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-full font-semibold whitespace-nowrap bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              {showAdvanced ? 'Hide' : 'More'} ↓
            </motion.button>
          </div>

          {/* Advanced filters */}
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <input type="date" className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg outline-none" placeholder="Start date" />
              <input type="date" className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg outline-none" placeholder="End date" />
              <select className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg outline-none">
                <option>All Venues</option>
                <option>Auditorium</option>
                <option>Quadrangle</option>
              </select>
            </motion.div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-400 mb-6"
          >
            Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {filteredEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                {...fadeInUp}
                transition={{ delay: (idx % 6) * 0.06 }}
              >
                <EventCard event={event} onSelect={() => onStartBooking(event.id)} />
              </motion.div>
            ))}
          </motion.div>

          {filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-slate-400 text-lg">No events found. Try a different search.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
