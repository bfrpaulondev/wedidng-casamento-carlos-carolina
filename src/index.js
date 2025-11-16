import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import { AnimatePresence } from 'framer-motion';
import theme from './theme';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
    <AnimatePresence mode="wait">
      <App />
    </AnimatePresence>
  </ThemeProvider>
);
serviceWorkerRegistration.register();

