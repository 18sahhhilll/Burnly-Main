import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * TopProgressBar
 * 
 * High-precision, zero-jank top progress bar resembling GitHub/Vercel.
 * Triggers automatically on React Router route changes.
 * Features a fintech electric gradient (Blue -> Indigo -> Emerald glow).
 */
export const TopProgressBar = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPathRef = useRef(location.pathname);
  const timersRef = useRef([]);

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    // Only animate if the path actually changed
    if (prevPathRef.current === location.pathname) {
      return;
    }
    prevPathRef.current = location.pathname;

    clearAllTimers();

    // Start progress bar
    setVisible(true);
    setProgress(15);

    const t1 = setTimeout(() => {
      setProgress(65);
    }, 80);

    const t2 = setTimeout(() => {
      setProgress(90);
    }, 200);

    const t3 = setTimeout(() => {
      setProgress(100);
    }, 320);

    const t4 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 550);

    timersRef.current = [t1, t2, t3, t4];

    return () => {
      clearAllTimers();
    };
  }, [location.pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[99999] pointer-events-none overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-200 ease-out shadow-[0_0_12px_rgba(59,130,246,0.9),0_0_6px_rgba(16,185,129,0.7)]"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          transition: progress === 100 ? 'width 150ms ease-out, opacity 250ms ease-out' : 'width 180ms cubic-bezier(0.2, 0.8, 0.4, 1)',
        }}
      />
    </div>
  );
};
