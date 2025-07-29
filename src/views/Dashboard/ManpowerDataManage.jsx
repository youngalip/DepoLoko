import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  EventAvailable as EventIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);






export default function ManpowerDataManage() {
  // State hooks harus di dalam komponen
  const [manpowerData, setManpowerData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  // Fetch data dari backend
  React.useEffect(() => {
    setLoading(true);
    setError("");
    fetch("/api/manpower")
      .then((res) => res.json())
      .then((data) => {
        setManpowerData(Array.isArray(data.manpower) ? data.manpower : []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Gagal mengambil data manpower");
        setLoading(false);
      });
  }, []);

  // Helper: summary by field
  function getSummaryByField(field) {
    const summary = {};
    manpowerData.forEach((item) => {
      const key = item[field] || "Lainnya";
      summary[key] = (summary[key] || 0) + 1;
    });
    return Object.entries(summary).map(([label, value]) => ({ label, value }));
  }

  // Helper: chart data
  function getChartDataByField(field, labelOrder = null, colorMap = null) {
    const summary = {};
    manpowerData.forEach((item) => {
      const key = item[field] || "Lainnya";
      summary[key] = (summary[key] || 0) + 1;
    });
    const labels = labelOrder || Object.keys(summary);
    const data = labels.map((label) => summary[label] || 0);
    const backgroundColor = colorMap ? labels.map((label) => colorMap[label] || "#2196f3") : undefined;
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderWidth: 0,
          borderRadius: 4,
        },
      ],
    };
  }

  const [showDetail, setShowDetail] = useState(false);
  const [detailKategori, setDetailKategori] = useState('');
  const [detailTitle, setDetailTitle] = useState('');

  const totalEmployee = manpowerData.length;

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 4,
      },
    },
  };

  const getStatusColor = (status) => {
  if (!status || typeof status !== 'string') {
    return { backgroundColor: '#f5f5f5', color: '#616161' };
  }
  switch (status.toLowerCase()) {
    case 'done':
    case 'oke':
    case 'aktif':
      return { backgroundColor: '#e8f5e8', color: '#2e7d32' };
    case 'expired':
    case 'belum':
      return { backgroundColor: '#ffebee', color: '#c62828' };
    case 'ths':
      return { backgroundColor: '#f3e5f5', color: '#7b1fa2' };
    default:
      return { backgroundColor: '#f5f5f5', color: '#616161' };
  }
};

  const handleDetailClick = (kategori, title) => {
    setDetailKategori(kategori);
    setDetailTitle(title);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailKategori('');
    setDetailTitle('');
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 2, minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ position: 'relative', mb: 4 }}>
        <Card sx={{ background: '#f8fafc', color: '#2196f3', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(13,41,86,0.08)' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', minHeight: 120, px: { xs: 2, md: 5 }, py: { xs: 3, md: 4 } }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#1e3a8a', mb: 1 }}>
                Manpower Data Management
              </Typography>
              <Typography variant="body1" sx={{ color: '#334155' }}>
                Dashboard pengelolaan data kepegawaian
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={3}>
        {/* Total Manpower Card */}
        <Grid item xs={12} lg={3}>
          <Card sx={{ height: 'fit-content', borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ color: '#2196f3', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196f3' }}>
                  Total Manpower
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                {loading ? (
  <Typography variant="body2" color="text.secondary">Memuat data...</Typography>
) : error ? (
  <Typography variant="body2" color="error.main">{error}</Typography>
) : (
  getSummaryByField('jabatan').map((item, index) => (
    <Box
      key={index}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 0.5,
      }}
    >
      <Typography variant="body2" sx={{ fontSize: 13, color: '#666' }}>
        {item.label}
      </Typography>
      <Chip
        label={item.value}
        size="small"
        sx={{
          backgroundColor: 'transparent',
          color: '#040606',
          fontWeight: 600,
          fontSize: 12,
          height: 29.2,
        }}
      />
    </Box>
  ))
)}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#040606' }}>
                  {totalEmployee}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts Grid */}
        <Grid item xs={12} lg={9}>
          <Grid container spacing={3}>
            {/* Top Row Charts */}
            <Grid item xs={12} md={4}>
  <Card sx={{ borderRadius: 4, boxShadow: 3, minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AssignmentIcon sx={{ color: '#2196f3', mr: 1, fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196f3' }}>
          Status DTO
        </Typography>
      </Box>
      <Box sx={{ height: 220 }}>
        {loading ? (
  <Typography variant="body2" color="text.secondary">Memuat data...</Typography>
) : error ? (
  <Typography variant="body2" color="error.main">{error}</Typography>
) : (
  <Bar
    data={getChartDataByField('dto', ['Sudah', 'Belum'], { 'Sudah': '#43a047', 'Belum': '#e53935' })}
    options={chartOptions}
  />
) }
      </Box>
    </CardContent>
  </Card>
</Grid>

            <Grid item xs={12} md={4}>
  <Card sx={{ borderRadius: 4, boxShadow: 3, minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <SchoolIcon sx={{ color: '#2196f3', mr: 1, fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196f3' }}>
          Diklat Fungsional
        </Typography>
      </Box>
      <Box sx={{ height: 160 }}>
        {loading ? (
          <Typography variant="body2" color="text.secondary">Memuat data...</Typography>
        ) : error ? (
          <Typography variant="body2" color="error.main">{error}</Typography>
        ) : (
          <Bar
            data={getChartDataByField('diklat_fungsional', ['5 Kali', '4 Kali', '3 Kali', '2 Kali', '1 Kali', 'Belum'], { '5 Kali': '#2563eb', '4 Kali': '#2563eb', '3 Kali': '#2563eb', '2 Kali': '#2563eb', '1 Kali': '#2563eb', 'Belum': '#e53935' })}
            options={chartOptions}
          />
        )
      }
      </Box>
      <Button
        variant="contained"
        fullWidth
        size="small"
        onClick={() => handleDetailClick('diklat', 'Diklat Fungsional')}
        sx={{
          mt: 2,
          background: 'linear-gradient(135deg, #5de0e6, #2563eb)',
          color: '#fff',
          fontWeight: 700,
          fontSize: 13,
          textTransform: 'none',
          borderRadius: 2,
          '&:hover': {
            background: 'linear-gradient(135deg, #003a91, #1d4ed8)',
          },
        }}
      >
        Detail Diklat
      </Button>
    </CardContent>
  </Card>
</Grid>

            <Grid item xs={12} md={4}>
  <Card sx={{ borderRadius: 4, boxShadow: 3, minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AssignmentIcon sx={{ color: '#2196f3', mr: 1, fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196f3' }}>
          Sertifikasi
        </Typography>
      </Box>
      <Box sx={{ height: 180 }}>
        {loading ? (
  <Typography variant="body2" color="text.secondary">Memuat data...</Typography>
) : error ? (
  <Typography variant="body2" color="error.main">{error}</Typography>
) : (
  <Bar
    data={getChartDataByField('sertifikasi', ['Oke', 'Belum', 'Expired', 'THS'], { 'Oke': '#43a047', 'Belum': '#2563eb', 'Expired': '#e53935', 'THS': '#9c27b0' })}
    options={chartOptions}
  />
) }
      </Box>
      <Button
        variant="contained"
        fullWidth
        size="small"
        onClick={() => handleDetailClick('sertifikasi', 'Sertifikasi')}
        sx={{
          mt: 2,
          background: 'linear-gradient(135deg, #5de0e6, #2563eb)',
          color: '#fff',
          fontWeight: 700,
          fontSize: 13,
          textTransform: 'none',
          borderRadius: 2,
          '&:hover': {
            background: 'linear-gradient(135deg, #003a91, #1d4ed8)',
          },
        }}
      >
        Detail Sertifikasi
      </Button>
    </CardContent>
  </Card>
</Grid>

{/* Bottom Row Charts */}
<Grid item xs={12} md={6}>
  <Card sx={{ borderRadius: 4, boxShadow: 3, minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <EventIcon sx={{ color: '#2196f3', mr: 1, fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196f3' }}>
          TMT Pensiun
        </Typography>
      </Box>
      <Box sx={{ height: 180 }}>
        <Bar data={getChartDataByField('tmtPensiun', null, { 'Sudah': '#2563eb', 'Belum': '#e53935' })} options={chartOptions} />
      </Box>
      <Button
        variant="contained"
        fullWidth
        size="small"
        onClick={() => handleDetailClick('tmt', 'TMT Pensiun & Pendidikan')}
        sx={{
          mt: 2,
          background: 'linear-gradient(135deg, #5de0e6, #2563eb)',
          color: '#fff',
          fontWeight: 700,
          fontSize: 13,
          textTransform: 'none',
          borderRadius: 2,
          '&:hover': {
            background: 'linear-gradient(135deg, #003a91, #1d4ed8)',
          },
        }}
      >
        Detail TMT Pensiun
      </Button>
    </CardContent>
  </Card>
</Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 4, boxShadow: 3, minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SchoolIcon sx={{ color: '#2196f3', mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196f3' }}>
                      Pendidikan
                    </Typography>
                  </Box>
                  <Box sx={{ height: 180 }}>
                    <Bar data={getChartDataByField('pendidikan', null, { 'SMA': '#2563eb', 'D3': '#43a047', 'S1': '#ffb300', 'S2': '#8e24aa', 'Lainnya': '#e53935' })} options={chartOptions} />
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    onClick={() => handleDetailClick('tmt', 'TMT Pensiun & Pendidikan')}
                    sx={{
                      mt: 2,
                      background: 'linear-gradient(135deg, #5de0e6, #2563eb)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 13,
                      textTransform: 'none',
                      borderRadius: 2,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #003a91, #1d4ed8)',
                      },
                    }}
                  >
                    Detail Pendidikan
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Main Data Table */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, mt: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#2196f3' }}>
                Data Manpower
              </Typography>
              
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#2196f3' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>NIPP</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>NAMA</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>JABATAN</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>PENSIUN</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>DTO</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>SERTIFIKASI</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
  <TableRow><TableCell colSpan={6}><Typography variant="body2" color="text.secondary">Memuat data...</Typography></TableCell></TableRow>
) : error ? (
  <TableRow><TableCell colSpan={6}><Typography variant="body2" color="error.main">{error}</Typography></TableCell></TableRow>
) : manpowerData.length === 0 ? (
  <TableRow><TableCell colSpan={6}><Typography variant="body2" color="text.secondary">Tidak ada data manpower.</Typography></TableCell></TableRow>
) : (
  manpowerData.map((row, index) => (
    <TableRow key={index} hover>
      <TableCell>{row.nipp}</TableCell>
      <TableCell sx={{ fontWeight: 600 }}>{row.nama}</TableCell>
      <TableCell>{row.jabatan}</TableCell>
      <TableCell>{row.pensiun}</TableCell>
      <TableCell>
        <Chip
          label={Array.isArray(row.dto) ? row.dto.map(d => d.nama || d).join(', ') : (row.dto || '-')}
          size="small"
          sx={{
            ...getStatusColor(row.dto),
            fontWeight: 600,
            fontSize: 11,
          }}
        />
      </TableCell>
      <TableCell>
        <Chip
          label={Array.isArray(row.sertifikasi) ? row.sertifikasi.map(s => s.nama || s).join(', ') : (row.sertifikasi || '-')}
          size="small"
          sx={{
            ...getStatusColor(row.sertifikasi),
            fontWeight: 600,
            fontSize: 11,
          }}
        />
      </TableCell>
    </TableRow>
  ))
)
}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detail Table Inline (show/hide Card, not Dialog) */}
      {showDetail && (
        <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight={700}>
                Detail Manpower - {detailTitle}
              </Typography>
              <Button
                size="small"
                onClick={handleCloseDetail}
                sx={{
                  mt: 1,
                  background: 'linear-gradient(135deg, #5de0e6, #2563eb)',
                  color: '#fff',
                  fontWeight: 600,
                  textTransform: 'none',
                  border: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #003a91, #1d4ed8)',
                  },
                }}
              >
                Tutup
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {detailKategori === 'diklat' && (
              <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#2196f3' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>NIPP</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>NAMA</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>JABATAN</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>DTO PRS</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>DTO PMS</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>T2 PRS</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>T2 PMS</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>T3 PRS</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>T3 PMS</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>T4 MPS</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>SMDP</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>JMDP</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
  <TableRow><TableCell colSpan={12}><Typography variant="body2" color="text.secondary">Memuat data...</Typography></TableCell></TableRow>
) : error ? (
  <TableRow><TableCell colSpan={12}><Typography variant="body2" color="error.main">{error}</Typography></TableCell></TableRow>
) : (
  manpowerData.filter(row => Array.isArray(row.diklat_fungsional) && row.diklat_fungsional.length > 0).map((row, index) => (
    row.diklat_fungsional.map((diklat, idx) => (
      <TableRow key={index + '-' + idx} hover>
        <TableCell>{row.nipp}</TableCell>
        <TableCell sx={{ fontWeight: 600 }}>{row.nama}</TableCell>
        <TableCell>{row.jabatan}</TableCell>
        <TableCell>{diklat.dtoPrs || '-'}</TableCell>
        <TableCell>{diklat.dtoPms || '-'}</TableCell>
        <TableCell>{diklat.t2Prs || '-'}</TableCell>
        <TableCell>{diklat.t2Pms || '-'}</TableCell>
        <TableCell>{diklat.t3Prs || '-'}</TableCell>
        <TableCell>{diklat.t3Pms || '-'}</TableCell>
        <TableCell>{diklat.t4Mps || '-'}</TableCell>
        <TableCell>{diklat.smdp || '-'}</TableCell>
        <TableCell>{diklat.jmdp || '-'}</TableCell>
      </TableRow>
    ))
  ))
)}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {detailKategori === 'sertifikasi' && (
              <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#2196f3' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>NIPP</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>NAMA</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>JABATAN</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>SERTIFIKASI</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>TANGGAL TERBIT</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>NOMOR SERTIFIKAT</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>BERLAKU SAMPAI</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>MASA BERLAKU</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>STATUS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
  <TableRow><TableCell colSpan={9}><Typography variant="body2" color="text.secondary">Memuat data...</Typography></TableCell></TableRow>
) : error ? (
  <TableRow><TableCell colSpan={9}><Typography variant="body2" color="error.main">{error}</Typography></TableCell></TableRow>
) : (
  manpowerData.filter(row => Array.isArray(row.sertifikasi) && row.sertifikasi.length > 0).map((row, index) => (
    row.sertifikasi.map((sertif, idx) => (
      <TableRow key={index + '-' + idx} hover>
        <TableCell>{row.nipp}</TableCell>
        <TableCell sx={{ fontWeight: 600 }}>{row.nama}</TableCell>
        <TableCell>{row.jabatan}</TableCell>
        <TableCell>{sertif.nama || '-'}</TableCell>
        <TableCell>{sertif.tanggalTerbit || '-'}</TableCell>
        <TableCell>{sertif.nomorSertifikat || '-'}</TableCell>
        <TableCell>{sertif.berlakuSampai || '-'}</TableCell>
        <TableCell>{sertif.masaBerlaku || '-'}</TableCell>
        <TableCell>
          <Chip
            label={sertif.status || '-'}
            size="small"
            sx={{
              ...getStatusColor(sertif.status),
              fontWeight: 600,
              fontSize: 11,
            }}
          />
        </TableCell>
      </TableRow>
    ))
  ))
)}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {detailKategori === 'tmt' && (
              <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#2196f3' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>NIPP</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>NAMA</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>JABATAN</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>TMT PENSIUN</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>PENDIDIKAN</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
  <TableRow><TableCell colSpan={5}><Typography variant="body2" color="text.secondary">Memuat data...</Typography></TableCell></TableRow>
) : error ? (
  <TableRow><TableCell colSpan={5}><Typography variant="body2" color="error.main">{error}</Typography></TableCell></TableRow>
) : (
  manpowerData.filter(row => row.tmtPensiun || row.pendidikan).map((row, index) => (
    <TableRow key={index} hover>
      <TableCell>{row.nipp}</TableCell>
      <TableCell sx={{ fontWeight: 600 }}>{row.nama}</TableCell>
      <TableCell>{row.jabatan}</TableCell>
      <TableCell>{row.tmtPensiun}</TableCell>
      <TableCell>{row.pendidikan}</TableCell>
    </TableRow>
  ))
)}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
