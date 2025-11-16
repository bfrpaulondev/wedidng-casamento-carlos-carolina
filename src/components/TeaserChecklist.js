import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

const TEASER_SECTIONS = [
  {
    title: 'Cozinha',
    items: ['Abridores de Faca', 'Afiador de Faca', 'Assadeiras (Redon, Retan, Pudim, Pizza)', 'Batedeira'],
  },
  {
    title: 'Eletrodomésticos',
    items: ['Aspirador', 'Ayrfrair', 'Batedeira', 'Cafeteira'],
  },
  {
    title: 'Cama, Mesa e Banho',
    items: ['Almofadas', 'Cortinas', 'Edredom', 'Lençol e Fronha'],
  },
  {
    title: 'Banheiro',
    items: ['Escova de Privada', 'Kit de Banheiro', 'Lixo de Banheiro', 'Tapetes'],
  },
  {
    title: 'Área de Serviço',
    items: ['Bacias', 'Baldes', 'Pa, Vassoura, Rodo', 'Panos de Chão'],
  },
  {
    title: 'Outros',
    items: ['Caixa Organizadora', 'Extensão', 'Kit de Ferramentas', 'Mangueira'],
  },
];

export default function TeaserChecklist() {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
    }),
  };

  return (
    <Box
      ref={ref}
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(180deg, #CBECFC 0%, #90C7E1 100%)',
        color: '#1E2A44',
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h3"
        sx={{
          mb: { xs: 4, md: 6 },
          fontFamily: 'Playfair Display, serif',
          fontSize: { xs: '2rem', md: '3rem' },
          letterSpacing: '0.05em',
          color: '#384D57',
        }}
        initial={{ opacity: 0, y: -30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        Um Lar Feito de Amor
      </Typography>

      <Grid container spacing={3} sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 4 } }}>
        {TEASER_SECTIONS.map((section, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <motion.div
              variants={cardVariants}
              custom={i}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              <Card
                sx={{
                  borderRadius: '1.5rem',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
                  backdropFilter: 'blur(15px) saturate(1.8)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 6px 18px rgba(144,199,225,0.2)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'left' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#F4B79A', fontWeight: 600 }}>
                    {section.title}
                  </Typography>
                  {section.items.slice(0, 4).map((item, j) => (
                    <Typography key={j} sx={{ mb: 1, fontSize: '0.9rem', color: 'rgba(30,42,68,0.9)' }}>
                      {item}
                    </Typography>
                  ))}
                  <Typography sx={{ mt: 1, fontSize: '0.8rem', color: 'rgba(30,42,68,0.7)' }}>
                    ...e mais
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Button
        component={Link}
        to="/gifts"
        variant="contained"
        sx={{
          mt: 6,
          px: 5,
          py: 1.5,
          borderRadius: '999px',
          backgroundColor: '#F4B79A',
          color: '#1E2A44',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(244,183,154,0.4)',
          '&:hover': { backgroundColor: '#F4B79A', boxShadow: '0 6px 18px rgba(244,183,154,0.5)' },
        }}
      >
        Veja a Lista Completa
      </Button>
    </Box>
  );
}