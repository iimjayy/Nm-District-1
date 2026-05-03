import React from 'react';
import { motion } from 'framer-motion';
import { events } from '../data';
import { fadeInUp, staggerContainer, buttonTap } from '../utils/motion';

interface EventDetailPageProps {
  eventId: string;
  onNavigate: (page: string) => void;
  onStartBooking: (eventId: string) => void;
}

export default function EventDetailPage({ eventId, onNavigate, onStartBooking }: EventDetailPageProps) {
  const event = events.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero with parallax */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <motion.img
          src={event.image}
          alt={event.name}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1 }}
          whileInView={{ scale: 1.02 }}
          transition={{ duration: 1 }}
          viewport={{ once: false }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

        <div className="relative z-10 w-full p-8 max-w-6xl mx-auto">
          <motion.h1
            {...fadeInUp}
            className="text-5xl font-bold mb-4 leading-tight"
          >
            {event.name}
          </motion.h1>
          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-300 max-w-2xl mb-6"
          >
            {event.summary}
          </motion.p>
        </div>
      </section>

      {/* Social proof */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-8 px-6 border-b border-slate-800 bg-slate-900/50"
      >
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="flex -space-x-3">
            {event.attendeeAvatars?.slice(0, 5).map((avatar, idx) => (
              <motion.img
                key={idx}
                src={avatar}
                alt="Attendee"
                className="w-10 h-10 rounded-full border-2 border-slate-900"
                whileHover={{ scale: 1.1 }}
              />
            ))}
          </div>
          <div>
            <p className="font-semibold">
              {event.attendees} {event.attendees === 1 ? 'student' : 'students'} from NM College are attending
            </p>
            <button {...buttonTap} className="text-purple-400 hover:text-purple-300 text-sm mt-1">
              Join them →
            </button>
          </div>
        </div>
      </motion.section>

      {/* Content */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Details */}
              <motion.div
                {...fadeInUp}
                className="space-y-4"
              >
                <h2 className="text-3xl font-bold">Event Details</h2>
                <div className="space-y-3 text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <div className="font-semibold">{event.dateLabel}</div>
                      <div className="text-sm text-slate-400">{event.startsAt}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <div className="font-semibold">{event.venue}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💳</span>
                    <div className="font-bold text-lg">₹{event.price}</div>
                  </div>
                </div>
              </motion.div>

              {/* Gallery */}
              {event.gallery && event.gallery.length > 0 && (
                <motion.div
                  {...fadeInUp}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-3xl font-bold mb-6">Gallery</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {event.gallery.map((img, idx) => (
                      <motion.img
                        key={idx}
                        src={img}
                        alt={`Gallery ${idx}`}
                        className="rounded-lg aspect-square object-cover"
                        whileHover={{ scale: 1.05 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Booking sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-4 sticky top-6"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-slate-400">Seats available</div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden"
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-500 to-red-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(event.seatsLeft / 100) * 100}%` }}
                        transition={{ duration: 1 }}
                      />
                    </motion.div>
                    <span className="text-sm font-semibold text-amber-400">{event.seatsLeft} left</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700 space-y-3">
                  {event.tiers?.map((tier, idx) => (
                    <motion.button
                      key={tier.id}
                      {...buttonTap}
                      onClick={() => onStartBooking(event.id)}
                      whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(168, 85, 247, 0.2)' }}
                      className={`w-full p-4 rounded-lg text-left border transition-all ${
                        tier.featured
                          ? 'border-purple-500/50 bg-purple-600/20'
                          : 'border-slate-700 bg-slate-800/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold">{tier.name}</div>
                          <div className="text-xs text-slate-400">₹{tier.price}</div>
                        </div>
                        {tier.featured && (
                          <span className="text-xs px-2 py-1 bg-purple-600 rounded-full">Popular</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 space-y-1">
                        {tier.perks?.map((perk, i) => (
                          <div key={i}>✓ {perk}</div>
                        ))}
                      </div>
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  {...buttonTap}
                  onClick={() => onStartBooking(event.id)}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold transition-colors mt-4"
                >
                  Book Now
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
