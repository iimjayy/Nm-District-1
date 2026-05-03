import React from 'react';
import { motion } from 'framer-motion';
import { cardHover, buttonTap } from '../utils/motion';
import type { EventItem } from '../types';

interface EventCardProps {
  event: EventItem;
  onSelect?: () => void;
  variant?: 'default' | 'skeleton';
}

const categoryColors: Record<string, string> = {
  Music: 'bg-purple-500/20 text-purple-300',
  Sports: 'bg-blue-500/20 text-blue-300',
  Workshop: 'bg-amber-500/20 text-amber-300',
  Fest: 'bg-pink-500/20 text-pink-300',
  Cultural: 'bg-indigo-500/20 text-indigo-300',
  Networking: 'bg-cyan-500/20 text-cyan-300',
};

export default function EventCard({ event, onSelect, variant = 'default' }: EventCardProps) {
  if (variant === 'skeleton') {
    return (
      <motion.div className="rounded-xl overflow-hidden bg-slate-800 h-80 animate-pulse" />
    );
  }

  return (
    <motion.article
      {...cardHover}
      className="group rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-lg"
    >
      <div className="relative aspect-video overflow-hidden">
        <motion.img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/60" />

        <div className="absolute top-3 left-3 flex gap-2">
          <motion.span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors[event.category] || 'bg-slate-700/50 text-slate-300'}`}>
            {event.category}
          </motion.span>
        </div>

        <motion.button
          {...buttonTap}
          onClick={onSelect}
          className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 backdrop-blur p-2 rounded-full transition-colors"
        >
          <Heart saved={event.saved} />
        </motion.button>
      </div>

      <div className="p-4 relative z-10">
        <h3 className="font-bold text-lg leading-tight mb-2">{event.name}</h3>
        <div className="space-y-1 text-sm text-slate-400 mb-3">
          <div>📅 {event.dateLabel} at {event.startsAt}</div>
          <div>📍 {event.venue}</div>
          <div className="text-emerald-400">Only {event.seatsLeft} seats left</div>
        </div>

        <motion.button
          {...buttonTap}
          onClick={onSelect}
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          Book Now →
        </motion.button>
      </div>
    </motion.article>
  );
}

function Heart({ saved }: { saved: boolean }) {
  return (
    <motion.svg
      className={`w-5 h-5 ${saved ? 'fill-red-400 text-red-400' : 'text-slate-400'}`}
      viewBox="0 0 24 24"
      animate={{
        scale: saved ? [1, 1.2, 1] : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
      }}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </motion.svg>
  );
}
