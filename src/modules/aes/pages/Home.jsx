/**
 * Home.jsx — Elegant Home Page with Framer Motion
 * Author: Imam Rizki Saputra (NIM 301230013)
 */

import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import FeatureCards from '../components/home/FeatureCards';

export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background"
    >
      <HeroSection />
      <FeatureCards />
    </motion.div>
  );
}
