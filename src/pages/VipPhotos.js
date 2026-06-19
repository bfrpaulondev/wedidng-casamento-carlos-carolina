// src/pages/VipPhotos.js
import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SwitchCameraIcon from '@mui/icons-material/SwitchCamera';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { AppContext } from '../contexts/AppContext';
import Gate from '../components/Gate';

const MotionBox = motion(Box);

// Cores reutilizadas em todos os componentes
const SALMON = '#F4B79A';

// ============================================================================
// CLOUDINARY — upload unsigned via preset (não expõe o API Secret no client)
// ============================================================================
const CLOUDINARY_CLOUD_NAME = 'dhsuwosfd';
const CLOUDINARY_UPLOAD_PRESET = 'carolinaecarlos';
const CLOUDINARY_FOLDER = 'carolinaecarlos';
// eslint-disable-next-line no-unused-vars
const CLOUDINARY_API_KEY = '674743651113364'; // referência; upload usa preset unsigned
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

// ============================================================================
// FILTROS DISPONÍVEIS — 3 temas do casamento
// ============================================================================
const FILTERS = [
  {
    id: 'classic',
    name: 'Clássico',
    icon: <AutoAwesomeIcon />,
    description: 'Frame dourado com lauréis e a data do casamento',
    // CSS filter aplicado à imagem
    cssFilter: 'saturate(1.05) contrast(1.03)',
    // Cor da moldura / overlay
    frameColor: '#C9A961',
    overlayGradient:
      'linear-gradient(180deg, rgba(20,30,45,0.15) 0%, transparent 25%, transparent 75%, rgba(20,30,45,0.25) 100%)',
    label: '21.06.2026',
    sublabel: 'C&C',
    style: 'gold',
  },
  {
    id: 'botanical',
    name: 'Botânico',
    icon: <LocalFloristIcon />,
    description: 'Tons navy com elementos florais dourados',
    cssFilter: 'saturate(1.1) contrast(1.05) hue-rotate(-3deg)',
    frameColor: '#1E3A52',
    overlayGradient:
      'linear-gradient(180deg, rgba(30,58,82,0.30) 0%, transparent 30%, transparent 70%, rgba(30,58,82,0.35) 100%)',
    label: '21.06.2026',
    sublabel: 'C&C',
    style: 'navy',
  },
  {
    id: 'glitter',
    name: 'Glitter',
    icon: <FavoriteIcon />,
    description: 'Fundo dourado intenso com corações e brilhos',
    cssFilter: 'saturate(1.15) brightness(1.05) contrast(1.05)',
    frameColor: '#D4AF37',
    overlayGradient:
      'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.25) 100%), linear-gradient(180deg, rgba(212,175,55,0.20) 0%, transparent 30%, transparent 70%, rgba(212,175,55,0.20) 100%)',
    label: 'Celebrando C&C',
    sublabel: '21.06.2026',
    style: 'celebration',
  },
];

// ============================================================================
// STORAGE LOCAL — cache de fotos postadas (enquanto não há backend próprio)
// ============================================================================
const STORAGE_KEY = 'cc_vip_photos';

function loadPhotos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePhotos(photos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch (e) {
    console.warn('Não foi possível salvar fotos localmente:', e);
  }
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function VipPhotos() {
  const theme = useTheme();
  const { user, isAdmin } = useContext(AppContext);

  const [photos, setPhotos] = useState([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [shareMenuAnchor, setShareMenuAnchor] = useState(null);
  const [shareTarget, setShareTarget] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Carrega fotos do localStorage ao montar
  useEffect(() => {
    setPhotos(loadPhotos());
  }, []);

  // Helper: mostra snackbar
  const showSnack = (message, severity = 'success') =>
    setSnackbar({ open: true, message, severity });

  // Adiciona nova foto à galeria
  const addPhoto = useCallback((photo) => {
    setPhotos((prev) => {
      const updated = [photo, ...prev];
      savePhotos(updated);
      return updated;
    });
  }, []);

  // Remove foto
  const removePhoto = useCallback((id) => {
    setPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      savePhotos(updated);
      return updated;
    });
    showSnack('Foto removida.', 'info');
  }, []);

  // Abrir menu de partilha
  const handleOpenShare = (e, photo) => {
    setShareTarget(photo);
    setShareMenuAnchor(e.currentTarget);
  };
  const handleCloseShare = () => {
    setShareMenuAnchor(null);
    setShareTarget(null);
  };

  // Acesso só para admin (por enquanto)
  if (!user) return <Gate />;
  if (!isAdmin) {
    return (
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '999px',
              background: `linear-gradient(135deg, ${theme.palette.custom?.brand50}, ${theme.palette.custom?.brand100})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              mx: 'auto',
              boxShadow: '0 10px 30px rgba(15,23,42,0.12)',
            }}
          >
            <LockIcon sx={{ fontSize: 44, color: theme.palette.custom?.brand600 }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Playfair Display, serif',
              mb: 2,
              color: theme.palette.text.primary,
            }}
          >
            Em breve
          </Typography>
          <Typography
            sx={{
              maxWidth: 480,
              mx: 'auto',
              color: theme.palette.text.secondary,
              lineHeight: 1.7,
              mb: 4,
            }}
          >
            A galeria VIP Fotos estará disponível no dia do casamento para todos
            os convidados. Aí poderão tirar fotos com filtros especiais e
            partilhar os vossos melhores momentos connosco!
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: theme.palette.text.disabled,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
            }}
          >
            21 · 06 · 2026
          </Typography>
        </motion.div>
      </Box>
    );
  }

  // ============== RENDER PRINCIPAL (ADMIN) ==============
  const BLUE = theme.palette.custom?.brand600 || theme.palette.primary.main;
  const SALMON = theme.palette.secondary?.main || '#F4B79A';

  return (
    <Box sx={{ overflow: 'hidden', minHeight: '100vh' }}>
      <Box
        sx={{
          minHeight: '100vh',
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 3 },
          background: `radial-gradient(circle at top, ${theme.palette.custom?.brand50} 0, ${theme.palette.background.default} 50%, ${theme.palette.background.paper} 100%)`,
        }}
      >
        <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
          {/* HEADER */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}
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
              Área VIP
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'Playfair Display, serif',
                color: theme.palette.text.primary,
                fontSize: { xs: '2rem', md: '2.6rem' },
                mt: 1,
                mb: 1.5,
              }}
            >
              Galeria de Fotos
            </Typography>
            <Typography
              sx={{
                maxWidth: 600,
                mx: 'auto',
                fontSize: '.95rem',
                color: theme.palette.text.secondary,
                lineHeight: 1.7,
              }}
            >
              Capturem cada momento deste dia especial com filtros únicos
              criados para a Carolina e o Carlos. As vossas fotos serão
              guardadas aqui para eternizar a nossa história.
            </Typography>
          </MotionBox>

          {/* BOTÃO PRINCIPAL — TIRAR FOTO */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            sx={{ textAlign: 'center', mb: { xs: 5, md: 6 } }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<CameraAltIcon />}
              onClick={() => setCameraOpen(true)}
              disableElevation
              sx={{
                borderRadius: '999px',
                background: `linear-gradient(135deg, ${BLUE}, ${SALMON})`,
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                px: 5,
                py: 1.5,
                boxShadow: '0 14px 34px rgba(15,23,42,0.25)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 18px 42px rgba(15,23,42,0.32)',
                },
                transition: 'all .25s ease',
              }}
            >
              Tirar foto
            </Button>
          </MotionBox>

          {/* ESTATÍSTICAS / INFO */}
          {photos.length > 0 && (
            <MotionBox
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                mb: 4,
                flexWrap: 'wrap',
              }}
            >
              <Chip
                icon={<PhotoLibraryIcon />}
                label={`${photos.length} foto${photos.length !== 1 ? 's' : ''} na galeria`}
                sx={{
                  borderRadius: '999px',
                  backgroundColor: '#fff',
                  border: `1px solid ${theme.palette.custom?.brand200}`,
                  fontWeight: 500,
                }}
              />
            </MotionBox>
          )}

          {/* GALERIA */}
          {photos.length === 0 ? (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              sx={{
                textAlign: 'center',
                py: { xs: 6, md: 10 },
                px: 3,
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '999px',
                  background: `linear-gradient(135deg, ${theme.palette.custom?.brand50}, ${theme.palette.custom?.brand100})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  mx: 'auto',
                }}
              >
                <PhotoLibraryIcon
                  sx={{ fontSize: 56, color: theme.palette.custom?.brand600, opacity: 0.6 }}
                />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'Playfair Display, serif',
                  mb: 1.5,
                  color: theme.palette.text.primary,
                }}
              >
                Ainda não há fotos
              </Typography>
              <Typography
                sx={{
                  maxWidth: 420,
                  mx: 'auto',
                  color: theme.palette.text.secondary,
                  fontSize: '.92rem',
                  lineHeight: 1.7,
                }}
              >
                Sejam os primeiros a partilhar um momento deste dia especial.
                Carreguem em "Tirar foto" e deixem a magia acontecer!
              </Typography>
            </MotionBox>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
                gap: 2,
              }}
            >
              {photos.map((photo, i) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={i}
                  onOpen={() => setLightboxIndex(i)}
                  onShare={(e) => handleOpenShare(e, photo)}
                  onDelete={() => removePhoto(photo.id)}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* MODAL DA CÂMERA */}
        <CameraModal
          open={cameraOpen}
          onClose={() => setCameraOpen(false)}
          onCapture={addPhoto}
          onSnack={showSnack}
        />

        {/* LIGHTBOX */}
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
          onShare={(e) => {
            if (lightboxIndex !== null) {
              handleOpenShare(e, photos[lightboxIndex]);
            }
          }}
        />

        {/* MENU DE PARTILHA */}
        <ShareMenu
          anchorEl={shareMenuAnchor}
          photo={shareTarget}
          onClose={handleCloseShare}
          onSnack={showSnack}
        />

        {/* SNACKBAR */}
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

// ============================================================================
// PHOTO CARD — item individual da galeria
// ============================================================================
function PhotoCard({ photo, index, onOpen, onShare, onDelete }) {
  const theme = useTheme();
  const filter = FILTERS.find((f) => f.id === photo.filterId) || FILTERS[0];

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      sx={{
        position: 'relative',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 10px 26px rgba(15,23,42,0.16)',
        cursor: 'pointer',
        aspectRatio: '3 / 4',
        backgroundColor: theme.palette.grey[100],
      }}
      onClick={onOpen}
    >
      {/* Imagem com filtro */}
      <Box
        component="img"
        src={photo.url}
        alt={photo.caption || 'Foto do casamento'}
        loading="lazy"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: filter.cssFilter,
        }}
      />
      {/* Overlay gradiente */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: filter.overlayGradient,
          pointerEvents: 'none',
        }}
      />
      {/* Frame dourado para o filtro classic */}
      {filter.style === 'gold' && (
        <Box
          sx={{
            position: 'absolute',
            inset: 8,
            border: `2px solid ${filter.frameColor}AA`,
            borderRadius: '.5rem',
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Badge do filtro + privacidade */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          display: 'flex',
          gap: 0.5,
          flexWrap: 'wrap',
        }}
      >
        <Chip
          size="small"
          label={filter.name}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(4px)',
            fontSize: '.7rem',
            height: 22,
            fontWeight: 600,
          }}
        />
        {photo.visibility === 'admin' && (
          <Chip
            size="small"
            icon={<LockIcon sx={{ fontSize: '14px !important' }} />}
            label="Só noivos"
            sx={{
              backgroundColor: 'rgba(20,30,45,0.85)',
              color: '#fff',
              fontSize: '.7rem',
              height: 22,
              fontWeight: 500,
            }}
          />
        )}
      </Box>
      {/* Data no rodapé */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 1.5,
          background:
            'linear-gradient(180deg, transparent, rgba(0,0,0,0.65))',
          color: '#fff',
          pointerEvents: 'none',
        }}
      >
        <Typography
          sx={{
            fontSize: '.72rem',
            opacity: 0.92,
            fontWeight: 500,
            lineHeight: 1.3,
          }}
        >
          {photo.authorName || 'Convidado'}
        </Typography>
        {photo.caption && (
          <Typography
            sx={{
              fontSize: '.78rem',
              opacity: 0.95,
              mt: 0.3,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {photo.caption}
          </Typography>
        )}
      </Box>
      {/* Botão partilhar (aparece no hover) */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 0.5,
          opacity: 0,
          transition: 'opacity .25s ease',
          '& .MuiIconButton-root': {
            backgroundColor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(4px)',
            width: 32,
            height: 32,
            '&:hover': { backgroundColor: '#fff' },
          },
        }}
        className="photo-actions"
      />
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          opacity: 0,
          transition: 'opacity .25s ease',
          '&:hover': { opacity: 1 },
        }}
      />
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 0.5,
          opacity: 0,
          transition: 'opacity .25s ease',
          '.photo-card-root:hover &': { opacity: 1 },
        }}
      >
        <IconButton
          size="small"
          aria-label="Partilhar"
          onClick={(e) => {
            e.stopPropagation();
            onShare(e);
          }}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(4px)',
            width: 32,
            height: 32,
            '&:hover': { backgroundColor: '#fff' },
          }}
        >
          <ShareIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Apagar"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(4px)',
            width: 32,
            height: 32,
            '&:hover': { backgroundColor: '#fff', color: 'error.main' },
          }}
        >
          <DeleteIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </MotionBox>
  );
}

// ============================================================================
// CAMERA MODAL — câmara + seleção de filtro + upload Cloudinary
// ============================================================================
function CameraModal({ open, onClose, onCapture, onSnack }) {
  const theme = useTheme();
  const { user } = useContext(AppContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [step, setStep] = useState('camera'); // 'camera' | 'preview' | 'uploading'
  const [filterId, setFilterId] = useState('classic');
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState('all'); // 'all' | 'admin'
  const [capturedDataUrl, setCapturedDataUrl] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [cameraError, setCameraError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const selectedFilter = FILTERS.find((f) => f.id === filterId) || FILTERS[0];

  // Inicia a câmara
  const startCamera = useCallback(async () => {
    setCameraError('');
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1080 },
          height: { ideal: 1350 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.error('Erro ao abrir câmara:', err);
      setCameraError(
        'Não foi possível aceder à câmara. Verifica as permissões do navegador.',
      );
    }
  }, [facingMode]);

  // Para a câmara
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  // Inicia/para quando o modal abre/fecha
  useEffect(() => {
    if (open) {
      setStep('camera');
      setCapturedDataUrl(null);
      setCaption('');
      setVisibility('all');
      setFilterId('classic');
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [open, startCamera, stopCamera]);

  // Alternar câmara frontal/traseira
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Aplica o filtro ao frame e tira a foto
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Tamanho do canvas — proporção 4:5 (ideal para Instagram)
    const targetW = 1080;
    const targetH = 1350;
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Espelhar vídeo se for câmara frontal (selfie)
    if (facingMode === 'user') {
      ctx.translate(targetW, 0);
      ctx.scale(-1, 1);
    }

    // Desenha o frame do vídeo centrado (cover)
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return;

    const videoRatio = vw / vh;
    const canvasRatio = targetW / targetH;
    let drawW = targetW;
    let drawH = targetH;
    let drawX = 0;
    let drawY = 0;

    if (videoRatio > canvasRatio) {
      // vídeo mais largo — cortar laterais
      drawW = targetH * videoRatio;
      drawX = (targetW - drawW) / 2;
    } else {
      // vídeo mais alto — cortar topo/fundo
      drawH = targetW / videoRatio;
      drawY = (targetH - drawH) / 2;
    }

    ctx.drawImage(video, drawX, drawY, drawW, drawH);
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset

    // Aplica filtro CSS ao canvas
    ctx.filter = selectedFilter.cssFilter;
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none';

    // Adiciona overlay (gradiente + moldura + texto)
    drawFrame(ctx, targetW, targetH, selectedFilter);

    // Converte para data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedDataUrl(dataUrl);
    setStep('preview');
    stopCamera();
  };

  // Repetir foto
  const handleRetake = () => {
    setCapturedDataUrl(null);
    setStep('camera');
    startCamera();
  };

  // Upload para Cloudinary
  const handleUpload = async () => {
    if (!capturedDataUrl) return;
    setStep('uploading');
    setUploadProgress(0);

    try {
      // Converte data URL para File
      const blob = await (await fetch(capturedDataUrl)).blob();
      const file = new File([blob], `cc_${Date.now()}.jpg`, { type: 'image/jpeg' });

      // Metadata em tags do Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', CLOUDINARY_FOLDER);
      formData.append(
        'tags',
        `carolinaecarlos,vip-photos,${filterId},visibility-${visibility}`,
      );
      formData.append('context', JSON.stringify({
        author: user?.name || 'Convidado',
        caption: caption || '',
        visibility,
        filter: filterId,
      }));

      // Faz upload com XHR para acompanhar progresso
      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', CLOUDINARY_UPLOAD_URL, true);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (e) {
              reject(new Error('Resposta inválida do Cloudinary'));
            }
          } else {
            reject(new Error(`Erro ${xhr.status}: ${xhr.statusText}`));
          }
        };
        xhr.onerror = () => reject(new Error('Erro de rede no upload'));
        xhr.send(formData);
      });

      const finalUrl = result.secure_url || result.url;

      // Adiciona à galeria local
      onCapture({
        id: `photo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        url: finalUrl,
        thumbnailUrl:
          result.eager && result.eager[0]
            ? result.eager[0].secure_url
            : finalUrl,
        filterId,
        caption: caption.trim(),
        visibility,
        authorName: user?.name || 'Convidado',
        authorEmail: user?.email || '',
        createdAt: new Date().toISOString(),
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      });

      onSnack('Foto partilhada com sucesso! 🎉', 'success');

      // Fecha o modal após pequena pausa
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      console.error('Erro no upload:', err);
      setStep('preview');
      onSnack(
        'Não foi possível enviar a foto. Tenta novamente.',
        'error',
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={step === 'uploading' ? undefined : onClose}
      fullScreen={isMobile}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : '1.5rem',
          overflow: 'hidden',
          maxHeight: isMobile ? '100vh' : '90vh',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          backgroundColor: '#0a0e14',
          color: '#fff',
          minHeight: isMobile ? '100vh' : 'auto',
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CameraAltIcon sx={{ color: SALMON }} />
            <Typography
              sx={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 600,
                fontSize: '1.1rem',
              }}
            >
              {step === 'camera' && 'Tirar foto'}
              {step === 'preview' && 'Rever foto'}
              {step === 'uploading' && 'A enviar...'}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            disabled={step === 'uploading'}
            sx={{
              color: '#fff',
              backgroundColor: 'rgba(255,255,255,0.10)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.20)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* CONTEÚDO POR STEP */}
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* STEP 1: CÂMARA */}
          {step === 'camera' && (
            <>
              {/* Frame da câmara */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 480,
                  aspectRatio: '4 / 5',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  backgroundColor: '#000',
                  mb: 2,
                  boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                }}
              >
                {cameraError ? (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 3,
                      textAlign: 'center',
                    }}
                  >
                    <Box>
                      <CameraAltIcon
                        sx={{ fontSize: 56, opacity: 0.4, mb: 2 }}
                      />
                      <Typography
                        sx={{ fontSize: '.92rem', opacity: 0.85, lineHeight: 1.6 }}
                      >
                        {cameraError}
                      </Typography>
                      <Button
                        size="small"
                        onClick={startCamera}
                        sx={{
                          mt: 2,
                          color: SALMON,
                          borderColor: SALMON,
                        }}
                        variant="outlined"
                      >
                        Tentar novamente
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform:
                          facingMode === 'user' ? 'scaleX(-1)' : 'none',
                        filter: selectedFilter.cssFilter,
                      }}
                    />
                    {/* Overlay do filtro (preview ao vivo) */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: selectedFilter.overlayGradient,
                        pointerEvents: 'none',
                      }}
                    />
                    {/* Frame dourado para o filtro classic */}
                    {selectedFilter.style === 'gold' && (
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: '4%',
                          border: `2px solid ${selectedFilter.frameColor}AA`,
                          borderRadius: '.5rem',
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                    {/* Label no topo */}
                    {selectedFilter.label && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 16,
                          left: 0,
                          right: 0,
                          textAlign: 'center',
                          pointerEvents: 'none',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: 'Playfair Display, serif',
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            color: '#fff',
                            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                            letterSpacing: '.12em',
                          }}
                        >
                          {selectedFilter.label}
                        </Typography>
                      </Box>
                    )}
                    {/* Botão flip câmara */}
                    <IconButton
                      onClick={handleFlipCamera}
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: '#fff',
                        backdropFilter: 'blur(4px)',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.65)' },
                      }}
                    >
                      <SwitchCameraIcon />
                    </IconButton>
                  </>
                )}
              </Box>

              {/* Seletor de filtro */}
              <Typography
                variant="caption"
                sx={{
                  textTransform: 'uppercase',
                  letterSpacing: '.18em',
                  opacity: 0.6,
                  mb: 1.5,
                }}
              >
                Escolhe um filtro
              </Typography>
              <ToggleButtonGroup
                value={filterId}
                exclusive
                onChange={(e, val) => val && setFilterId(val)}
                sx={{
                  mb: 3,
                  flexWrap: 'wrap',
                  '& .MuiToggleButtonGroup-grouped': {
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: '999px !important',
                    mr: 1,
                    mb: 1,
                    px: 2,
                    py: 0.8,
                    color: '#fff',
                    textTransform: 'none',
                    fontSize: '.85rem',
                    '&.Mui-selected': {
                      backgroundColor: SALMON,
                      color: '#fff',
                      borderColor: SALMON,
                      '&:hover': { backgroundColor: SALMON },
                    },
                  },
                }}
              >
                {FILTERS.map((f) => (
                  <ToggleButton key={f.id} value={f.id}>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}
                    >
                      {f.icon}
                      {f.name}
                    </Box>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              {/* Botão capturar */}
              <Button
                variant="contained"
                size="large"
                onClick={handleCapture}
                disabled={!!cameraError}
                startIcon={<CameraAltIcon />}
                disableElevation
                sx={{
                  borderRadius: '999px',
                  background: `linear-gradient(135deg, ${theme.palette.custom?.brand600}, ${SALMON})`,
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  px: 5,
                  py: 1.3,
                  '&:hover': { transform: 'translateY(-1px)' },
                  transition: 'all .25s ease',
                }}
              >
                Capturar
              </Button>
            </>
          )}

          {/* STEP 2: PREVIEW */}
          {step === 'preview' && capturedDataUrl && (
            <>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 400,
                  aspectRatio: '4 / 5',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  mb: 3,
                  boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                }}
              >
                <Box
                  component="img"
                  src={capturedDataUrl}
                  alt="Pré-visualização"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>

              {/* Trocar filtro (reaplica em nova renderização) */}
              <Typography
                variant="caption"
                sx={{
                  textTransform: 'uppercase',
                  letterSpacing: '.18em',
                  opacity: 0.6,
                  mb: 1.5,
                }}
              >
                Filtro aplicado
              </Typography>
              <Chip
                icon={selectedFilter.icon}
                label={selectedFilter.name}
                sx={{
                  mb: 3,
                  backgroundColor: 'rgba(255,255,255,0.10)',
                  color: '#fff',
                  borderRadius: '999px',
                  fontWeight: 500,
                  border: '1px solid rgba(255,255,255,0.18)',
                }}
              />

              {/* Legenda */}
              <TextField
                label="Legenda (opcional)"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                fullWidth
                multiline
                rows={2}
                sx={{
                  mb: 2.5,
                  maxWidth: 480,
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.32)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                }}
              />

              {/* Visibilidade */}
              <Typography
                variant="caption"
                sx={{
                  textTransform: 'uppercase',
                  letterSpacing: '.18em',
                  opacity: 0.6,
                  mb: 1.5,
                  display: 'block',
                }}
              >
                Quem pode ver?
              </Typography>
              <ToggleButtonGroup
                value={visibility}
                exclusive
                onChange={(e, val) => val && setVisibility(val)}
                sx={{
                  mb: 3,
                  '& .MuiToggleButtonGroup-grouped': {
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: '999px !important',
                    mr: 1,
                    px: 2.5,
                    py: 1,
                    color: '#fff',
                    textTransform: 'none',
                    fontSize: '.85rem',
                    '&.Mui-selected': {
                      backgroundColor: SALMON,
                      color: '#fff',
                      borderColor: SALMON,
                      '&:hover': { backgroundColor: SALMON },
                    },
                  },
                }}
              >
                <ToggleButton value="all">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <PublicIcon sx={{ fontSize: 18 }} />
                    Todos
                  </Box>
                </ToggleButton>
                <ToggleButton value="admin">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <LockIcon sx={{ fontSize: 18 }} />
                    Só os noivos
                  </Box>
                </ToggleButton>
              </ToggleButtonGroup>

              {/* Ações */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleRetake}
                  sx={{
                    borderRadius: '999px',
                    borderColor: 'rgba(255,255,255,0.32)',
                    color: '#fff',
                    textTransform: 'none',
                    px: 3,
                    '&:hover': {
                      borderColor: '#fff',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                    },
                  }}
                >
                  Repetir
                </Button>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  startIcon={<CheckCircleIcon />}
                  disableElevation
                  sx={{
                    borderRadius: '999px',
                    background: `linear-gradient(135deg, ${theme.palette.custom?.brand600}, ${SALMON})`,
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    '&:hover': { transform: 'translateY(-1px)' },
                    transition: 'all .25s ease',
                  }}
                >
                  Partilhar foto
                </Button>
              </Box>
            </>
          )}

          {/* STEP 3: UPLOADING */}
          {step === 'uploading' && (
            <Box
              sx={{
                py: 6,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <CircularProgress
                size={64}
                sx={{ color: SALMON, mb: 3 }}
              />
              <Typography
                sx={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.3rem',
                  mb: 1,
                }}
              >
                A enviar a tua foto...
              </Typography>
              <Typography sx={{ opacity: 0.7, fontSize: '.9rem', mb: 2 }}>
                {uploadProgress}% concluído
              </Typography>
              <Box
                sx={{
                  width: 240,
                  height: 6,
                  borderRadius: '999px',
                  backgroundColor: 'rgba(255,255,255,0.10)',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${theme.palette.custom?.brand600}, ${SALMON})`,
                    transition: 'width .2s ease',
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* Canvas oculto para captura */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </Box>
    </Dialog>
  );
}

// ============================================================================
// DRAW FRAME — desenha overlay, moldura e texto no canvas
// ============================================================================
function drawFrame(ctx, w, h, filter) {
  // Overlay gradiente
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(20,30,45,0.15)');
  grad.addColorStop(0.25, 'rgba(0,0,0,0)');
  grad.addColorStop(0.75, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(20,30,45,0.30)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  if (filter.style === 'gold') {
    // Moldura dourada
    ctx.strokeStyle = filter.frameColor + 'CC';
    ctx.lineWidth = 4;
    ctx.strokeRect(w * 0.04, h * 0.04, w * 0.92, h * 0.92);

    // Brilho de glitter nos cantos
    drawGlitter(ctx, w * 0.04, h * 0.04, w * 0.08, h * 0.08, filter.frameColor);
    drawGlitter(ctx, w * 0.88, h * 0.04, w * 0.08, h * 0.08, filter.frameColor);
    drawGlitter(ctx, w * 0.04, h * 0.88, w * 0.08, h * 0.08, filter.frameColor);
    drawGlitter(ctx, w * 0.88, h * 0.88, w * 0.08, h * 0.08, filter.frameColor);
  }

  if (filter.style === 'celebration') {
    // Glitter denso em todo o frame
    drawGlitter(ctx, 0, 0, w, h * 0.15, filter.frameColor, 80);
    drawGlitter(ctx, 0, h * 0.85, w, h * 0.15, filter.frameColor, 80);

    // Corações dourados
    drawHearts(ctx, w, h, filter.frameColor, 12);
  }

  if (filter.style === 'navy') {
    // Top border navy
    ctx.fillStyle = 'rgba(30,58,82,0.55)';
    ctx.fillRect(0, 0, w, h * 0.10);
    drawGlitter(ctx, 0, h * 0.08, w, h * 0.04, filter.frameColor, 30);

    // Botânico nos cantos
    drawBotanical(ctx, w * 0.02, h * 0.02, 80, filter.frameColor);
    drawBotanical(ctx, w * 0.98 - 80, h * 0.02, 80, filter.frameColor);
  }

  // Texto inferior (data)
  if (filter.label) {
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 3;
    ctx.font = `600 ${Math.round(h * 0.035)}px "Playfair Display", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    const text = filter.label;
    const y = h - h * 0.05;
    ctx.strokeText(text, w / 2, y);
    ctx.fillText(text, w / 2, y);
    ctx.restore();
  }

  // Sub-label (C&C / Celebrando C&C)
  if (filter.sublabel) {
    ctx.save();
    ctx.fillStyle = filter.frameColor;
    ctx.font = `500 ${Math.round(h * 0.022)}px "Playfair Display", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(filter.sublabel, w / 2, h - h * 0.02);
    ctx.restore();
  }
}

function drawGlitter(ctx, x, y, w, h, color, count = 25) {
  ctx.save();
  ctx.fillStyle = color;
  // Pseudo-random estável por contagem
  let seed = 12345;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < count; i++) {
    const px = x + rand() * w;
    const py = y + rand() * h;
    const size = 1 + rand() * 3;
    ctx.globalAlpha = 0.4 + rand() * 0.6;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawHearts(ctx, w, h, color, count = 10) {
  ctx.save();
  ctx.fillStyle = color;
  let seed = 54321;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < count; i++) {
    const px = rand() * w;
    const py = rand() * h * 0.12;
    const size = 6 + rand() * 8;
    ctx.globalAlpha = 0.5 + rand() * 0.5;
    drawHeart(ctx, px, py, size);
  }
  // Cantos inferiores
  for (let i = 0; i < count / 2; i++) {
    const px = rand() * w;
    const py = h * 0.88 + rand() * h * 0.10;
    const size = 6 + rand() * 8;
    ctx.globalAlpha = 0.5 + rand() * 0.5;
    drawHeart(ctx, px, py, size);
  }
  ctx.restore();
}

function drawHeart(ctx, x, y, size) {
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  // Curva esquerda
  ctx.bezierCurveTo(
    x, y,
    x - size / 2, y,
    x - size / 2, y + topCurveHeight,
  );
  ctx.bezierCurveTo(
    x - size / 2, y + (size + topCurveHeight) / 2,
    x, y + (size + topCurveHeight) / 2,
    x, y + size,
  );
  ctx.bezierCurveTo(
    x, y + (size + topCurveHeight) / 2,
    x + size / 2, y + (size + topCurveHeight) / 2,
    x + size / 2, y + topCurveHeight,
  );
  ctx.bezierCurveTo(
    x + size / 2, y,
    x, y,
    x, y + topCurveHeight,
  );
  ctx.closePath();
  ctx.fill();
}

function drawBotanical(ctx, x, y, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.75;

  // Hastes
  ctx.beginPath();
  ctx.moveTo(x, y + size);
  ctx.quadraticCurveTo(x + size * 0.4, y + size * 0.5, x + size * 0.9, y);
  ctx.stroke();

  // Folhas
  for (let i = 0; i < 4; i++) {
    const t = 0.2 + i * 0.2;
    const px = x + size * 0.4 * t + size * 0.5 * t;
    const py = y + size * (1 - t * 0.7);
    const leafSize = size * 0.15;
    ctx.beginPath();
    ctx.ellipse(px, py, leafSize, leafSize * 0.5, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ============================================================================
// LIGHTBOX — visualização ampliada
// ============================================================================
function Lightbox({ photos, index, onClose, onNavigate, onShare }) {
  if (index === null || !photos[index]) return null;
  const photo = photos[index];
  const filter = FILTERS.find((f) => f.id === photo.filterId) || FILTERS[0];

  const handlePrev = () => onNavigate((index - 1 + photos.length) % photos.length);
  const handleNext = () => onNavigate((index + 1) % photos.length);

  return (
    <Dialog
      open={index !== null}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0,0,0,0.95)',
          backgroundImage: 'none',
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
        {/* Botão fechar */}
        <IconButton
          onClick={onClose}
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

        {/* Botão partilhar */}
        <IconButton
          onClick={onShare}
          aria-label="Partilhar"
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            color: '#fff',
            backgroundColor: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(6px)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.22)' },
            zIndex: 2,
          }}
        >
          <ShareIcon />
        </IconButton>

        {/* Navegação seta esquerda */}
        {photos.length > 1 && (
          <IconButton
            onClick={handlePrev}
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
            <CloseIcon sx={{ transform: 'rotate(135deg)' }} />
          </IconButton>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={photo.id}
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
              src={photo.url}
              alt={photo.caption || 'Foto do casamento'}
              sx={{
                maxWidth: '90vw',
                maxHeight: '78vh',
                objectFit: 'contain',
                borderRadius: 2,
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              }}
            />
            <Box sx={{ color: '#fff', mt: 2, textAlign: 'center', maxWidth: 600 }}>
              <Typography sx={{ fontSize: '.9rem', opacity: 0.85, mb: 0.5 }}>
                <strong>{photo.authorName}</strong> · filtro {filter.name}
              </Typography>
              {photo.caption && (
                <Typography sx={{ fontSize: '.95rem', opacity: 0.95, mb: 0.5 }}>
                  {photo.caption}
                </Typography>
              )}
              <Typography sx={{ fontSize: '.8rem', opacity: 0.6 }}>
                {index + 1} / {photos.length}
              </Typography>
            </Box>
          </motion.div>
        </AnimatePresence>

        {/* Navegação seta direita */}
        {photos.length > 1 && (
          <IconButton
            onClick={handleNext}
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
            <CloseIcon sx={{ transform: 'rotate(-45deg)' }} />
          </IconButton>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// SHARE MENU — menu de partilha para WhatsApp / Instagram / Facebook / TikTok
// ============================================================================
function ShareMenu({ anchorEl, photo, onClose, onSnack }) {
  if (!photo) return null;

  const shareUrl = photo.url;
  const shareText = `Foto do casamento Carolina & Carlos — 21.06.2026${
    photo.caption ? `\n\n${photo.caption}` : ''
  }`;

  const handleDownload = async () => {
    try {
      const response = await fetch(shareUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `casamento-carolina-carlos-${photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onSnack('Foto descarregada.', 'success');
    } catch (err) {
      console.error('Erro no download:', err);
      onSnack('Não foi possível descarregar a foto.', 'error');
    }
    onClose();
  };

  const handleWhatsApp = () => {
    // WhatsApp — abre conversa para partilhar; usuário pode escolher "Status"
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onSnack('Abre o WhatsApp e escolhe partilhar no Estado.', 'info');
    onClose();
  };

  const handleInstagram = () => {
    // Instagram não permite partilha direta por URL — orienta o utilizador
    navigator.clipboard
      ?.writeText(shareUrl)
      .then(() => {
        onSnack(
          'Link copiado! Abre o Instagram, cola no teu Story ou publicação.',
          'info',
        );
      })
      .catch(() => {
        onSnack('Copia o link e partilha no Instagram.', 'info');
      });
    setTimeout(() => {
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    }, 600);
    onClose();
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl,
    )}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleTikTok = () => {
    // TikTok não tem API de partilha directa para vídeo externo
    // Para vídeo: copia o link e orienta o utilizador
    // Para foto: orienta descarregar e subir manualmente
    const isVideo = photo.url && photo.url.match(/\.(mp4|mov|webm)$/i);
    if (isVideo) {
      navigator.clipboard
        ?.writeText(shareUrl)
        .then(() => {
          onSnack(
            'Link do vídeo copiado! Abre o TikTok para subir o vídeo.',
            'info',
          );
        })
        .catch(() => {
          onSnack('Copia o link e partilha no TikTok.', 'info');
        });
      setTimeout(() => {
        window.open('https://www.tiktok.com/upload', '_blank', 'noopener,noreferrer');
      }, 600);
    } else {
      handleDownload();
      onSnack(
        'Descarrega a foto e abre o TikTok para a partilhares.',
        'info',
      );
      setTimeout(() => {
        window.open('https://www.tiktok.com/upload', '_blank', 'noopener,noreferrer');
      }, 1000);
    }
    onClose();
  };

  const handleWebShare = async () => {
    // Web Share API — funciona bem em mobile (abre o sheet nativo)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Casamento Carolina & Carlos',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // usuário cancelou — não fazer nada
      }
    } else {
      // Fallback: copia link
      navigator.clipboard?.writeText(shareUrl);
      onSnack('Link copiado para a área de transferência.', 'success');
    }
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '1rem',
          mt: 1,
          minWidth: 220,
          boxShadow: '0 12px 32px rgba(15,23,42,0.20)',
        },
      }}
    >
      <MenuItem onClick={handleWebShare} sx={{ py: 1.2 }}>
        <ListItemIcon>
          <ShareIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Partilhar..." secondary="Sheet nativo do dispositivo" />
      </MenuItem>
      <MenuItem onClick={handleWhatsApp} sx={{ py: 1.2 }}>
        <ListItemIcon>
          <WhatsAppIcon fontSize="small" sx={{ color: '#25D366' }} />
        </ListItemIcon>
        <ListItemText primary="WhatsApp" secondary="Estado ou conversa" />
      </MenuItem>
      <MenuItem onClick={handleInstagram} sx={{ py: 1.2 }}>
        <ListItemIcon>
          <InstagramIcon fontSize="small" sx={{ color: '#E1306C' }} />
        </ListItemIcon>
        <ListItemText primary="Instagram" secondary="Story ou feed" />
      </MenuItem>
      <MenuItem onClick={handleFacebook} sx={{ py: 1.2 }}>
        <ListItemIcon>
          <FacebookIcon fontSize="small" sx={{ color: '#1877F2' }} />
        </ListItemIcon>
        <ListItemText primary="Facebook" secondary="Partilha pública" />
      </MenuItem>
      <MenuItem onClick={handleTikTok} sx={{ py: 1.2 }}>
        <ListItemIcon>
          <MusicNoteIcon fontSize="small" sx={{ color: '#000' }} />
        </ListItemIcon>
        <ListItemText primary="TikTok" secondary="Vídeo ou foto" />
      </MenuItem>
      <MenuItem onClick={handleDownload} sx={{ py: 1.2 }}>
        <ListItemIcon>
          <DownloadIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Descarregar" />
      </MenuItem>
    </Menu>
  );
}
