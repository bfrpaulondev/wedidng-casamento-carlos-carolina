// src/pages/Ceremony.js
import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  IconButton,
  Chip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import PlaceIcon from '@mui/icons-material/Place';
import DirectionsIcon from '@mui/icons-material/Directions';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { AppContext } from '../contexts/AppContext';
import Gate from '../components/Gate';

// imagens da Quinta Nevada 3 (Palmela)
import img1 from '../assets/images/quinta-nevada/QN1.jpg';
import img2 from '../assets/images/quinta-nevada/QN2.jpg';
import img3 from '../assets/images/quinta-nevada/QN3.jpg';
import img4 from '../assets/images/quinta-nevada/QN4.jpg';
import img5 from '../assets/images/quinta-nevada/QN5.jpg';
import img6 from '../assets/images/quinta-nevada/QN6.jpg';
import img7 from '../assets/images/quinta-nevada/QN7.jpg';

const MotionBox = motion(Box);

// Endereço e links do local
const VENUE_NAME = 'Quinta Nevada 3';
const VENUE_ADDRESS = 'R. Francisco Assunção Pinho, 2950-091 Palmela';
const VENUE_FULL_ADDRESS = 'Quinta Nevada 3, R. Francisco Assunção Pinho, 2950-091 Palmela';
const VENUE_LAT = 38.5686;
const VENUE_LNG = -8.9027;
// Links de navegação para os 3 principais apps de mapas
const GOOGLE_MAPS_DIR = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  VENUE_FULL_ADDRESS,
)}`;
const APPLE_MAPS_DIR = `https://maps.apple.com/?daddr=${VENUE_LAT},${VENUE_LNG}&q=${encodeURIComponent(
  VENUE_NAME,
)}`;
const WAZE_DIR = `https://www.waze.com/ul?ll=${VENUE_LAT}%2C${VENUE_LNG}&navigate=yes&zoom=17`;

const GALLERY = [
  { src: img1, alt: 'Vista geral dos jardins da Quinta Nevada 3 em Palmela' },
  { src: img2, alt: 'Espaço exterior da Quinta Nevada 3 para cerimónia' },
  { src: img3, alt: 'Detalhe romântico do cenário da Quinta Nevada 3' },
  { src: img4, alt: 'Zona de receção ao ar livre da Quinta Nevada 3' },
  { src: img5, alt: 'Ambiente da Quinta Nevada 3 ao pôr-do-sol' },
  { src: img6, alt: 'Espaço preparado para a festa na Quinta Nevada 3' },
  { src: img7, alt: 'Decoração de casamento na Quinta Nevada 3' },
];

const HIGHLIGHTS = [
  {
    title: 'Cerimónia ao ar livre',
    text: 'O “sim” será pronunciado nos jardins da Quinta Nevada 3, rodeados pela vegetação e pela luz natural de Palmela.',
  },
  {
    title: 'Receção elegante',
    text: 'A receção decorre num espaço pensado ao detalhe, com ambiente acolhedor para receber todos os convidados.',
  },
  {
    title: 'Festa até late',
    text: 'A pista abre após o jantar. Música, dança e boas energias para fechar o nosso dia com chave de ouro.',
  },
];

export default function Ceremony() {
  const theme = useTheme();
  const { user } = useContext(AppContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [lightboxIndex, setLightboxIndex] = useState(null);

  const blue = theme.palette.custom?.brand600 || theme.palette.primary.main;
  const salmon = theme.palette.secondary?.main || '#F4B79A';
  const bgTop = theme.palette.custom?.brand50 || theme.palette.background.paper;
  const accent = theme.palette.custom?.brand600 || theme.palette.primary.main;

  const handleLightboxPrev = () => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + GALLERY.length) % GALLERY.length,
    );
  };
  const handleLightboxNext = () => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % GALLERY.length,
    );
  };

  return (
    <Box sx={{ overflow: 'hidden', minHeight: '100vh' }}>
      <AnimatePresence mode="wait">
        {!user ? (
          <Gate key="gate" />
        ) : (
          <Box
            key="content"
            sx={{
              minHeight: '100vh',
              py: { xs: 4, md: 6 },
              px: { xs: 0, md: 3 },
              background: `radial-gradient(circle at top, ${bgTop} 0, ${theme.palette.background.default} 50%, ${theme.palette.background.paper} 100%)`,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 1180, position: 'relative' }}>
              {/* HERO COM IMAGEM PRINCIPAL */}
              <MotionBox
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                sx={{
                  position: 'relative',
                  borderRadius: { xs: 0, md: '2rem' },
                  overflow: 'hidden',
                  minHeight: { xs: 360, md: 520 },
                  boxShadow: '0 18px 50px rgba(15,23,42,0.20)',
                  mb: { xs: 4, md: 6 },
                }}
              >
                <Box
                  component="img"
                  src={img1}
                  alt="Vista geral da Quinta Nevada 3 em Palmela"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0.70) 100%)',
                    zIndex: 1,
                  }}
                />

                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 2,
                    height: '100%',
                    minHeight: { xs: 360, md: 520 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: { xs: 3, md: 6 },
                    color: '#fff',
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <Chip
                      icon={<PlaceIcon sx={{ color: '#fff !important' }} />}
                      label="Palmela · Portugal"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.18)',
                        color: '#fff',
                        backdropFilter: 'blur(6px)',
                        fontWeight: 500,
                        mb: 2,
                        border: '1px solid rgba(255,255,255,0.25)',
                      }}
                    />
                    <Typography
                      variant="overline"
                      sx={{
                        display: 'block',
                        letterSpacing: '.28em',
                        textTransform: 'uppercase',
                        opacity: 0.85,
                        fontSize: '.72rem',
                      }}
                    >
                      Local da cerimónia e festa
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: { xs: '2.2rem', md: '3.4rem' },
                        lineHeight: 1.1,
                        mt: 1,
                        mb: 1.5,
                        textShadow: '0 4px 18px rgba(0,0,0,0.35)',
                      }}
                    >
                      Quinta Nevada 3
                    </Typography>
                    <Typography
                      sx={{
                        maxWidth: 580,
                        fontSize: { xs: '.95rem', md: '1.05rem' },
                        lineHeight: 1.65,
                        opacity: 0.95,
                        textShadow: '0 2px 8px rgba(0,0,0,0.35)',
                      }}
                    >
                      Um cenário de sonho, entre jardins e luz natural, onde
                      celebraremos o nosso amor com quem mais amamos.{' '}
                      <strong style={{ opacity: 1 }}>
                        {VENUE_ADDRESS}
                      </strong>
                      .
                    </Typography>

                    <Box
                      sx={{
                        mt: 3,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 1.5,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Button
                        variant="contained"
                        size={isMobile ? 'medium' : 'large'}
                        startIcon={<DirectionsIcon />}
                        href={GOOGLE_MAPS_DIR}
                        target="_blank"
                        rel="noopener noreferrer"
                        disableElevation
                        sx={{
                          borderRadius: '999px',
                          backgroundColor: '#fff',
                          color: theme.palette.text.primary,
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 3,
                          '&:hover': {
                            backgroundColor: '#fdfdfd',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 24px rgba(0,0,0,0.30)',
                          },
                          transition: 'all .25s ease',
                        }}
                      >
                        Google Maps
                      </Button>
                      <Button
                        variant="outlined"
                        size={isMobile ? 'medium' : 'large'}
                        href={APPLE_MAPS_DIR}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          borderRadius: '999px',
                          borderColor: 'rgba(255,255,255,0.65)',
                          color: '#fff',
                          textTransform: 'none',
                          fontWeight: 500,
                          px: 3,
                          backdropFilter: 'blur(6px)',
                          backgroundColor: 'rgba(255,255,255,0.10)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.18)',
                            borderColor: '#fff',
                          },
                        }}
                      >
                        Apple Maps
                      </Button>
                      <Button
                        variant="outlined"
                        size={isMobile ? 'medium' : 'large'}
                        href={WAZE_DIR}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          borderRadius: '999px',
                          borderColor: 'rgba(255,255,255,0.65)',
                          color: '#fff',
                          textTransform: 'none',
                          fontWeight: 500,
                          px: 3,
                          backdropFilter: 'blur(6px)',
                          backgroundColor: 'rgba(255,255,255,0.10)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.18)',
                            borderColor: '#fff',
                          },
                        }}
                      >
                        Waze
                      </Button>
                    </Box>
                  </motion.div>
                </Box>
              </MotionBox>

              {/* CARTÃO ENDEREÇO + DESTAQUES (grid 2 colunas em desktop) */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: { xs: 3, md: 4 },
                  mb: { xs: 4, md: 6 },
                }}
              >
                {/* Cartão de endereço (estilo "cartão digital") */}
                <MotionBox
                  initial={{ opacity: 0, x: -25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  sx={{
                    borderRadius: '1.5rem',
                    background: `linear-gradient(135deg, ${accent}, ${salmon})`,
                    color: '#fff',
                    p: { xs: 2.5, md: 3 },
                    boxShadow: '0 16px 38px rgba(15,23,42,0.30)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0.22,
                      backgroundImage:
                        'radial-gradient(circle at 10% 0, #ffffff, transparent 60%)',
                      pointerEvents: 'none',
                    }}
                  />
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '.74rem',
                        letterSpacing: '.18em',
                        textTransform: 'uppercase',
                        opacity: 0.9,
                      }}
                    >
                      Onde encontrar-nos
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        mt: 1,
                        mb: 2,
                        fontFamily: 'Playfair Display, serif',
                        fontWeight: 600,
                        fontSize: '1.25rem',
                      }}
                    >
                      {VENUE_NAME}
                    </Typography>

                    <Box sx={{ mb: 1.5 }}>
                      <Typography
                        sx={{
                          fontSize: '.7rem',
                          textTransform: 'uppercase',
                          letterSpacing: '.16em',
                          opacity: 0.85,
                          mb: 0.4,
                        }}
                      >
                        Morada
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '.95rem',
                          lineHeight: 1.5,
                          fontWeight: 500,
                        }}
                      >
                        {VENUE_ADDRESS}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography
                        sx={{
                          fontSize: '.7rem',
                          textTransform: 'uppercase',
                          letterSpacing: '.16em',
                          opacity: 0.85,
                          mb: 0.4,
                        }}
                      >
                        Coordenadas
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'monospace',
                          fontSize: '.85rem',
                        }}
                      >
                        {VENUE_LAT}, {VENUE_LNG}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="contained"
                        disableElevation
                        href={GOOGLE_MAPS_DIR}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          borderRadius: '999px',
                          backgroundColor: '#fff',
                          color: accent,
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '.82rem',
                          py: 0.9,
                          px: 1,
                          minWidth: 0,
                          '&:hover': {
                            backgroundColor: '#fdfdfd',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                          },
                          transition: 'all .22s ease',
                        }}
                      >
                        Google
                      </Button>
                      <Button
                        variant="contained"
                        disableElevation
                        href={APPLE_MAPS_DIR}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          borderRadius: '999px',
                          backgroundColor: 'rgba(255,255,255,0.18)',
                          color: '#fff',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '.82rem',
                          py: 0.9,
                          px: 1,
                          minWidth: 0,
                          border: '1px solid rgba(255,255,255,0.35)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.28)',
                            transform: 'translateY(-1px)',
                          },
                          transition: 'all .22s ease',
                        }}
                      >
                        Apple
                      </Button>
                      <Button
                        variant="contained"
                        disableElevation
                        href={WAZE_DIR}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          borderRadius: '999px',
                          backgroundColor: 'rgba(255,255,255,0.18)',
                          color: '#fff',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '.82rem',
                          py: 0.9,
                          px: 1,
                          minWidth: 0,
                          border: '1px solid rgba(255,255,255,0.35)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.28)',
                            transform: 'translateY(-1px)',
                          },
                          transition: 'all .22s ease',
                        }}
                      >
                        Waze
                      </Button>
                    </Box>
                  </Box>
                </MotionBox>

                {/* Destaques do local */}
                <MotionBox
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                  sx={{
                    borderRadius: '1.5rem',
                    backgroundColor: '#ffffffE6',
                    boxShadow: '0 12px 30px rgba(15,23,42,0.14)',
                    p: { xs: 2.5, md: 3 },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 600,
                      mb: 2,
                      color: theme.palette.text.primary,
                    }}
                  >
                    Porque escolhemos este lugar
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {HIGHLIGHTS.map((h, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex',
                          gap: 1.5,
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box
                          sx={{
                            flexShrink: 0,
                            width: 28,
                            height: 28,
                            borderRadius: '999px',
                            background: `linear-gradient(135deg, ${blue}, ${salmon})`,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '.8rem',
                            fontWeight: 700,
                            mt: 0.2,
                          }}
                        >
                          {i + 1}
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: '.95rem',
                              color: theme.palette.text.primary,
                              mb: 0.3,
                            }}
                          >
                            {h.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: '.85rem',
                              lineHeight: 1.6,
                            }}
                          >
                            {h.text}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </MotionBox>
              </Box>

              {/* GALERIA DE FOTOS */}
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                sx={{
                  textAlign: 'center',
                  mb: { xs: 2, md: 3 },
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: '.28em',
                    textTransform: 'uppercase',
                    color:
                      theme.palette.custom?.brand500 ||
                      theme.palette.text.secondary,
                    fontSize: '.74rem',
                  }}
                >
                  Conheça o espaço
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    mt: 1,
                    fontFamily: 'Playfair Display, serif',
                    color: theme.palette.text.primary,
                    fontSize: { xs: '1.9rem', md: '2.4rem' },
                  }}
                >
                  Um cenário para recordar
                </Typography>
                <Typography
                  sx={{
                    mt: 1.5,
                    maxWidth: 650,
                    mx: 'auto',
                    fontSize: '.95rem',
                    color: theme.palette.text.secondary,
                    lineHeight: 1.7,
                  }}
                >
                  Cada cantinho da Quinta Nevada 3 foi pensado para tornar o
                  nosso dia inesquecível. Espreitem algumas fotografias do
                  espaço que escolhemos para celebrar o nosso amor.
                </Typography>
              </MotionBox>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(4, 1fr)',
                  },
                  gap: 2,
                  mb: { xs: 6, md: 8 },
                }}
              >
                {GALLERY.map((img, i) => (
                  <MotionBox
                    key={i}
                    initial={{ opacity: 0, scale: 0.92, y: 18 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.45,
                      delay: i * 0.05,
                      ease: 'easeOut',
                    }}
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                      boxShadow: '0 18px 38px rgba(15,23,42,0.25)',
                    }}
                    onClick={() => setLightboxIndex(i)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: '1.2rem',
                      overflow: 'hidden',
                      position: 'relative',
                      boxShadow: '0 10px 26px rgba(15,23,42,0.16)',
                      aspectRatio: '4 / 3',
                      bgcolor: theme.palette.grey[100],
                      // reveal overlay on hover via sibling selector
                      '&:hover .gallery-overlay': { opacity: 1 },
                      '&:hover img': { transform: 'scale(1.06)' },
                    }}
                  >
                    <Box
                      component="img"
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform .55s ease',
                      }}
                    />
                    <Box
                      className="gallery-overlay"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.70) 100%)',
                        opacity: 0,
                        transition: 'opacity .35s ease',
                        display: 'flex',
                        alignItems: 'flex-end',
                        p: 1.5,
                        pointerEvents: 'none',
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#fff',
                          fontSize: '.78rem',
                          lineHeight: 1.4,
                          textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                        }}
                      >
                        {img.alt}
                      </Typography>
                    </Box>
                  </MotionBox>
                ))}
              </Box>

              {/* CTA FINAL */}
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                sx={{
                  borderRadius: '2rem',
                  background: `linear-gradient(135deg, ${blue}, ${salmon})`,
                  color: '#fff',
                  p: { xs: 3, md: 5 },
                  textAlign: 'center',
                  boxShadow: '0 18px 44px rgba(15,23,42,0.22)',
                  position: 'relative',
                  overflow: 'hidden',
                  mb: 4,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.22,
                    backgroundImage:
                      'radial-gradient(circle at 10% 0, #ffffff, transparent 60%), radial-gradient(circle at 90% 100%, #ffffff, transparent 55%)',
                    pointerEvents: 'none',
                  }}
                />
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <MusicNoteIcon sx={{ fontSize: 36, opacity: 0.85, mb: 1 }} />
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: { xs: '1.6rem', md: '2.2rem' },
                      mb: 1.5,
                    }}
                  >
                    Vamos celebrar juntos
                  </Typography>
                  <Typography
                    sx={{
                      maxWidth: 580,
                      mx: 'auto',
                      mb: 3,
                      fontSize: { xs: '.92rem', md: '1rem' },
                      lineHeight: 1.7,
                      opacity: 0.95,
                    }}
                  >
                    Guardem a data, preparem o vosso melhor sorriso e venham
                    celebrar connosco este dia tão especial. Mal podemos esperar
                    por vos receber na Quinta Nevada 3!
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      justifyContent: 'center',
                      flexDirection: { xs: 'column', sm: 'row' },
                      flexWrap: 'wrap',
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<DirectionsIcon />}
                      href={GOOGLE_MAPS_DIR}
                      target="_blank"
                      rel="noopener noreferrer"
                      disableElevation
                      sx={{
                        borderRadius: '999px',
                        backgroundColor: '#fff',
                        color: accent,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 4,
                        '&:hover': {
                          backgroundColor: '#fdfdfd',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 10px 24px rgba(0,0,0,0.30)',
                        },
                        transition: 'all .25s ease',
                      }}
                    >
                      Google Maps
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      href={APPLE_MAPS_DIR}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        borderRadius: '999px',
                        borderColor: 'rgba(255,255,255,0.65)',
                        color: '#fff',
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 4,
                        backdropFilter: 'blur(6px)',
                        backgroundColor: 'rgba(255,255,255,0.10)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.18)',
                          borderColor: '#fff',
                        },
                      }}
                    >
                      Apple Maps
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      href={WAZE_DIR}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        borderRadius: '999px',
                        borderColor: 'rgba(255,255,255,0.65)',
                        color: '#fff',
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 4,
                        backdropFilter: 'blur(6px)',
                        backgroundColor: 'rgba(255,255,255,0.10)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.18)',
                          borderColor: '#fff',
                        },
                      }}
                    >
                      Waze
                    </Button>
                  </Box>
                </Box>
              </MotionBox>
            </Box>
          </Box>
        )}
      </AnimatePresence>

      {/* LIGHTBOX */}
      <Dialog
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        fullScreen
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0,0,0,0.92)',
            backgroundImage: 'none',
            boxShadow: 'none',
          },
        }}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'rgba(0,0,0,0.92)',
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <IconButton
            onClick={() => setLightboxIndex(null)}
            aria-label="Fechar"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: '#fff',
              backgroundColor: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(6px)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.22)' },
              zIndex: 2,
            }}
          >
            <CloseIcon />
          </IconButton>

          {lightboxIndex !== null && (
            <>
              <IconButton
                onClick={handleLightboxPrev}
                aria-label="Anterior"
                sx={{
                  position: 'absolute',
                  left: { xs: 8, md: 24 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(6px)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.22)' },
                  zIndex: 2,
                }}
              >
                <ChevronLeftIcon />
              </IconButton>

              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    maxWidth: '90vw',
                    maxHeight: '85vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    component="img"
                    src={GALLERY[lightboxIndex].src}
                    alt={GALLERY[lightboxIndex].alt}
                    sx={{
                      maxWidth: '90vw',
                      maxHeight: '80vh',
                      objectFit: 'contain',
                      borderRadius: 2,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                    }}
                  />
                  <Typography
                    sx={{
                      color: '#fff',
                      mt: 2,
                      fontSize: '.9rem',
                      opacity: 0.85,
                      textAlign: 'center',
                      maxWidth: 600,
                    }}
                  >
                    {GALLERY[lightboxIndex].alt} ·{' '}
                    {lightboxIndex + 1} / {GALLERY.length}
                  </Typography>
                </motion.div>
              </AnimatePresence>

              <IconButton
                onClick={handleLightboxNext}
                aria-label="Próxima"
                sx={{
                  position: 'absolute',
                  right: { xs: 8, md: 24 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(6px)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.22)' },
                  zIndex: 2,
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
