'use client';

import { motion, HTMLMotionProps } from 'framer-motion';

interface FadeInProps extends HTMLMotionProps<'div'> {
  delay?: number;
  duration?: number;
  yOffset?: number;
  children: React.ReactNode;
}

export default function FadeIn({ delay = 0, duration = 0.5, yOffset = 16, children, ...props }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
