import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

export default function Footer() {
  const theme = useTheme();

  return (
    <Box component="footer" sx={{ width: '100%', height: 56, mt: 8, textAlign: 'center', color: theme.palette.custom.brand600, fontSize: '0.875rem', background: `linear-gradient(180deg, ${theme.palette.custom.brand50}65, ${theme.palette.custom.brand50}45)`, backdropFilter: 'blur(12px) saturate(1.2)', borderTop: `1px solid ${theme.palette.custom.brand200}60`, boxShadow: theme.shadows[4], position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200 }}>
      <Box sx={{ height: 4, width: 96, mx: 'auto', borderRadius: '999px', background: `linear-gradient(135deg, ${theme.palette.custom.brand200}, ${theme.palette.custom.brand600})`, mt: 1 }} />
      <Typography variant="body2" sx={{ mt: 1.25 }}>
        Carolina & Carlos — Desenvolvido por @Bfrpaulondev
      </Typography>
    </Box>
  );
}
