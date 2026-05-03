import React from 'react';
import { motion } from 'framer-motion';

interface ToastProps {
  message: string;
  type: 'success' | 'info' | 'error';
}

export default function Toast({ message, type }: ToastProps) {
  const colors = {
    success: 'bg-emerald-900/80 text-emerald-100',
    info: 'bg-blue-900/80 text-blue-100',
    error: 'bg-red-900/80 text-red-100',
  };

  const icons = {
    success: '✓',
    info: 'ℹ',
    error: '✕',
  };

  return (
    <motion.div
      initial={{ x: 384, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 384, opacity: 0 }}
      transition={{ duration: 0.25, type: 'spring', stiffness: 200 }}
      className={`${colors[type]} px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg`}
    >
      <span className="font-bold">{icons[type]}</span>
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  );
}
