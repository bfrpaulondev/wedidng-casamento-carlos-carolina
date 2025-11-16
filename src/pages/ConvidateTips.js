// src/pages/GuestTips.js
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import NoFlashIcon from '@mui/icons-material/NoFlash';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

const MotionBox = motion(Box);

const TIPS = [
  {
    id: 1,
    icon: <CheckCircleOutlineIcon />,
    title: 'Confirme a sua presença',
    text: 'Use a página de confirmação do site. Isso ajuda na organização de lugares, refeições e toda a logística do dia.',
  },
  {
    id: 2,
    icon: <ScheduleIcon />,
    title: 'Chegue com antecedência',
    text: 'Planeie chegar um pouco antes da hora. Assim, encontra o seu lugar com calma e entra no clima da festa desde o início.',
  },
  {
    id: 3,
    icon: <ColorLensIcon />,
    title: 'Cores reservadas',
    text: 'Evite branco, tons de azul e tons de cinza. Estas cores ficam reservadas para o casal e para detalhes do cortejo.',
  },
  {
    id: 4,
    icon: <CheckroomIcon />,
    title: 'Trajes modestos e confortáveis',
    text: 'Escolha um look elegante, confortável e com modéstia: nada muito curto ou transparente. A ideia é estar bonito e à vontade o casamento inteiro.',
  },
  {
    id: 5,
    icon: <CameraAltIcon />,
    title: 'Use o filtro personalizado',
    text: 'No dia, teremos um filtro especial para fotos. Use e abuse, registe o momento e partilhe com a cara do nosso casamento.',
  },
  {
    id: 6,
    icon: <NoFlashIcon />,
    title: 'Não atrapalhe as fotos oficiais',
    text: 'Durante momentos importantes, evite ficar à frente dos fotógrafos ou usar flash. Assim, as memórias ficam perfeitas para todos.',
  },
  {
    id: 7,
    icon: <VolumeOffIcon />,
    title: 'Telemóvel no silencioso',
    text: 'Mantenha o telemóvel em silêncio para não interromper a cerimónia, os discursos ou aquele momento especial da pista.',
  },
  {
    id: 8,
    icon: <VolunteerActivismIcon />,
    title: 'Traga boas energias',
    text: 'Comentários negativos ficam de fora. Sorrisos, abraços e apoio são o dress code emocional deste dia.',
  },
  {
    id: 9,
    icon: <EmojiPeopleIcon />,
    title: 'Despeça-se dos noivos',
    text: 'Antes de ir embora, passa para dar um abraço. Cada encontro e despedida faz parte da memória que queremos guardar.',
  },
];

export default function GuestTips() {
  const theme = useTheme();

  const blue = theme.palette.custom?.brand600 || theme.palette.primary.main;
  const salmon = theme.palette.secondary?.main || '#F28B82';

  const bgTop = `linear-gradient(135deg, ${blue}15, ${salmon}10)`;
  const bgBottom = theme.palette.background.paper;

  const cardVariants = {
    hidden: { opacity: 0, y: 40, rotate: -1.5, scale: 0.96 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotate: (i % 2 ? 0.8 : -0.8),
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.09 + i * 0.06,
      },
    }),
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 4 },
        background: `radial-gradient(circle at top, ${bgTop} 0, ${bgBottom} 55%)`,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1180, position: 'relative' }}>
        {/* Flores/“aquarela” animadas de fundo */}
        <FlowerCluster
          top="-20px"
          left="-10px"
          size={120}
          blue={blue}
          salmon={salmon}
          delay={0.1}
        />
        <FlowerCluster
          top="40px"
          right="-30px"
          size={140}
          blue={blue}
          salmon={salmon}
          delay={0.25}
        />
        <FlowerCluster
          bottom="-30px"
          left="10%"
          size={130}
          blue={blue}
          salmon={salmon}
          delay={0.4}
        />
        <FlowerCluster
          bottom="-40px"
          right="8%"
          size={110}
          blue={blue}
          salmon={salmon}
          delay={0.5}
        />

        <MotionBox
          initial={{ opacity: 0, y: 45, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          sx={{
            position: 'relative',
            borderRadius: '2.4rem',
            overflow: 'hidden',
            boxShadow: '0 22px 70px rgba(15,23,42,0.26)',
            background: `linear-gradient(145deg, #ffffffF6, ${bgBottom})`,
            px: { xs: 2.4, md: 4 },
            pt: { xs: 4.2, md: 5 },
            pb: { xs: 4.4, md: 5.4 },
          }}
        >
          {/* brilho suave no fundo */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.22,
              backgroundImage: `radial-gradient(circle at 0 0, ${blue}, transparent 60%), radial-gradient(circle at 100% 100%, ${salmon}, transparent 55%)`,
              pointerEvents: 'none',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Cabeçalho */}
            <Box
              sx={{
                textAlign: 'center',
                mb: { xs: 4, md: 5 },
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  letterSpacing: '.28em',
                  textTransform: 'uppercase',
                  color: theme.palette.custom?.brand500 || theme.palette.text.secondary,
                  fontSize: '.74rem',
                }}
              >
                Manual do convidado
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  mt: 1,
                  fontFamily: 'Playfair Display, serif',
                  color: theme.palette.text.primary,
                  fontSize: { xs: '2.1rem', md: '2.6rem' },
                }}
              >
                Querido convidado
              </Typography>

              <Typography
                sx={{
                  mt: 1.6,
                  maxWidth: 650,
                  mx: 'auto',
                  fontSize: '.96rem',
                  color: theme.palette.text.secondary,
                  lineHeight: 1.8,
                }}
              >
                Estas pequenas dicas são a nossa forma de alinhar expectativas com
                carinho. A ideia é simples: todo mundo confortável, bonito, livre para
                celebrar e com boas lembranças no final da noite.
              </Typography>
            </Box>

            {/* Grid em layout mais “despojado” */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.1fr) minmax(0, 1.1fr)' },
                gap: { xs: 2.6, md: 3.2 },
              }}
            >
              {TIPS.map((tip, index) => (
                <MotionBox
                  key={tip.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.35 }}
                  whileHover={{
                    y: -8,
                    rotate: 0,
                    scale: 1.03,
                    boxShadow: '0 18px 40px rgba(15,23,42,0.25)',
                  }}
                  transition={{ type: 'spring', stiffness: 210, damping: 18 }}
                  sx={{
                    position: 'relative',
                    borderRadius: '1.6rem',
                    background:
                      index % 2 === 0
                        ? `linear-gradient(135deg, #ffffff, ${blue}0F)`
                        : `linear-gradient(135deg, #ffffff, ${salmon}12)`,
                    boxShadow: '0 12px 28px rgba(15,23,42,0.14)',
                    p: { xs: 2.2, md: 2.5 },
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 1.7,
                    minHeight: 150,
                    overflow: 'hidden',
                  }}
                >
                  <IconBadge icon={tip.icon} index={index} blue={blue} salmon={salmon} />

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 0.6,
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {tip.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '.9rem',
                        lineHeight: 1.7,
                      }}
                    >
                      {tip.text}
                    </Typography>
                  </Box>

                  {/* “petalas” no canto do card */}
                  <PetalCluster index={index} blue={blue} salmon={salmon} />
                </MotionBox>
              ))}
            </Box>
          </Box>
        </MotionBox>
      </Box>
    </Box>
  );
}

function IconBadge({ icon, index, blue, salmon }) {

  const bg =
    index % 2 === 0
      ? `radial-gradient(circle at 30% 0, #ffffff, ${blue}20)`
      : `radial-gradient(circle at 30% 0, #ffffff, ${salmon}26)`;

  const color = index % 2 === 0 ? blue : salmon;

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0, y: 10 }}
      whileInView={{ scale: 1, opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.45, delay: 0.15 + index * 0.03 }}
      style={{
        width: 48,
        height: 48,
        borderRadius: '999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        boxShadow: '0 8px 18px rgba(15,23,42,0.16)',
      }}
    >
      <motion.span
        animate={{ y: [0, -2, 0] }}
        transition={{
          repeat: Infinity,
          repeatType: 'mirror',
          duration: 2.6 + index * 0.15,
        }}
        style={{ display: 'flex', color }}
      >
        {React.cloneElement(icon, { fontSize: 'medium' })}
      </motion.span>
    </motion.div>
  );
}

// cluster suave de “pétalas” em cada card
function PetalCluster({ index, blue, salmon }) {
  const petals = [
    { x: 60, y: -14, r: 14, color: blue },
    { x: 78, y: 4, r: 10, color: salmon },
    { x: 50, y: 10, r: 8, color: `${blue}AA` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
      whileInView={{ opacity: 0.85, scale: 1, rotate: index % 2 ? 8 : -8 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.04 }}
      style={{
        position: 'absolute',
        top: -4,
        right: -6,
        width: 90,
        height: 70,
        pointerEvents: 'none',
      }}
    >
      {petals.map((p, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -2, 0] }}
          transition={{
            repeat: Infinity,
            repeatType: 'mirror',
            duration: 3 + i * 0.8,
          }}
          style={{
            position: 'absolute',
            top: p.y,
            left: p.x,
            width: p.r * 2,
            height: p.r,
            borderRadius: '999px',
            background: p.color,
            opacity: 0.35,
            transform: 'rotate(35deg)',
          }}
        />
      ))}
    </motion.div>
  );
}

// “flores de aquarela” no fundo da página
function FlowerCluster({ top, left, right, bottom, size, blue, salmon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 18 }}
      animate={{ opacity: 0.9, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay: delay || 0, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top,
        left,
        right,
        bottom,
        width: size,
        height: size,
        pointerEvents: 'none',
      }}
    >
      <motion.span
        animate={{ rotate: [0, 4, -2, 0] }}
        transition={{
          repeat: Infinity,
          duration: 16,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 20%, ${salmon}, transparent 60%), radial-gradient(circle at 70% 80%, ${blue}, transparent 60%)`,
          filter: 'blur(10px)',
          opacity: 0.7,
        }}
      />
      <motion.span
        animate={{ rotate: [0, -6, 3, 0] }}
        transition={{
          repeat: Infinity,
          duration: 18,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          inset: '18%',
          borderRadius: '60% 40% 65% 35%',
          background: `radial-gradient(circle at 20% 80%, ${blue}AA, transparent 60%)`,
          filter: 'blur(12px)',
          opacity: 0.55,
        }}
      />
    </motion.div>
  );
}
