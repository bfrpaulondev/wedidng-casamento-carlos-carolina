import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';

export default function Navbar() {
  const theme = useTheme();
  const { user, logout,enterAdmin } = useContext(AppContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => setDrawerOpen(open);


  const handleEnterAdmin = () => {
    const code = prompt('Código Admin');
    if (code) enterAdmin(code);
  };

  const navLinks = [
    { label: 'Início', to: '/' },
    { label: 'Confirmar Presença', to: '/rsvp' },
    { label: 'Presentes', to: '/gifts' },
    { label: 'VIP Fotos', to: '/vip' },
    { label: 'Manual dos Convidados', to: '/convidate-tips' },
  ];

  const drawerContent = (
    <Box
      sx={{ width: '100%', p: 3 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List sx={{ mb: 2 }}>
        {navLinks.map(
          (link) =>
            !link.hidden && (
              link.label === 'VIP Fotos' ? (
                <Tooltip
                  key={link.label}
                  title="Disponível apenas no dia do casamento para os convidados postarem fotos e compartilharem vídeos entre si."
                >
                  <ListItem
                    sx={{
                      color: theme.palette.text.disabled,
                      cursor: 'not-allowed',
                    }}
                  >
                    <ListItemText primary={link.label} />
                  </ListItem>
                </Tooltip>
              ) : (
                <ListItem
                  key={link.label}
                  component={NavLink}
                  to={link.to}
                  sx={{
                    color: theme.palette.text.primary,
                    '&.active .MuiListItemText-primary': { fontWeight: 600 },
                  }}
                >
                  <ListItemText primary={link.label} />
                </ListItem>
              )
            ),
        )}
      </List>

      {user && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
         
          <Button
            variant="outlined"
            onClick={handleEnterAdmin}
            sx={{
              borderColor: theme.palette.custom.brand200,
              color: theme.palette.custom.brand800,
              width: '300px',
              borderRadius: '999px',
              textTransform: 'none',
              '&:hover': { backgroundColor: theme.palette.custom.brand50 },
            }}
          >
            Admin
          </Button>
          <Button
            variant="outlined"
            onClick={logout}
            sx={{
              borderColor: theme.palette.custom.brand200,
              color: theme.palette.custom.brand800,
              width: '300px',
              borderRadius: '999px',
              textTransform: 'none',
              '&:hover': { backgroundColor: theme.palette.custom.brand50 },
            }}
          >
            Sair
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: `linear-gradient(180deg, ${theme.palette.custom.brand50}65, ${theme.palette.custom.brand50}45)`,
          backdropFilter: isMobile ? 'none' : `blur(12px) saturate(1.2)`,
          borderBottom: `1px solid ${theme.palette.custom.brand200}60`,
          boxShadow: isMobile ? 'none' : theme.shadows[4],
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            px: 2,
            width: '100%',
            minHeight: { xs: 56, md: 72 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{
              fontFamily: 'Playfair Display, serif',
              color: theme.palette.text.primary,
              textDecoration: 'none',
              fontSize: { xs: '1rem', md: '1.125rem' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Carolina & Carlos
          </Typography>

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 4, ml: 4 }}>
              {navLinks.map(
                (link) =>
                  !link.hidden && (
                    link.label === 'VIP Fotos' ? (
                      <Tooltip
                        key={link.label}
                        title="Disponível apenas no dia do casamento para os convidados postarem fotos e compartilharem vídeos entre si."
                      >
                        <Typography
                          sx={{
                            color: theme.palette.text.disabled,
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            cursor: 'not-allowed',
                          }}
                        >
                          {link.label}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Typography
                        key={link.label}
                        component={NavLink}
                        to={link.to}
                        sx={{
                          color: theme.palette.text.primary,
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          position: 'relative',
                          '&:after': {
                            content: '""',
                            position: 'absolute',
                            width: 0,
                            height: '2px',
                            bottom: -4,
                            left: 0,
                            backgroundColor: theme.palette.custom.brand600,
                            transition: 'width 0.28s ease',
                          },
                          '&:hover:after': { width: '100%' },
                          '&.active': { fontWeight: 'bold' },
                        }}
                      >
                        {link.label}
                      </Typography>
                    )
                  ),
              )}
            </Box>
          )}

          {!isMobile && user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 2 }}>
              <Button
                variant="outlined"
                onClick={handleEnterAdmin}
                sx={{
                  borderColor: theme.palette.custom.brand200,
                  color: theme.palette.custom.brand800,
                  borderRadius: '999px',
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  '&:hover': { backgroundColor: theme.palette.custom.brand50 },
                }}
              >
                Admin
              </Button>
              <Button
                variant="outlined"
                onClick={logout}
                sx={{
                  borderColor: theme.palette.custom.brand200,
                  color: theme.palette.custom.brand800,
                  borderRadius: '999px',
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  '&:hover': { backgroundColor: theme.palette.custom.brand50 },
                }}
              >
                Sair
              </Button>
            </Box>
          )}

          {isMobile && (
            <IconButton
              edge="end"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{
                borderRadius: '999px',
                border: `1px solid ${theme.palette.custom.brand200}`,
                width: 40,
                height: 40,
                mr: isMobile ? 4 : undefined,
                backgroundColor: theme.palette.custom.brand50,
                '&:hover': { backgroundColor: theme.palette.custom.brand100 },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(true)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '95%',
            backgroundImage: `linear-gradient(
            180deg,
            ${theme.palette.custom.brand50},
            ${theme.palette.custom.brand100},
            ${theme.palette.custom.brand200}
          )`,
            boxShadow: theme.shadows[10],
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}