// src/pages/Gifts.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
  useTheme,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentCopy, Check, FavoriteBorder } from '@mui/icons-material';

const MotionBox = motion(Box);

export default function Gifts() {
  const theme = useTheme();
  const [copiedField, setCopiedField] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const IBAN = 'PT50003300004571824893905';
  const HOLDER = 'Carlos Manuel João Gonga';
  const PHONE = '+351 967 963 106';

  const handleCopy = async (value, fieldKey) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(fieldKey);
      setSnackbar({
        open: true,
        message: 'Copiado para a área de transferência.',
        severity: 'success',
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      setSnackbar({
        open: true,
        message: 'Não foi possível copiar. Copia manualmente, por favor.',
        severity: 'error',
      });
    }
  };

  const bgTop = theme.palette.custom?.brand50 || theme.palette.background.paper;
  const bgBottom = theme.palette.custom?.brand100 || theme.palette.grey[100];
  const accent = theme.palette.custom?.brand600 || theme.palette.primary.main;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 4 },
        background: `radial-gradient(circle at top, ${bgTop} 0, ${theme.palette.background.default} 45%, ${theme.palette.background.paper} 100%)`,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1150, position: 'relative' }}>
        {/* Elementos flutuantes decorativos */}
        <FloatingShape
          top="4%"
          left="8%"
          size={70}
          blur={18}
          color={accent}
          delay={0.1}
        />
        <FloatingShape
          top="12%"
          right="5%"
          size={90}
          blur={22}
          color={theme.palette.secondary.main}
          delay={0.3}
        />
        <FloatingShape
          bottom="3%"
          left="18%"
          size={80}
          blur={20}
          color={theme.palette.custom?.brand200 || theme.palette.grey[200]}
          delay={0.5}
        />

        <MotionBox
          initial={{ opacity: 0, y: 42, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          sx={{
            position: 'relative',
            borderRadius: '2rem',
            overflow: 'hidden',
            boxShadow: '0 18px 50px rgba(15,23,42,0.20)',
            background: `linear-gradient(145deg, ${bgTop}, ${bgBottom})`,
            px: { xs: 2.5, md: 4 },
            pt: { xs: 4, md: 5 },
            pb: { xs: 4.5, md: 5.5 },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.22,
              backgroundImage: `radial-gradient(circle at 0 0, ${accent}, transparent 60%), radial-gradient(circle at 100% 100%, ${theme.palette.secondary.main}, transparent 55%)`,
              pointerEvents: 'none',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Cabeçalho */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                gap: 2,
                mb: { xs: 3.5, md: 4 },
              }}
            >
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: '.22em',
                    textTransform: 'uppercase',
                    color: theme.palette.custom?.brand500 || theme.palette.text.secondary,
                    fontSize: '.72rem',
                  }}
                >
                  Presentes
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: 'Playfair Display, serif',
                    color: theme.palette.text.primary,
                    mt: 0.5,
                  }}
                >
                  Um presente em forma de futuro
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    maxWidth: 480,
                    fontSize: '.92rem',
                    color: theme.palette.text.secondary,
                  }}
                >
                  Em vez de uma lista tradicional, criámos um cantinho para quem quiser
                  ajudar-nos a construir o nosso lar e a nossa nova fase juntos.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  alignSelf: { xs: 'flex-start', md: 'center' },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `radial-gradient(circle at 30% 0, #fff, ${bgTop})`,
                    boxShadow: '0 6px 16px rgba(15,23,42,0.18)',
                  }}
                >
                  <FavoriteBorder
                    sx={{ fontSize: 24, color: accent }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '.16em',
                      color: theme.palette.custom?.brand500 || theme.palette.text.secondary,
                    }}
                  >
                    Presente em valores
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '.86rem',
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Mais do que coisas, vocês ajudam a construir o nosso espaço.
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Layout principal: carta + cartão de dados */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' },
                gap: { xs: 3, md: 4 },
                alignItems: 'stretch',
              }}
            >
              {/* Carta dos noivos */}
              <MotionBox
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                sx={{
                  borderRadius: '1.5rem',
                  backgroundColor: `${theme.palette.common.white}E6`,
                  boxShadow: '0 12px 30px rgba(15,23,42,0.16)',
                  p: { xs: 2.5, md: 3.25 },
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                      'radial-gradient(circle at top left, rgba(255,255,255,0.9), transparent 60%)',
                    pointerEvents: 'none',
                    opacity: 0.7,
                  }}
                />
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 600,
                      mb: 1.5,
                      color: theme.palette.text.primary,
                    }}
                  >
                    Queridos amigos e familiares,
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.7,
                      mb: 1.5,
                    }}
                  >
                    Estamos imensamente gratos por vocês fazerem parte deste momento tão
                    especial em nossas vidas.
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.7,
                      mb: 1.5,
                    }}
                  >
                    Sua presença, carinho e apoio são os maiores presentes que poderíamos
                    receber – eles enchem nossos corações de alegria e nos inspiram a
                    construir um futuro cheio de memórias felizes.
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.7,
                      mb: 1.5,
                    }}
                  >
                    Se, no entanto, vocês desejarem contribuir de forma tangível para o
                    nosso lar doce lar,gostarimos de direcionar essa generosidade para
                    itens que reflitam nosso estilo simples e atemporal.
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.7,
                      mb: 1.5,
                    }}
                  >
                    Para facilitar e garantir que possamos escolher exatamente o que se
                    encaixa no nosso espaço, decidimos não ter uma lista de presentes,
                    preferimos contribuições em valores monetários.
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.7,
                      mb: 1.5,
                    }}
                  >
                    Assim, cada gesto se transforma em algo significativo e
                    personalizado, ajudando-nos a investir em itens do nosso agrado.
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.7,
                      mb: 1.5,
                    }}
                  >
                    Qualquer quantia, vinda do coração, será recebida com profunda
                    gratidão e usada para criar um ambiente acolhedor onde possamos
                    receber vocês em breve.
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.7,
                      mb: 2,
                    }}
                  >
                    Mal podemos esperar para brindar com vocês!
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    Com amor,
                    <br />
                    Carolina e Carlos
                  </Typography>
                </Box>
              </MotionBox>

              {/* Cartão digital de presentes (dados bancários) */}
              <MotionBox
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                sx={{
                  borderRadius: '1.5rem',
                  background: `linear-gradient(135deg, ${accent}, ${
                    theme.palette.secondary.main
                  })`,
                  color: '#fff',
                  p: { xs: 2.5, md: 3 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 16px 38px rgba(15,23,42,0.32)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.2,
                    backgroundImage:
                      'radial-gradient(circle at 10% 0, #ffffff, transparent 60%)',
                    pointerEvents: 'none',
                  }}
                />

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: '.78rem',
                      letterSpacing: '.18em',
                      textTransform: 'uppercase',
                      opacity: 0.9,
                    }}
                  >
                    Dados para presente em valores
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      mt: 1,
                      mb: 2,
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 600,
                    }}
                  >
                    Presente personalizado dos noivos
                  </Typography>

                  <FieldRow
                    label="IBAN"
                    value={IBAN}
                    copied={copiedField === 'iban'}
                    onCopy={() => handleCopy(IBAN, 'iban')}
                  />
                  <FieldRow
                    label="Titular"
                    value={HOLDER}
                    copied={copiedField === 'holder'}
                    onCopy={() => handleCopy(HOLDER, 'holder')}
                  />
                  <FieldRow
                    label="Se desejar enviar por MBWAY pode usar este número"
                    value={PHONE}
                    copied={copiedField === 'phone'}
                    onCopy={() => handleCopy(PHONE, 'phone')}
                  />

                  <Box
                    sx={{
                      mt: 2.5,
                      p: 1.4,
                      borderRadius: '1rem',
                      backgroundColor: 'rgba(0,0,0,0.18)',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    <Typography
                      sx={{ fontSize: '.85rem', opacity: 0.96 }}
                    >
                      Se desejar, pode enviar o comprovativo para este número para que
                      possamos agradecer com carinho e registar o seu gesto na nossa
                      memória com todo o cuidado.
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    mt: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 1.5,
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '.78rem',
                      letterSpacing: '.16em',
                      textTransform: 'uppercase',
                      opacity: 0.85,
                    }}
                  >
                    Cada gesto faz parte da nossa história
                  </Typography>
                  <Button
                    variant="contained"
                    disableElevation
                    sx={{
                      borderRadius: '999px',
                      backgroundColor: '#fff',
                      color: accent,
                      textTransform: 'none',
                      px: 2.5,
                      py: 0.6,
                      fontSize: '.86rem',
                      '&:hover': {
                        backgroundColor: '#fdfdfd',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                      },
                      transition: 'all .22s ease',
                    }}
                    onClick={() => handleCopy(IBAN, 'iban')}
                  >
                    Copiar IBAN
                  </Button>
                </Box>
              </MotionBox>
            </Box>
          </Box>
        </MotionBox>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3500}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            severity={snackbar.severity}
            variant="filled"
            sx={{ borderRadius: '999px' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

function FieldRow({ label, value, copied, onCopy }) {

  return (
    <Box
      sx={{
        mb: 1.4,
      }}
    >
      <Typography
        sx={{
          fontSize: '.72rem',
          textTransform: 'uppercase',
          letterSpacing: '.16em',
          opacity: 0.9,
          mb: 0.4,
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: 'monospace',
            fontSize: '.9rem',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
        >
          {value}
        </Typography>
        <Tooltip title={copied ? 'Copiado' : 'Copiar'}>
          <IconButton
            size="small"
            onClick={onCopy}
            sx={{
              ml: 'auto',
              borderRadius: '999px',
              backgroundColor: 'rgba(255,255,255,0.16)',
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.26)',
              },
            }}
          >
            {copied ? (
              <Check sx={{ fontSize: 18 }} />
            ) : (
              <ContentCopy sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

// Bolhas decorativas animadas
function FloatingShape({ top, left, right, bottom, size, blur, color, delay }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 15 }}
        animate={{ opacity: 0.9, scale: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: delay || 0, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top,
          left,
          right,
          bottom,
          width: size,
          height: size,
          borderRadius: '999px',
          background: color,
          filter: `blur(${blur}px)`,
          pointerEvents: 'none',
        }}
      />
    </AnimatePresence>
  );
}

