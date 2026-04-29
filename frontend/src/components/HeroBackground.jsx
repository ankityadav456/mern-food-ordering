import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

export function HeroBackground() {
  const { dark } = useTheme();

  const particles = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 12,
      size: 1 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <>
      {/* Base gradient background */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          dark
            ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-br from-orange-50 via-amber-50 to-white'
        }`}
      />

      {/* Animated primary orb */}
      <motion.div
        className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-orb-1 animate-orb-pulse ${
          dark ? 'bg-orange-500/20' : 'bg-orange-400/15'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Animated secondary orb */}
      <motion.div
        className={`absolute top-1/3 right-10 w-80 h-80 rounded-full blur-3xl animate-orb-2 animate-orb-pulse ${
          dark ? 'bg-amber-500/15' : 'bg-yellow-400/12'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />

      {/* Animated tertiary orb */}
      <motion.div
        className={`absolute -bottom-32 left-1/2 w-96 h-96 rounded-full blur-3xl animate-orb-3 animate-orb-pulse ${
          dark ? 'bg-orange-500/10' : 'bg-orange-300/8'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      />

      {/* Mesh gradient overlay */}
      <div
        className={`absolute inset-0 animate-gradient-shift pointer-events-none ${
          dark ? 'opacity-30' : 'opacity-20'
        }`}
        style={{
          background: dark
            ? `radial-gradient(ellipse at 20% 40%, rgba(251,146,60,0.15) 0%, transparent 50%),
               radial-gradient(ellipse at 80% 25%, rgba(251,191,36,0.1) 0%, transparent 50%),
               radial-gradient(ellipse at 50% 75%, rgba(249,115,22,0.08) 0%, transparent 60%)`
            : `radial-gradient(ellipse at 20% 40%, rgba(251,146,60,0.12) 0%, transparent 50%),
               radial-gradient(ellipse at 80% 25%, rgba(251,191,36,0.08) 0%, transparent 50%),
               radial-gradient(ellipse at 50% 75%, rgba(249,115,22,0.06) 0%, transparent 60%)`,
          backgroundSize: '200% 200%',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute rounded-full ${dark ? 'bg-orange-400/50' : 'bg-orange-500/40'}`}
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.left}%`,
              bottom: '-10px',
              opacity: particle.opacity,
              animation: `particle-float-up ${particle.duration}s linear ${particle.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Static blur elements for depth */}
      <div
        className={`absolute top-1/2 left-1/3 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
          dark ? 'bg-orange-500/8' : 'bg-orange-400/5'
        }`}
        style={{
          animation: 'float 6s ease-in-out infinite',
        }}
      />

      <div
        className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          dark ? 'bg-amber-500/6' : 'bg-yellow-400/4'
        }`}
        style={{
          animation: 'float 8s ease-in-out infinite 1s',
        }}
      />

      {/* Grid overlay */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          dark ? 'opacity-5' : 'opacity-3'
        }`}
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent calc(100% - 1px), ${
              dark ? 'rgba(255,255,255,0.05)' : 'rgba(249,115,22,0.08)'
            } calc(100% - 1px)),
            linear-gradient(90deg, transparent calc(100% - 1px), ${
              dark ? 'rgba(255,255,255,0.05)' : 'rgba(249,115,22,0.08)'
            } calc(100% - 1px))
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Light streaks */}
      <div
        className={`absolute top-0 left-1/3 w-1 h-full pointer-events-none blur-2xl ${
          dark ? 'bg-gradient-to-b from-orange-500/20 via-orange-500/5 to-orange-500/0' : 'bg-gradient-to-b from-orange-400/15 via-orange-400/3 to-orange-400/0'
        }`}
      />

      <div
        className={`absolute top-0 right-1/4 w-1 h-full pointer-events-none blur-2xl ${
          dark ? 'bg-gradient-to-b from-amber-500/15 via-amber-500/3 to-amber-500/0' : 'bg-gradient-to-b from-yellow-400/10 via-yellow-400/2 to-yellow-400/0'
        }`}
        style={{
          animation: 'light-flicker 4s ease-in-out infinite 0.5s',
        }}
      />
    </>
  );
}
