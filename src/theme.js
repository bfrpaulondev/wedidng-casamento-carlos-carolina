import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#A0DDFA',
      light: '#E2F5FE',
      dark: '#6890A2',
    },
    secondary: {
      main: '#F4B79A',
    },
    background: {
      default: '#FAFBFD',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E2A44',
      secondary: '#506E7D',
    },
    custom: {
      brand50: '#F1FAFE',
      brand200: '#CBECFC',
      brand400: '#90C7E1',
      brand600: '#6890A2',
      brand800: '#384D57',
      accentAqua: '#A0FAF2',
    },
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
    h1: { fontFamily: 'Playfair Display, serif' },
    h2: { fontFamily: 'Playfair Display, serif' },
    h3: { fontFamily: 'Playfair Display, serif' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 24px rgba(32,44,50,.08)',
          borderRadius: '1rem',
        },
      },
    },
  },
});

export default theme;