import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EventItem, ClubItem, VenueItem } from '../types';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: 'explore' | 'event-detail', id?: string) => void;
  events: EventItem[];
  clubs: ClubItem[];
  venues: VenueItem[];
}

export default function CommandPalette({ open, onClose, onNavigate, events, clubs, venues }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const eventResults = events.filter((e) => e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)).slice(0, 3);
    const clubResults = clubs.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 2);
    const venueResults = venues.filter((v) => v.name.toLowerCase().includes(q)).slice(0, 2);
    return [...eventResults.map((e) => ({ type: 'event' as const, data: e })), ...clubResults.map((c) => ({ type: 'club' as const, data: c })), ...venueResults.map((v) => ({ type: 'venue' as const, data: v }))];
  }, [query, events, clubs, venues]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setSelectedIndex(0);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      const result = results[selectedIndex];
      if (result.type === 'event') {
        onNavigate('event-detail', result.data.id);
      }
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/40 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.15, type: 'spring', stiffness: 300 }} className="w-full max-w-xl bg-slate-900 rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-700">
              <input ref={inputRef} value={query} onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }} onKeyDown={handleKeyDown} placeholder="Search events, clubs, venues..." className="w-full bg-transparent text-lg outline-none placeholder-slate-500" />
            </div>
            <div className="max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No results found</div>
              ) : (
                results.map((result, idx) => (
                  <motion.button key={`${result.type}-${result.data.id}`} onClick={() => { if (result.type === 'event') { onNavigate('event-detail', result.data.id); } onClose(); }} className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${idx === selectedIndex ? 'bg-purple-600/20' : 'hover:bg-slate-800'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}>
                    <span className="text-2xl">
                      {result.type === 'event' ? '📅' : result.type === 'club' ? '🏢' : '🏛️'}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium">{result.data.name}</div>
                      <div className="text-xs text-slate-400">{result.type === 'event' ? (result.data as EventItem).category : result.type}</div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-slate-700 rounded-full text-slate-300">{result.type}</span>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
