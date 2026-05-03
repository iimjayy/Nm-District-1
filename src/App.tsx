import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { events, clubs, venues } from './data';
import CommandPalette from './components/CommandPalette';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import EventDetailPage from './pages/EventDetailPage';
import BookingPage from './pages/BookingPage';
import TicketCard from './components/TicketCard';
import Toast from './components/Toast';

type Page = 'home' | 'explore' | 'event-detail' | 'booking' | 'ticket';

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [commandOpen, setCommandOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [bookingState, setBookingState] = useState<{ eventId: string; step: number; selectedTier?: string } | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'info' | 'error' }>>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
      if (e.key === 'Escape') {
        setCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandOpen]);

  const handleNavigation = (page: Page, eventId?: string) => {
    if (page === 'event-detail' && eventId) {
      setSelectedEvent(eventId);
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleStartBooking = (eventId: string) => {
    setBookingState({ eventId, step: 1 });
    setCurrentPage('booking');
  };

  const handleBookingNext = (selectedTier?: string) => {
    setBookingState((prev) => prev ? { ...prev, step: prev.step + 1, selectedTier } : null);
  };

  const handleBookingComplete = () => {
    addToast('✓ Booking successful!', 'success');
    setCurrentPage('ticket');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <HomePage onNavigate={handleNavigation} onStartBooking={handleStartBooking} />
          </motion.div>
        )}

        {currentPage === 'explore' && (
          <motion.div key="explore" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <ExplorePage onNavigate={handleNavigation} onStartBooking={handleStartBooking} />
          </motion.div>
        )}

        {currentPage === 'event-detail' && selectedEvent && (
          <motion.div key="event-detail" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <EventDetailPage eventId={selectedEvent} onNavigate={handleNavigation} onStartBooking={handleStartBooking} />
          </motion.div>
        )}

        {currentPage === 'booking' && bookingState && (
          <motion.div key="booking" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <BookingPage eventId={bookingState.eventId} initialStep={bookingState.step} onNext={handleBookingNext} onComplete={handleBookingComplete} onNavigate={handleNavigation} />
          </motion.div>
        )}

        {currentPage === 'ticket' && bookingState && (
          <motion.div key="ticket" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="min-h-screen flex items-center justify-center p-4">
            <TicketCard eventId={bookingState.eventId} tier={bookingState.selectedTier || 'general'} onClose={() => handleNavigation('home')} />
          </motion.div>
        )}
      </AnimatePresence>

      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} onNavigate={handleNavigation} events={events} clubs={clubs} venues={venues} />

      <div className="fixed bottom-6 right-6 space-y-2 z-50">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} message={toast.message} type={toast.type} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
