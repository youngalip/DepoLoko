import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Divider,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput
} from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import GroupsIcon from '@mui/icons-material/Groups';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import BuildIcon from '@mui/icons-material/Build';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import 'chart.js/auto';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Dummy data for illustration (replace with your real data source)




// --- Semua fungsi filter, chart, dsb, harus pakai state actionPlanData ---
// Semua dummy sudah dihapus. Mulai dari sini, seluruh akses data harus menggunakan state actionPlanData hasil fetch backend.


const teamIcons = {
  'TIM FLYING GANG': <FlightTakeoffIcon sx={{ fontSize: 50, color: '#1976d2' }} />,
  'TIM REVISI': <AutorenewIcon sx={{ fontSize: 50, color: '#4CAF50' }} />,
  'TIM ELEKTRIK': <ElectricBoltIcon sx={{ fontSize: 50, color: '#FFC107' }} />,
  'TIM ENGINE': <EngineeringIcon sx={{ fontSize: 50, color: '#1976d2' }} />,
  'TIM ANGIN': <MiscellaneousServicesIcon sx={{ fontSize: 50, color: '#00bcd4' }} />,
  'TIM PRL': <BuildIcon sx={{ fontSize: 50, color: '#8e24aa' }} />,
  'TIM SELF TEST': <GroupsIcon sx={{ fontSize: 50, color: '#ff5722' }} />,
  'TIM TRUCK': <DirectionsBusFilledIcon sx={{ fontSize: 50, color: '#607d8b' }} />,
};

// teams akan diinisialisasi di dalam komponen agar bisa akses state


function getAchievement(data) {
  if (!data.length) return 0;
  const totalPlan = data.reduce((a, b) => a + b.plan, 0);
  const totalActual = data.reduce((a, b) => a + b.actual, 0);
  const achievement = totalPlan ? (totalActual / totalPlan) * 100 : 0;
  return Math.min(achievement, 100).toFixed(2); // Ensure max 100%
}

// Data detail aktivitas per tim kini diambil dari actionPlanData (bukan dummy)
// Evidence akan diambil dari field foto_path/foto jika ada di backend, jika tidak tampilkan '-'.





function ActionPlanDashboard() {
  const [actionPlanData, setActionPlanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState([]);

  // Fungsi untuk filter aktivitas tim, harus di dalam komponen agar akses state
  function getTeamActivities(team) {
    return actionPlanData.filter(row => row.pic === team);
  }
  
  // Fetch data dari backend saat mount
  React.useEffect(() => {
    const fetchActionPlan = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/action-plan');
        const data = await res.json();
        setActionPlanData(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Gagal mengambil data action plan');
        setActionPlanData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActionPlan();
  }, []);

  // Fungsi hitung progres per tim
  function getTeamPercent(teamName) {
    const data = actionPlanData.filter(d => d.pic === teamName);
    if (!data.length) return 0;
    const totalPlan = data.reduce((a, b) => a + b.plan, 0);
    const totalActual = data.reduce((a, b) => a + b.actual, 0);
    return Number(Math.min((totalActual / totalPlan) * 100, 100).toFixed(2));
  }

  // Fungsi total plan/actual per tim
  function getTeamTotal(teamName) {
    const data = actionPlanData.filter(d => d.pic === teamName);
    return {
      plan: data.reduce((a, b) => a + b.plan, 0),
      actual: data.reduce((a, b) => a + b.actual, 0)
    };
  }

  // Fungsi achievement
  function getAchievement(data) {
    if (!data.length) return 0;
    const totalPlan = data.reduce((a, b) => a + b.plan, 0);
    const totalActual = data.reduce((a, b) => a + b.actual, 0);
    const achievement = totalPlan ? (totalActual / totalPlan) * 100 : 0;
    return Math.min(achievement, 100).toFixed(2); // Ensure max 100%
  }

  // Inisialisasi teams di dalam komponen
  const teams = [
    { name: 'TIM FLYING GANG', percent: getTeamPercent('TIM FLYING GANG'), color: '#4CAF50' },
    { name: 'TIM REVISI', percent: getTeamPercent('TIM REVISI'), color: '#4CAF50' },
    { name: 'TIM ELEKTRIK', percent: getTeamPercent('TIM ELEKTRIK'), color: '#FFC107' },
    { name: 'TIM ENGINE', percent: getTeamPercent('TIM ENGINE'), color: '#1976d2' },
    { name: 'TIM ANGIN', percent: getTeamPercent('TIM ANGIN'), color: '#00bcd4' },
    { name: 'TIM PRL', percent: getTeamPercent('TIM PRL'), color: '#8e24aa' },
    { name: 'TIM SELF TEST', percent: getTeamPercent('TIM SELF TEST'), color: '#ff5722' },
    { name: 'TIM TRUCK', percent: getTeamPercent('TIM TRUCK'), color: '#607d8b' }
  ];

  // Get unique components for filter
  const uniqueComponents = [...new Set(actionPlanData.map(item => item.komponen))].sort();

  // Handle component filter change
  const handleComponentFilterChange = (component) => {
    setSelectedComponents(prev => 
      prev.includes(component) 
        ? prev.filter(c => c !== component)
        : [...prev, component]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedComponents([]);
  };

  // Select all components
  const selectAllComponents = () => {
    setSelectedComponents(uniqueComponents);
  };

  // Filter data by team and selected components
  const filteredData = actionPlanData.filter(item => {
    const teamMatch = selectedTeam ? item.pic === selectedTeam : true;
    const componentMatch = selectedComponents.length === 0 || selectedComponents.includes(item.komponen);
    return teamMatch && componentMatch;
  });

  // Achievement data
  const achievement = getAchievement(filteredData);
  
  // Pie chart data (max 100%)
  const pieData = {
    labels: ['Achievement', 'Remaining'],
    datasets: [{
      data: [achievement, 100 - achievement],
      backgroundColor: ['#2196f3', '#ff5757'],
      borderWidth: 0,
      cutout: '70%'
    }]
  };

  // Bar + Line chart data (Plan, Actual, Realisasi %)
  const barData = {
    labels: filteredData.map((d) => d.komponen),
    datasets: [
      {
        type: 'bar',
        label: 'Plan',
        data: filteredData.map((d) => d.plan),
        backgroundColor: '#ff5757',
        borderRadius: 2,
        barPercentage: 0.5,
      },
      {
        type: 'bar',
        label: 'Actual',
        data: filteredData.map((d) => d.actual),
        backgroundColor: '#2196f3',
        borderRadius: 2,
        barPercentage: 0.5,
      },
      {
        type: 'line',
        label: 'Realisasi',
        data: filteredData.map((d) => {
          if (typeof d.actual === 'number' && typeof d.plan === 'number' && d.plan > 0) {
            return Math.min((d.actual / d.plan) * 100, 100);
          }
          return 0;
        }),
        borderColor: '#43a047',
        backgroundColor: '#43a047',
        borderWidth: 2,
        tension: 0.3,
        yAxisID: 'y2',
        pointRadius: 4,
        pointBackgroundColor: '#43a047',
        pointBorderColor: '#fff',
        fill: false,
        order: 0
      }
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 200, // Adjust based on your max value
        grid: { display: false },
        ticks: { stepSize: 50 }
      },
      y2: {
        position: 'right',
        min: 0,
        max: 100,
        grid: { display: false },
        ticks: {
          color: '#43a047',
          callback: (value) => value + '%'
        }
      },
      x: { grid: { display: false } }
    }
  };

  // Pie chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    cutout: '70%'
  };

  // Get status color based on percentage
  const getStatusColor = (percent) => {
    if (percent >= 90) return 'success';
    if (percent >= 70) return 'warning';
    return 'error';
  };

  // Get status icon based on percentage
  const getStatusIcon = (percent) => {
    if (percent >= 90) return <CheckCircleOutlineIcon color="success" />;
    if (percent >= 70) return <WarningAmberIcon color="warning" />;
    return <ErrorOutlineIcon color="error" />;
  };

  return (
    <Box p={2}>
      {/* Header */}
      <Box sx={{ position: 'relative', mb: 4 }}>
        <Card sx={{ background: '#f8fafc', color: '#2196f3', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(13,41,86,0.08)' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', minHeight: 120, px: { xs: 2, md: 5 }, py: { xs: 3, md: 4 } }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#1e3a8a', mb: 1 }}>
                Monitoring Action Plan
              </Typography>
              <Typography variant="body1" sx={{ color: '#334155' }}>
                Realisasi Pekerjaan Per Komponen
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={2}>
        {/* Achievement Card */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>ACHIEVEMENT</Typography>
              <Box sx={{ position: 'relative', width: '100%', height: '180px' }}>
                <Pie data={pieData} options={pieOptions} />
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {achievement}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Tercapai
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Plan vs Actual Bar Chart */}
        <Grid item xs={12} md={9}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>PLAN vs ACTUAL</Typography>
              <Box sx={{ height: '220px' }}>
                <Bar data={barData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        

        {/* Tabel Action Plan Komponen */}
        <Grid item xs={12}>
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 170, maxWidth: 1200 }}>
                  <InputLabel>Filter Komponen</InputLabel>
                  <Select
                    multiple
                    value={selectedComponents}
                    onChange={(event) => setSelectedComponents(event.target.value)}
                    input={<OutlinedInput label="Filter Komponen" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                          width: 400,
                        },
                      },
                    }}
                  >
                    {uniqueComponents.map((component) => (
                      <MenuItem key={component} value={component}>
                        {component}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={selectAllComponents}
                  sx={{ textTransform: 'none' }}
                >
                  Pilih Semua
                </Button>
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={clearAllFilters}
                  sx={{ textTransform: 'none' }}
                >
                  Hapus Filter
                </Button>
                <Typography variant="body2" color="textSecondary">
                  ({selectedComponents.length} dari {uniqueComponents.length} komponen dipilih)
                </Typography>
              </Box>
              <Typography variant="subtitle1" fontWeight={700} mb={2} sx={{ color: '#fff', background: 'linear-gradient(315deg, #5de0e6, #2563eb)', px: 2, py: 1, borderRadius: 1 }}>
                TABEL REALISASI ACTION PLAN TIAP KOMPONEN
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 0, borderRadius: 2, maxHeight: 400 }}>
                <Table size="small" sx={{ width: '100%' }} stickyHeader>
                  <TableHead>
                    <TableRow sx={{ background: '#2196f3' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 700, bgcolor: '#2196f3', position: 'sticky', top: 0, zIndex: 1 }}>No</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700, bgcolor: '#2196f3', position: 'sticky', top: 0, zIndex: 1 }}>Komponen</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700, bgcolor: '#2196f3', position: 'sticky', top: 0, zIndex: 1 }}>Lagging Indicator</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700, bgcolor: '#2196f3', position: 'sticky', top: 0, zIndex: 1 }}>Leading Indicator</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700, bgcolor: '#2196f3', position: 'sticky', top: 0, zIndex: 1 }}>Target</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700, bgcolor: '#2196f3', position: 'sticky', top: 0, zIndex: 1 }}>PIC</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700, bgcolor: '#2196f3', position: 'sticky', top: 0, zIndex: 1 }}>Plan</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700, bgcolor: '#2196f3', position: 'sticky', top: 0, zIndex: 1 }}>Actual</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700, bgcolor: '#2196f3', position: 'sticky', top: 0, zIndex: 1 }}>Realisasi (%)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((row, idx) => (
                      <TableRow key={idx} sx={{ bgcolor: idx % 2 === 0 ? '#f5f7fa' : '#fff' }}>
                        <TableCell sx={{ fontSize: 12, py: 0.5 }}>{idx+1}</TableCell>
                        <TableCell sx={{ fontSize: 12, py: 0.5 }}>{row.komponen}</TableCell>
                        <TableCell sx={{ fontSize: 12, py: 0.5 }}>{row.lagging || 'Contoh lagging...'}</TableCell>
                        <TableCell sx={{ fontSize: 12, py: 0.5 }}>{row.leading || 'Contoh leading...'}</TableCell>
                        <TableCell sx={{ fontSize: 12, py: 0.5 }}>{row.target || 'Setiap Perawatan'}</TableCell>
                        <TableCell sx={{ fontSize: 12, py: 0.5 }}>{row.pic}</TableCell>
                        <TableCell sx={{ fontSize: 12, py: 0.5 }}>{row.plan}</TableCell>
                        <TableCell sx={{ fontSize: 12, py: 0.5 }}>{row.actual}</TableCell>
                        <TableCell sx={{ fontSize: 12, py: 0.5 }}>
                          {(() => {
                            let percent = 0;
                            if (typeof row.actual === 'number' && typeof row.plan === 'number' && row.plan > 0) {
                              percent = Math.min((row.actual / row.plan) * 100, 100);
                              percent = Number(percent.toFixed(2));
                            }
                            return (
                              <Chip 
                                label={percent + '%'}
                                color={percent >= 90 ? 'success' : percent >= 70 ? 'warning' : 'error'}
                                sx={{ fontWeight: 700, fontSize: 12, height: 22 }}
                              />
                            );
                          })()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Team Performance */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>PERFORMA TIAP TIM</Typography>
              <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                {teams.map((team, index) => (
                  <Card 
                    key={team.name}
                    variant="outlined"
                    sx={{
                      minWidth: 180,
                      maxWidth: 220,
                      borderLeft: `4px solid ${team.color}`,
                      borderRadius: 2,
                      boxShadow: 0,
                      mb: 2,
                      minHeight: 180,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexShrink: 0
                    }}
                  >
                    <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                      <Box sx={{ mb: 2.5, mt: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {teamIcons[team.name]}
                      </Box>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ textAlign: 'center' }}>{team.name}</Typography>
                      <Typography variant="h6" fontWeight={700} sx={{ textAlign: 'center' }}>{team.percent}%</Typography>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" color="textSecondary" sx={{ textAlign: 'center' }}>
                          Plan: {getTeamTotal(team.name).plan} | Actual: {getTeamTotal(team.name).actual}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          mt: 1,
                          background: 'linear-gradient(135deg, #5de0e6, #2563eb)',
                          color: '#fff',
                          fontWeight: 600,
                          textTransform: 'none', // agar label tetap "Detail" tidak kapital semua
                          '&:hover': {
                            background: 'linear-gradient(135deg, #4ecdc4, #1d4ed8)', // optional hover
                          },
                        }}
                        onClick={() => { setSelectedTeam(team.name); setShowDetail(true); }}
                      >
                        Detail
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modal detail aktivitas di luar loop dan grid utama */}
      {showDetail && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight={700}>
                Detail Aktivitas - {selectedTeam}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowDetail(false)}
                sx={{
                  mt: 1,
                  background: 'linear-gradient(135deg, #5de0e6, #2563eb)',
                  color: '#fff',
                  fontWeight: 600,
                  textTransform: 'none', // agar label tetap "Detail" tidak kapital semua
                }}
              >
                Tutup
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#8bb6ff' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Tanggal</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>No Loko</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Komponen</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Aktivitas</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Evidence</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
  {getTeamActivities(selectedTeam).map((row, idx) => (
    <TableRow key={idx}>
      <TableCell>{row.tanggal || row.tanggal_aktivitas || row.target_date || '-'}</TableCell>
      <TableCell>{row.noLoko || row.nomor_lokomotif || '-'}</TableCell>
      <TableCell>{row.komponen || '-'}</TableCell>
      <TableCell>{row.aktivitas || row.keterangan || '-'}</TableCell>
      <TableCell>
        {row.foto_path ? (
          <img src={row.foto_path} alt="evidence" style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 4 }} />
        ) : (
          row.foto ? <img src={row.foto} alt="evidence" style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 4 }} /> : '-'
        )}
      </TableCell>
    </TableRow>
  ))}
</TableBody>
              </Table>
            </TableContainer>
            {getTeamActivities(selectedTeam).length === 0 && (
              <Typography variant="body2" color="textSecondary">Belum ada data aktivitas untuk tim ini.</Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default ActionPlanDashboard;
