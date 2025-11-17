import React, { useContext } from 'react';
import { Box } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import StorySlider from '../components/StorySlider';

export default function Home() {
  const { user } = useContext(AppContext);

  return (
    <Box sx={{ overflow: 'hidden', minHeight: '100vh' }}>
      <AnimatePresence mode="wait">
          <Box key="content">
            <Hero />
            <StorySlider />
          </Box>
      </AnimatePresence>
    </Box>
  );
}

