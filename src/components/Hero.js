import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Box, Typography, Button, Grid } from '@mui/material';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import confetti from 'canvas-confetti';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const WEDDING_DATE = new Date('2026-06-21T15:00:00');

export default function Hero() {
  const theme = useTheme();
  const [now, setNow] = useState(new Date());
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 10 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 10 });
  const scale = useTransform(springX, (x) => 1 + x / 1000);
  const videoRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: [theme.palette.primary.main, theme.palette.secondary.main],
    });
  }, [theme]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const days = differenceInDays(WEDDING_DATE, now);
  const hours = differenceInHours(WEDDING_DATE, now) % 24;
  const minutes = differenceInMinutes(WEDDING_DATE, now) % 60;
  const seconds = differenceInSeconds(WEDDING_DATE, now) % 60;

  const textAnim = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.6, ease: 'easeOut' },
    }),
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        mb: 8,
      }}
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        src="/videos/VIDEO.mp4"
        autoPlay
        loop
        playsInline
        muted
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
          objectPosition: 'center',
          maxWidth: 'none',
          maxHeight: 'none',
          zIndex: -2,
        }}
      />

      <motion.div style={{ x: springX, y: springY, scale }} className="absolute inset-0" />

      {/* caixa com fundo preto transparente para destacar o texto */}
      <Box
        sx={{
          position: 'relative',
          textAlign: 'center',
          px: { xs: 3, md: 4 },
          py: { xs: 3, md: 4 },
          maxWidth: '800px',
          color: 'white',
          borderRadius: 4,
          backgroundColor: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(2px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Typography
            variant="h6"
            sx={{ textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600, mb: 2 }}
          >
            Carolina Maria & Carlos Manuel
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontFamily: 'Playfair Display, serif',
              mb: 3,
              lineHeight: 1.2,
            }}
          >
            O Grande Dia Chegou!
          </Typography>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {[
            'O nosso grande dia está a chegar, e não poderíamos estar mais felizes em partilhar este momento com aqueles que amamos.',
            'Depois de tantos sorrisos, sonhos e planos, chegou o momento de celebrarmos o amor que construímos juntos — um amor simples, sincero e cheio de significado.',
            'Queremos viver este dia com muita alegria, emoção e gratidão, ao lado de quem fez e faz parte da nossa história.',
            '⸻',
            'A CAROLINA DISSE SIM!',
            'Foram risos, aventuras e muitas memórias até aqui.',
            'Cada passo do nosso caminho fortaleceu a certeza de que fomos feitos um para o outro.',
            'E num dia cheio de emoção, o “sim” aconteceu — o sim para uma nova etapa, para uma vida a dois, para uma história que só está a começar.',
            'Agora, queremos celebrar com todos os que fizeram parte deste percurso tão bonito.',
          ].map((phrase, i) => (
            <motion.p
              key={i}
              variants={textAnim}
              custom={i}
              style={{
                marginBottom: '0.6rem',
                fontSize: '1.1rem',
                lineHeight: 1.5,
                opacity: 0.95,
              }}
            >
              {phrase}
            </motion.p>
          ))}
        </motion.div>

        <Box
          sx={{
            mt: 6,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
          }}
        >
          <Button
            component={Link}
            to="/rsvp"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: theme.palette.primary.dark,
              color: '#FFF',
              '&:hover': { backgroundColor: theme.palette.primary.dark },
            }}
          >
            Confirmar Presença
          </Button>

          <Grid container sx={{ justifyContent: 'center', gap: 2 }}>
            {[
              { label: 'Dias', value: days },
              { label: 'Horas', value: hours },
              { label: 'Minutos', value: minutes },
              { label: 'Segundos', value: seconds },
            ].map((unit, i) => (
              <motion.div
                key={unit.label}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                style={{
                  textAlign: 'center',
                  padding: 16,
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '1rem',
                  minWidth: 60,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 'bold', color: theme.palette.secondary.main }}
                >
                  {unit.value}
                </Typography>
                <Typography variant="caption">{unit.label}</Typography>
              </motion.div>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
