import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import { events } from '../data';

interface TicketCardProps {
  eventId: string;
  tier: string;
  onClose: () => void;
}

export default function TicketCard({ eventId, tier, onClose }: TicketCardProps) {
  const event = events.find((e) => e.id === eventId);
  const qrRef = useRef<HTMLDivElement>(null);
  const bookingId = `NM${Date.now().toString().slice(-8).toUpperCase()}`;

  if (!event) return null;

  const tierData = event.tiers?.find((t) => t.id === tier);

  const handleDownload = async () => {
    if (!qrRef.current) return;
    const canvas = await html2canvas(qrRef.current);
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = `${event.name}-ticket.png`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${event.name} - NM District`,
        text: `I just booked ${event.name}! Join me on NM District.`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <motion.div
        ref={qrRef}
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="aspect-[9/16] bg-gradient-to-br from-purple-900 to-slate-900 rounded-2xl shadow-2xl p-6 flex flex-col justify-between relative overflow-hidden"
        style={{ perspective: '1200px' }}
      >
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-purple-600/20 to-transparent" />
        <div className="relative z-10">
          <div className="text-xs font-bold text-purple-300 mb-2">NM DISTRICT</div>
          <div className="text-sm text-slate-300">Your Pass</div>
        </div>

        <div className="relative z-10 text-center">
          <h2 className="text-2xl font-bold mb-2 leading-tight">{event.name}</h2>
          <div className="text-sm text-slate-300 space-y-1">
            <div>{event.dateLabel}</div>
            <div>{event.venue}</div>
            <div className="pt-2 text-purple-300 font-semibold">{tierData?.name || 'General'} Access</div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="bg-white p-2 rounded-lg">
            <QRCode value={bookingId} size={120} level="H" includeMargin={false} />
          </div>
          <div className="text-center text-xs text-slate-400">
            <div className="font-mono font-bold text-slate-300">{bookingId}</div>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 flex gap-3">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleDownload}
          className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-colors"
        >
          ↓ Download
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleShare}
          className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
        >
          ⤴ Share
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onClose}
          className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-colors"
        >
          ← Done
        </motion.button>
      </div>
    </div>
  );
}
