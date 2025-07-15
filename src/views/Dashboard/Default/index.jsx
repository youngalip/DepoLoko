import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Chip, Avatar, Stack, List, ListItem, ListItemText, Divider, useTheme } from '@mui/material';

import { useNotifications } from 'contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const dummyAssets = [
  { name: 'Lokomotif', status: 'Aktif' },
  { name: 'Gerbong', status: 'Aktif' },
  { name: 'Rel', status: 'Butuh Perawatan' },
  { name: 'Sinyal', status: 'Rusak' },
  { name: 'Suku Cadang', status: 'Aktif' }
];
const dummySchedules = [
  { tanggal: '2025-07-03', jenis: 'Perawatan Rel', keterangan: 'Rel utama lintas A' }
];

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import DirectionsRailwayFilledIcon from '@mui/icons-material/DirectionsRailwayFilled';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ahklakKAIImg from 'assets/images/AHLAK-KAI.jpg';
import maskotSimloko from 'assets/images/maskot-simloko.png';

const featureCards = [
  {
    title: 'Monitoring Action Plan',
    icon: <AssessmentOutlinedIcon fontSize="large" color="primary" />,
    url: '/action-plan',
    color: 'primary.main'
  },
  {
    title: 'Pantauan Roda CC205',
    icon: <DirectionsRailwayFilledIcon fontSize="large" color="success" />,
    url: '/pantauan-roda-cc205',
    color: 'success.main'
  },
  {
    title: 'Rekap Data Fasilitas',
    icon: <TableChartOutlinedIcon fontSize="large" color="info" />,
    url: '/rekap-fasilitas',
    color: 'info.main'
  },
  {
    title: 'Manpower Data Manage',
    icon: <GroupOutlinedIcon fontSize="large" color="secondary" />,
    url: '/manpower-data-manage',
    color: 'secondary.main'
  },
  {
    title: 'Input Data Dashboard',
    icon: <InputOutlinedIcon fontSize="large" color="warning" />,
    url: '/input-data',
    color: 'warning.main'
  }
];

const Default = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { notifications } = useNotifications();

  const countByStatus = (status) => dummyAssets.filter(a => a.status === status).length;

  return (
    <Box sx={{ flexGrow: 1, mt: 2 }}>
  {/* Banner Header ala SIMLOKO */}
  <Box sx={{ position: 'relative', mb: 4 }}>
    <Card sx={{ background: '#2563eb', color: '#fff', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(13,41,86,0.08)' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', minHeight: 200, px: { xs: 2, md: 5 }, py: { xs: 3, md: 4 } }}>
        <Box sx={{ flex: 1, minWidth: 210 }}>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#fff', mb: 1, fontSize: 28, lineHeight: 1.2 }}>
            Selamat Datang di SIMLOKO
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#e0e7ff', mb: 1, fontWeight: 600, fontSize: 15 }}>
            Depo Lokomotif Divre IV Tanjung Karang PT. Kereta Api Indonesia (Persero)
          </Typography>
          <Typography variant="body2" sx={{ color: '#fff', mb: 2, fontSize: 13, maxWidth: 420 }}>
            Sistem Informasi Manajemen Lokomotif merupakan portal pemantauan dan pengelolaan data terintegrasi di Depo Lokomotif Divre IV Tanjung Karang, yang bertujuan untuk meningkatkan efisiensi, transparansi, dan ketepatan dalam perencanaan serta pemeliharaan sarana perkeretaapian.
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' }, minWidth: 180, textAlign: 'right' }}>
          <img src={maskotSimloko} alt="Maskot SIMLOKO" style={{ height: 140, marginRight: 0 }} />
        </Box>
      </CardContent>
    </Card>
  </Box>

  {/* Shortcut Feature Cards ala SIMLOKO */}
  <Grid container spacing={3} justifyContent="center">
    {featureCards.map((f, idx) => (
      <Grid item xs={12} sm={6} md={2.4} key={f.title}>
        <Card
          sx={{
            textAlign: 'center',
            cursor: 'pointer',
            background: '#2563eb',
            color: '#fff',
            borderRadius: 3,
            boxShadow: 3,
            py: 2,
            px: 0.5,
            transition: 'transform 0.15s',
            '&:hover': { transform: 'translateY(-6px)', boxShadow: 8, background: '#1e40af' }
          }}
          onClick={() => navigate(f.url)}
        >
          <CardContent sx={{ p: 1 }}>
            <Avatar sx={{ bgcolor: '#fff', width: 60, height: 60, mx: 'auto', mb: 1 }}>
              {React.cloneElement(f.icon, { style: { fontSize: 38, color: '#2563eb' } })}
            </Avatar>
            <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: 13, color: '#fff', lineHeight: 1.2, minHeight: 36 }}>
              {f.title}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>

{/* Gambar AHLAK-KAI */}
<Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
  <img
    src={ahklakKAIImg}
    alt="AHLAK KAI"
    style={{ maxWidth: '100%', width: '900px', borderRadius: 18, boxShadow: '0 4px 32px 0 rgba(13,41,86,0.10)' }}
  />
</Box>
</Box>
  );
};

export default Default;

