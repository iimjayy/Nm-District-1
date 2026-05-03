import React from 'react';
import { motion } from 'framer-motion';
import EventCard from '../components/EventCard';
import { events } from '../data';
import { staggerContainer, fadeInUp, buttonTap } from '../utils/motion';

interface HomePageProps {
  onNavigate: (page: 'explore' | 'event-detail', id?: string) => void;
  onStartBooking: (eventId: string) => void;
}

export default function HomePage({ onNavigate, onStartBooking }: HomePageProps) {
  const liveEventsCount = events.filter((e) => e.tags?.includes('Tonight')).length;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center overflow-hidden">
        {/* Floating particles */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-purple-600/10 to-blue-600/10 blur-3xl"
            animate={{
              x: Math.sin(i) * 100,
              y: Math.cos(i) * 100,
              opacity: [0.08, 0.15, 0.08],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              left: `${20 + i * 8}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
          />
        ))}

        {/* Live badge */}
        <motion.div
          className="absolute top-24 right-12 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-red-500"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-sm font-semibold text-slate-300">● {liveEventsCount} events today</span>
        </motion.div>

        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <motion.h1
            {...fadeInUp}
            className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Every Campus Moment,<br />One Place.
          </motion.h1>

          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-md mx-auto mb-8"
          >
            Discover clubs, events, and concerts happening around NM College. Never miss a moment.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.button
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              {...buttonTap}
              onClick={() => onNavigate('explore')}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded-lg font-bold text-white transition-all shadow-lg hover:shadow-purple-500/50"
            >
              Explore Events
            </motion.button>

            <motion.button
              {...fadeInUp}
              transition={{ delay: 0.3 }}
              {...buttonTap}
              onClick={() => onNavigate('explore')}
              className="px-8 py-3 border border-slate-700 hover:border-slate-600 rounded-lg font-bold text-white transition-colors hover:bg-slate-800/50"
            >
              View My Passes
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-12"
          >
            Featured This Week
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {events.slice(0, 6).map((event, idx) => (
              <motion.div
                key={event.id}
                {...fadeInUp}
                transition={{ delay: idx * 0.08 }}
              >
                <EventCard
                  event={event}
                  onSelect={() => onStartBooking(event.id)}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            {...buttonTap}
            onClick={() => onNavigate('explore')}
            className="mt-12 mx-auto block px-8 py-3 border border-purple-600 hover:bg-purple-600/10 rounded-lg font-bold text-white transition-colors"
          >
            View All Events →
          </motion.button>
        </div>
      </section>
    </div>
  );
}
