import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Box, Typography, IconButton, Button, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

// importa as imagens do bundle (JS, sem TS)
import img1 from '../assets/images/IMG1.jpg';
import img2 from '../assets/images/IMG2.jpg';
import img3 from '../assets/images/IMG3.jpg';
import img4 from '../assets/images/IMG4.jpg';

const STORY_SLIDES = [
  {
    id: 0,
    image: img1,
    date: '31.12.2022 — Setúbal',
    meta:
      'Foi em uma reunião no dia 31 de Dezembro de 2022, em Setúbal, que nos vimos pela primeira vez, ' +
      'sentimos uma sensação diferente, fomos nos conhecendo, houve algumas saídas de amigos, dava pra ver que havia alguma química, ' +
      'mas permanecemos amigos, até que!',
  },
  {
    id: 1,
    image: img2,
    date: '21.07.2024 — Tróia',
    meta:
      'No dia 21.07.2024 começou oficialmente a nossa história de amor… Foi em Tróia, no auge do verão Europeu, ' +
      'que a Carolina recebeu o seu pedido oficial de Namoro, e disse “sim”, foi um momento lindo e único para o casal de namorados.',
  },
  {
    id: 2,
    image: img3,
    date: '21.09.2025 — Paris',
    meta:
      'Fizemos uma viagem inesquecível para Paris onde a Carolina no dia 21.09.2025 disse “sim”, para o seu pedido de casamento, ' +
      'em um cenário super romântico, em Paris, na cidade do amor, com a vista mais linda, a torre Eiffel, ' +
      'um dos maiores símbolos de amor e puro romantismo.',
  },
  {
    id: 3,
    image: img4,
    date: '21.06.2026 — O grande dia',
    meta:
      'E agora esperamos ansiosamente pelo próximo passo, o momento mais esperado, que temos construído até agora, ' +
      'o nosso casamento, no dia 21.06.2026, será um prazer ter-te connosco nesta ocasião, que iremos eternizar a nossa verdadeira história de amor.',
  },
];

export default function StorySlider() {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: false });

  useEffect(() => {
    if (!isAutoPlay || !inView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % STORY_SLIDES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlay, inView]);

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + STORY_SLIDES.length) % STORY_SLIDES.length);
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % STORY_SLIDES.length);
  };

  const handleDotClick = (index) => {
    setIsAutoPlay(false);
    setCurrentIndex(index);
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
  };

  const imageVariants = {
    initial: { scale: 1.04 },
    active: {
      scale: 1,
      transition: { duration: 1, ease: 'easeOut' },
    },
  };

  const MotionBox = motion(Box);

  return (
    <Box
      ref={containerRef}
      sx={{
        py: 12,
        backgroundColor: theme.palette.background.default,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="h3"
        sx={{
          textAlign: 'center',
          mb: 6,
          fontFamily: 'Playfair Display, serif',
          color: theme.palette.text.primary,
        }}
      >
        Nossa História
      </Typography>

      <Box
        sx={{
          position: 'relative',
          maxWidth: '1200px',
          mx: 'auto',
          px: 4,
        }}
      >
        <AnimatePresence mode="wait">
          <MotionBox
            key={currentIndex}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
              gap: 4,
              alignItems: 'center',
            }}
          >
            <MotionBox
              variants={imageVariants}
              initial="initial"
              animate="active"
              sx={{
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(32,44,50,.12)',
                minHeight: { xs: 260, md: 360 },
              }}
            >
              <img
                src={STORY_SLIDES[currentIndex].image}
                alt={STORY_SLIDES[currentIndex].date}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </MotionBox>

            <Box
              sx={{
                color: theme.palette.custom?.brand600 || theme.palette.text.secondary,
                fontSize: '.9rem',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 'bold',
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  mb: 1,
                  fontSize: '.8rem',
                  color: theme.palette.custom?.brand500 || theme.palette.text.secondary,
                }}
              >
                {STORY_SLIDES[currentIndex].date}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line',
                }}
              >
                {STORY_SLIDES[currentIndex].meta}
              </Typography>
            </Box>
          </MotionBox>
        </AnimatePresence>

        <Box sx={{ display: 'flex', gap: '.4rem', justifyContent: 'center', mt: 4 }}>
          {STORY_SLIDES.map((slide, index) => (
            <Button
              key={slide.id}
              onClick={() => handleDotClick(index)}
              sx={{
                width: index === currentIndex ? 28 : 10,
                height: 10,
                borderRadius: '999px',
                background:
                  index === currentIndex
                    ? theme.palette.custom?.brand600 || theme.palette.primary.main
                    : theme.palette.custom?.brand200 || theme.palette.grey[300],
                minWidth: 0,
                p: 0,
                transition: 'all .25s ease',
              }}
            />
          ))}
        </Box>

        <IconButton
          onClick={handlePrev}
          sx={{
            position: 'absolute',
            left: { xs: 8, md: -8 },
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.9)',
            boxShadow: '0 4px 12px rgba(0,0,0,.12)',
            '&:hover': { backgroundColor: 'white' },
          }}
        >
          <ChevronLeft />
        </IconButton>

        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            right: { xs: 8, md: -8 },
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.9)',
            boxShadow: '0 4px 12px rgba(0,0,0,.12)',
            '&:hover': { backgroundColor: 'white' },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
}
