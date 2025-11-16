import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

import { AppProvider } from './contexts/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// páginas
import Home from './pages/Home';
import Rsvp from './pages/Rsvp';
import Gifts from './pages/Gifts';
import Kitchen from './pages/Kitchen';
import Honeymoon from './pages/ConvidateTips';
import Vip from './pages/Vip';

function AppContent() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flex: 1,
          pt: { xs: 7, md: 9 },  
          pb: '72px',           
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rsvp" element={<Rsvp />} />
          <Route path="/gifts" element={<Gifts />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/convidate-tips" element={<Honeymoon />} />
          <Route path="/vip" element={<Vip />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}
