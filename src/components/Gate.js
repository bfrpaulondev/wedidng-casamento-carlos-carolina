// src/components/Gate.js
import React, { useState, useContext } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  LinearProgress,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { AppContext } from '../contexts/AppContext';

export default function Gate() {
  const theme = useTheme();
  const { login, register, user } = useContext(AppContext);

  const [open, setOpen] = useState(!user);
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pass: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.pass.trim()) newErrors.pass = 'Senha é obrigatória';

    if (mode === 'register') {
      if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
      if (!formData.phone.trim()) newErrors.phone = 'Telemóvel é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setGlobalError('');
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGlobalError('');

    try {
      if (mode === 'login') {
        await login({
          email: formData.email.trim(),
          password: formData.pass,
        });
      } else {
        await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.pass,
          phone: formData.phone.trim(),
        });
      }

      setOpen(false);
    } catch (err) {
      setGlobalError(err?.message || 'Falha ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '1rem',
          boxShadow: theme.shadows[10],
          background:
            theme.palette.mode === 'dark'
              ? theme.palette.background.paper
              : '#fff',
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '1.4rem',
        }}
      >
        Bem-vindo
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pb: 3 }}>
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            mb: 2,
            color: theme.palette.text.secondary,
          }}
        >
          {mode === 'login'
            ? 'Entra com o teu email e senha para aceder ao site do casamento.'
            : 'Preenche os dados para te registares e entrar no site do casamento.'}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            mb: 2,
          }}
        >
          <Button
            size="small"
            variant={mode === 'login' ? 'contained' : 'text'}
            onClick={() => {
              setMode('login');
              setGlobalError('');
              setErrors({});
            }}
            sx={{ textTransform: 'none', borderRadius: '999px' }}
          >
            Já tenho acesso
          </Button>
          <Button
            size="small"
            variant={mode === 'register' ? 'contained' : 'text'}
            onClick={() => {
              setMode('register');
              setGlobalError('');
              setErrors({});
            }}
            sx={{ textTransform: 'none', borderRadius: '999px' }}
          >
            Primeiro acesso
          </Button>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {mode === 'register' && (
            <>
              <TextField
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                margin="dense"
                size="small"
              />

              <TextField
                label="Telemóvel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                fullWidth
                margin="dense"
                size="small"
              />
            </>
          )}

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            margin="dense"
            size="small"
          />

          <TextField
            label="Senha"
            name="pass"
            type={showPassword ? 'text' : 'password'}
            value={formData.pass}
            onChange={handleChange}
            error={!!errors.pass}
            helperText={errors.pass}
            fullWidth
            margin="dense"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={handleClickShowPassword}
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {globalError && (
            <Typography
              variant="caption"
              sx={{ color: theme.palette.error.main, mt: 1, display: 'block' }}
            >
              {globalError}
            </Typography>
          )}

          <Box sx={{ mt: 3, position: 'relative' }}>
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                py: 1,
                borderRadius: '999px',
                textTransform: 'none',
                fontWeight: 600,
              }}
              variant="contained"
            >
              {mode === 'login' ? 'Entrar' : 'Registar e entrar'}
            </Button>
            {loading && (
              <LinearProgress
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: -8,
                  borderRadius: '999px',
                }}
              />
            )}
          </Box>

          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 2,
              color: theme.palette.text.disabled,
            }}
          >
            Os dados de acesso são usados apenas para este convite.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
