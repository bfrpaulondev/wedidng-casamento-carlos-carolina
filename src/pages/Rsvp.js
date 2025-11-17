// src/pages/Rsvp.js
import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  IconButton,
  Divider,
  Snackbar,
  Alert,
  Tooltip,
  Badge,
  useTheme,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  HighlightOff,
  Group,
  PendingActions,
  InfoOutlined,
} from '@mui/icons-material';
import confetti from 'canvas-confetti';

import { AppContext } from '../contexts/AppContext';
import Gate from '../components/Gate';

const MotionBox = motion(Box);

export default function Rsvp() {
  const theme = useTheme();
  const {
    user,
    isAdmin,
    rsvps,
    myRsvp,
    addRsvp,
    updateRsvpStatus,
    fetchAdminRsvps,
    refreshMyRsvpFromStorage,
  } = useContext(AppContext);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [showApprovedList, setShowApprovedList] = useState(true);
  const envelopeRef = useRef(null);

  const pendingRsvps = (rsvps || []).filter((r) => r.status === 'PENDING');
  const approvedRsvps = (rsvps || []).filter((r) => r.status === 'APPROVED');

  useEffect(() => {
    refreshMyRsvpFromStorage();
  }, [refreshMyRsvpFromStorage]);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminRsvps();
    }
  }, [isAdmin, fetchAdminRsvps]);

  const handleNewRsvp = async (data) => {
    const created = await addRsvp(data);

    setSnackbar({
      open: true,
      message:
        'Pedido enviado com sucesso! Agora é só aguardar a aprovação dos noivos.',
      severity: 'success',
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    return created;
  };

  const handleUpdateStatus = async (id, status) => {
    await updateRsvpStatus(id, status);

    setSnackbar({
      open: true,
      message:
        status === 'APPROVED'
          ? 'Presença aprovada.'
          : status === 'REJECTED'
          ? 'Pedido marcado como não aprovado.'
          : 'Status atualizado.',
      severity: 'info',
    });
  };

  const envelopeBgTop =
    theme.palette.custom?.brand50 || theme.palette.background.paper;
  const envelopeBgBottom =
    theme.palette.custom?.brand100 || theme.palette.grey[100];
  const accent = theme.palette.custom?.brand600 || theme.palette.primary.main;

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
              py: { xs: 6, md: 10 },
              px: { xs: 2, md: 4 },
              background: `radial-gradient(circle at top, ${envelopeBgTop} 0, ${theme.palette.background.default} 45%, ${theme.palette.background.paper} 100%)`,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 1100 }}>
              <MotionBox
                ref={envelopeRef}
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                sx={{
                  position: 'relative',
                  borderRadius: '1.75rem',
                  overflow: 'hidden',
                  boxShadow: '0 18px 45px rgba(15,23,42,0.18)',
                  background: `linear-gradient(145deg, ${envelopeBgTop}, ${envelopeBgBottom})`,
                  px: { xs: 2.5, md: 4 },
                  pt: { xs: 4, md: 5 },
                  pb: { xs: 4.5, md: 5.5 },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.18,
                    backgroundImage: `radial-gradient(circle at 0 0, ${accent}, transparent 60%), radial-gradient(circle at 100% 100%, ${theme.palette.secondary.main}, transparent 55%)`,
                    pointerEvents: 'none',
                  }}
                />

                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '52%',
                    background: `linear-gradient(180deg, ${theme.palette.common.white}, transparent 80%)`,
                    clipPath: 'polygon(0 0, 100% 0, 50% 94%)',
                    opacity: 0.8,
                    pointerEvents: 'none',
                  }}
                />

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <HeaderSection pendingRsvps={pendingRsvps} isAdmin={isAdmin} />

                  <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                      <RsvpForm onSubmit={handleNewRsvp} isAdmin={isAdmin} />
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2.5,
                        }}
                      >
                        <RsvpStatusCard myRsvp={myRsvp || myRsvp} />

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mt: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            Lista de convidados confirmados
                          </Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={showApprovedList}
                                onChange={(e) =>
                                  setShowApprovedList(e.target.checked)
                                }
                                size="small"
                              />
                            }
                            label={
                              <Typography
                                sx={{
                                  fontSize: '.8rem',
                                  color: theme.palette.text.secondary,
                                }}
                              >
                                Mostrar
                              </Typography>
                            }
                            sx={{ m: 0 }}
                          />
                        </Box>

                        <AnimatePresence initial={false}>
                          {showApprovedList && (
                            <motion.div
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.25 }}
                            >
                              <RsvpList approvedRsvps={approvedRsvps} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Box>
                    </Grid>
                  </Grid>

                  {isAdmin && (
                    <>
                      <Divider
                        sx={{
                          my: 4,
                          borderColor: `${
                            theme.palette.custom?.brand200 ||
                            theme.palette.divider
                          }80`,
                        }}
                      />
                      <ModerationPanel
                        rsvps={pendingRsvps}
                        onUpdateStatus={handleUpdateStatus}
                      />
                    </>
                  )}
                </Box>
              </MotionBox>

              <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                  setSnackbar((s) => ({ ...s, open: false }))
                }
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
              >
                <Alert
                  onClose={() =>
                    setSnackbar((s) => ({ ...s, open: false }))
                  }
                  severity={snackbar.severity}
                  variant="filled"
                  sx={{ borderRadius: '999px' }}
                >
                  {snackbar.message}
                </Alert>
              </Snackbar>
            </Box>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
}

function HeaderSection({ pendingRsvps, isAdmin }) {
  const theme = useTheme();
  const accent = theme.palette.custom?.brand600 || theme.palette.primary.main;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2,
        mb: 4,
      }}
    >
      <Box>
        <Typography
          variant="overline"
          sx={{
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color:
              theme.palette.custom?.brand500 ||
              theme.palette.text.secondary,
            fontSize: '.72rem',
          }}
        >
          Confirmar Presença
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Playfair Display, serif',
            color: theme.palette.text.primary,
            mt: 0.5,
          }}
        >
          Carolina & Carlos
        </Typography>
        <Typography
          sx={{
            mt: 1,
            maxWidth: 480,
            fontSize: '.92rem',
            color: theme.palette.text.secondary,
          }}
        >
          Um envelope digital para receber quem vai celebrar connosco o
          grande dia. Preenche com carinho.
        </Typography>
      </Box>

      <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
        <Badge
          color={pendingRsvps.length > 0 ? 'warning' : 'success'}
          badgeContent={pendingRsvps.length}
          overlap="rectangular"
        >
          <Chip
            icon={<PendingActions fontSize="small" />}
            label={
              isAdmin
                ? pendingRsvps.length > 0
                  ? `${pendingRsvps.length} pedidos pendentes`
                  : 'Sem pedidos pendentes'
                : 'Sujeito à aprovação dos noivos'
            }
            size="small"
            sx={{
              backgroundColor:
                pendingRsvps.length > 0
                  ? `${theme.palette.warning.light}40`
                  : `${theme.palette.success.light}40`,
              color: theme.palette.text.secondary,
            }}
          />
        </Badge>

        {isAdmin && (
          <Typography
            sx={{
              mt: 1,
              fontSize: '.8rem',
              color: theme.palette.text.secondary,
            }}
          >
            Modo noivos ativo. Abaixo, podes aprovar ou recusar os pedidos
            de presença.
          </Typography>
        )}

        <Box
          sx={{
            mt: 1,
            display: 'flex',
            justifyContent: {
              xs: 'flex-start',
              md: 'flex-end',
            },
          }}
        >
          <Tooltip title="Pessoas não convidadas podem pedir presença; cabe aos noivos aceitar ou não.">
            <IconButton size="small" sx={{ color: accent }}>
              <InfoOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}

function RsvpForm({ onSubmit, isAdmin }) {
  const theme = useTheme();
  const [values, setValues] = useState({
    name: '',
    guests: 1,
    message: '',
    dietary: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const disabled = isAdmin;

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = 'Nome é obrigatório.';
    if (!values.guests || Number(values.guests) < 1) {
      e.guests = 'Informe pelo menos 1 pessoa.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (event) => {
    const value =
      field === 'guests'
        ? event.target.value.replace(/\D/g, '')
        : event.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (disabled) return;
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        ...values,
        guests: Number(values.guests) || 1,
      });
    } catch (err) {}
    setSubmitting(false);
  };

  return (
    <MotionBox
      component="form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      sx={{
        position: 'relative',
        borderRadius: '1.25rem',
        backgroundColor: `${theme.palette.common.white}E6`,
        boxShadow: '0 10px 30px rgba(15,23,42,0.12)`,
        p: { xs: 2.5, md: 3 },
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 0 0, ${
            theme.palette.custom?.brand100 || theme.palette.grey[100]
          }, transparent 55%)`,
          opacity: 0.7,
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 1.5,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          Envelope de Presença
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: theme.palette.text.secondary,
          }}
        >
          Preenche os teus dados para pedir presença no nosso casamento.
          A confirmação final será feita pelos noivos.
        </Typography>

        {isAdmin && (
          <Alert
            severity="info"
            sx={{
              mb: 2.5,
              borderRadius: '1rem',
              backgroundColor: `${theme.palette.info.light}16`,
            }}
          >
            Estás em modo noivos (admin). O formulário está desativado; usa
            a área de moderação mais abaixo.
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nome completo"
              fullWidth
              size="small"
              value={values.name}
              onChange={handleChange('name')}
              error={Boolean(errors.name)}
              helperText={errors.name}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Número de pessoas (incluindo você)"
              fullWidth
              size="small"
              value={values.guests}
              onChange={handleChange('guests')}
              error={Boolean(errors.guests)}
              helperText={errors.guests}
              disabled={disabled}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                min: 1,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Restrições alimentares (se houver)"
              fullWidth
              size="small"
              value={values.dietary}
              onChange={handleChange('dietary')}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Mensagem para os noivos (opcional)"
              fullWidth
              size="small"
              multiline
              minRows={3}
              value={values.message}
              onChange={handleChange('message')}
              disabled={disabled}
            />
          </Grid>
        </Grid>

        <Box
          sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}
        >
          <Button
            type="submit"
            disabled={disabled || submitting}
            sx={{
              borderRadius: '999px',
              px: 3.5,
              py: 1,
              textTransform: 'none',
              backgroundColor:
                theme.palette.custom?.brand600 || theme.palette.primary.dark,
              color: '#fff',
              fontWeight: 500,
              '&:hover': {
                backgroundColor:
                  theme.palette.custom?.brand700 ||
                  theme.palette.primary.main,
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 18px rgba(15,23,42,0.18)',
              },
              transition: 'all .22s ease',
            }}
          >
            {submitting ? 'Enviando...' : 'Enviar pedido de presença'}
          </Button>
        </Box>
      </Box>
    </MotionBox>
  );
}

function RsvpStatusCard({ myRsvp }) {
  const theme = useTheme();

  if (!myRsvp) {
    return (
      <Box
        sx={{
          borderRadius: '1.1rem',
          backgroundColor: `${theme.palette.common.white}D8`,
          boxShadow: '0 8px 24px rgba(15,23,42,0.12)`,
          p: 2.2,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 0.5, color: theme.palette.text.primary }}
        >
          Teu status de presença
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          Assim que enviares o teu pedido de presença, o status aparecerá
          aqui como pendente, aprovado ou não aprovado.
        </Typography>
      </Box>
    );
  }

  const status = myRsvp.status;
  const bg =
    status === 'APPROVED'
      ? `${theme.palette.success.light}26`
      : status === 'REJECTED'
      ? `${theme.palette.error.light}24`
      : `${theme.palette.warning.light}24`;

  const icon =
    status === 'APPROVED' ? (
      <CheckCircle sx={{ color: theme.palette.success.main }} />
    ) : status === 'REJECTED' ? (
      <HighlightOff sx={{ color: theme.palette.error.main }} />
    ) : (
      <PendingActions sx={{ color: theme.palette.warning.main }} />
    );

  const label =
    status === 'APPROVED'
      ? 'Presença aprovada'
      : status === 'REJECTED'
      ? 'Pedido não aprovado'
      : 'Pedido pendente';

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      sx={{
        borderRadius: '1.1rem',
        backgroundColor: bg,
        boxShadow: '0 8px 24px rgba(15,23,42,0.12)`,
        p: 2.2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        {icon}
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: theme.palette.text.primary }}
        >
          {label}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{ color: theme.palette.text.secondary, mb: 0.5 }}
      >
        Nome: <strong>{myRsvp.name}</strong>, pessoas:{' '}
        <strong>{myRsvp.guests}</strong>
      </Typography>
      {myRsvp.message && (
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}
        >
          “{myRsvp.message}”
        </Typography>
      )}

      {status === 'PENDING' && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            color: theme.palette.text.secondary,
          }}
        >
          Assim que os noivos confirmarem, o status será atualizado.
        </Typography>
      )}
      {status === 'APPROVED' && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            color: theme.palette.text.secondary,
          }}
        >
          A tua presença já está na nossa lista. Obrigado por celebrares
          connosco.
        </Typography>
      )}
      {status === 'REJECTED' && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            color: theme.palette.text.secondary,
          }}
        >
          Caso aches que houve algum erro, fala diretamente com os noivos.
        </Typography>
      )}
    </MotionBox>
  );
}

function RsvpList({ approvedRsvps }) {
  const theme = useTheme();

  if (!approvedRsvps || approvedRsvps.length === 0) {
    return (
      <Box
        sx={{
          borderRadius: '1rem',
          backgroundColor: `${theme.palette.common.white}D0`,
          p: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          Assim que os pedidos forem aprovados, os convidados confirmados
          começam a aparecer aqui.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        borderRadius: '1rem',
        backgroundColor: `${theme.palette.common.white}D0`,
        p: 2,
        maxHeight: 260,
        overflow: 'auto',
      }}
    >
      <AnimatePresence>
        {approvedRsvps.map((r, index) => (
          <MotionBox
            key={r._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 1,
              borderBottom:
                index < approvedRsvps.length - 1
                  ? `1px dashed ${theme.palette.divider}`
                  : 'none',
            }}
          >
            <Box sx={{ mr: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                {r.name}
              </Typography>
              {r.message && (
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    display: 'block',
                    maxWidth: 260,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  “{r.message}”
                </Typography>
              )}
            </Box>
            <Chip
              icon={<Group fontSize="small" />}
              label={`${r.guests} ${
                r.guests > 1 ? 'pessoas' : 'pessoa'
              }`}
              size="small"
              sx={{
                backgroundColor: `${
                  theme.palette.custom?.brand50 ||
                  theme.palette.grey[100]
                }B0`,
              }}
            />
          </MotionBox>
        ))}
      </AnimatePresence>
    </Box>
  );
}

function ModerationPanel({ rsvps, onUpdateStatus }) {
  const theme = useTheme();

  if (!rsvps || rsvps.length === 0) {
    return (
      <Box
        sx={{
          borderRadius: '1.25rem',
          backgroundColor: `${theme.palette.common.white}E6`,
          boxShadow: '0 10px 30px rgba(15,23,42,0.12)`,
          p: 2.5,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, mb: 0.5 }}
        >
          Moderação de pedidos
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          No momento não há pedidos pendentes de confirmação.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        borderRadius: '1.25rem',
        backgroundColor: `${theme.palette.common.white}E6`,
        boxShadow: '0 10px 30px rgba(15,23,42,0.12)`,
        p: 2.5,
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, mb: 0.5 }}
      >
        Moderação de pedidos
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: theme.palette.text.secondary, mb: 2.5 }}
      >
        Aqui os noivos veem todos os pedidos de presença que ainda não
        foram aprovados. Podem aceitar ou não, inclusive de quem não foi
        convidado originalmente.
      </Typography>

      <AnimatePresence>
        {rsvps.map((r) => (
          <MotionBox
            key={r._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            sx={{
              borderRadius: '1rem',
              border: `1px solid ${
                theme.palette.custom?.brand200 ||
                theme.palette.divider
              }`,
              p: 1.8,
              mb: 1.5,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              gap: 1.5,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600 }}
              >
                {r.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary, mb: 0.5 }}
              >
                Pessoas: {r.guests}
                {r.dietary && ` • Restrição: ${r.dietary}`}
              </Typography>
              {r.message && (
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Mensagem: “{r.message}”
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: {
                  xs: 'flex-start',
                  md: 'flex-end',
                },
                gap: 1,
              }}
            >
              <Button
                size="small"
                variant="outlined"
                onClick={() => onUpdateStatus(r._id, 'REJECTED')}
                sx={{
                  borderRadius: '999px',
                  borderColor: theme.palette.error.light,
                  color: theme.palette.error.main,
                  textTransform: 'none',
                }}
              >
                Não aprovar
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => onUpdateStatus(r._id, 'APPROVED')}
                sx={{
                  borderRadius: '999px',
                  textTransform: 'none',
                  backgroundColor:
                    theme.palette.custom?.brand600 ||
                    theme.palette.success.main,
                }}
              >
                Aprovar presença
              </Button>
            </Box>
          </MotionBox>
        ))}
      </AnimatePresence>
    </Box>
  );
}
