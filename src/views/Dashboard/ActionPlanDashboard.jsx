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
  Stack
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


const actionPlanData = [
  // Tim Flying Gang
  { komponen: 'Relay GR', plan: 80, actual: 60, pic: 'TIM FLYING GANG' },
  { komponen: 'Kompresor', plan: 90, actual: 75, pic: 'TIM FLYING GANG' },
  { komponen: 'Plug PD2', plan: 85, actual: 70, pic: 'TIM FLYING GANG' },
  { komponen: 'Wiper', plan: 70, actual: 50, pic: 'TIM FLYING GANG' },
  { komponen: 'Pemasir', plan: 80, actual: 60, pic: 'TIM FLYING GANG' },
  { komponen: 'Motor Blower', plan: 100, actual: 80, pic: 'TIM FLYING GANG' },
  { komponen: 'EM2000', plan: 85, actual: 60, pic: 'TIM FLYING GANG' },
  { komponen: 'BPCP', plan: 90, actual: 85, pic: 'TIM FLYING GANG' },
  { komponen: 'MPIO', plan: 80, actual: 60, pic: 'TIM FLYING GANG' },
  { komponen: 'Flexible Hose', plan: 80, actual: 65, pic: 'TIM FLYING GANG' },
  { komponen: 'PSU 500', plan: 85, actual: 70, pic: 'TIM FLYING GANG' },
  { komponen: 'PCM 500', plan: 90, actual: 80, pic: 'TIM FLYING GANG' },
  { komponen: 'MPU', plan: 85, actual: 70, pic: 'TIM FLYING GANG' },
  { komponen: 'IPM', plan: 80, actual: 60, pic: 'TIM FLYING GANG' },
  { komponen: 'Power Supply Module', plan: 85, actual: 70, pic: 'TIM FLYING GANG' },
  { komponen: 'VDCL', plan: 80, actual: 60, pic: 'TIM FLYING GANG' },

  // Tim PRL
  { komponen: 'IPM', plan: 85, actual: 60, pic: 'TIM PRL' },
  { komponen: 'Blower Motor MG', plan: 80, actual: 60, pic: 'TIM PRL' },
  { komponen: 'Dustbin Blower', plan: 85, actual: 70, pic: 'TIM PRL' },
  { komponen: 'Fan Radiator', plan: 90, actual: 80, pic: 'TIM PRL' },
  { komponen: 'Blower Traksi Motor', plan: 90, actual: 70, pic: 'TIM PRL' },
  { komponen: 'Power Supply Module', plan: 85, actual: 60, pic: 'TIM PRL' },

  // Tim Self Test
  { komponen: 'PCM 500', plan: 80, actual: 60, pic: 'TIM SELF TEST' },

  // Tim Revisi
  { komponen: 'Blower Motor MG', plan: 80, actual: 60, pic: 'TIM REVISI' },
  { komponen: 'Dustbin Blower', plan: 85, actual: 70, pic: 'TIM REVISI' },
  { komponen: 'Fan Radiator', plan: 90, actual: 80, pic: 'TIM REVISI' },
  { komponen: 'Blower Traksi Motor', plan: 90, actual: 70, pic: 'TIM REVISI' },

  // Tim Truck
  { komponen: 'Pemasir', plan: 80, actual: 60, pic: 'TIM TRUCK' },
  { komponen: 'Roda', plan: 90, actual: 80, pic: 'TIM TRUCK' },

  // Tim Elektrik
  { komponen: 'Motor Blower', plan: 100, actual: 90, pic: 'TIM ELEKTRIK' },
  { komponen: 'PSU 500', plan: 90, actual: 80, pic: 'TIM ELEKTRIK' },
  { komponen: 'EFCO', plan: 85, actual: 70, pic: 'TIM ELEKTRIK' },
  { komponen: 'Companion Alternator', plan: 80, actual: 65, pic: 'TIM ELEKTRIK' },
  { komponen: 'EM2000', plan: 85, actual: 70, pic: 'TIM ELEKTRIK' },
  { komponen: 'VDCL', plan: 80, actual: 60, pic: 'TIM ELEKTRIK' },
  { komponen: 'Power Supply Module', plan: 85, actual: 70, pic: 'TIM ELEKTRIK' },
  { komponen: 'PCM 500', plan: 90, actual: 80, pic: 'TIM ELEKTRIK' },
  { komponen: 'MPU', plan: 85, actual: 70, pic: 'TIM ELEKTRIK' },
  { komponen: 'Fuel Pump', plan: 80, actual: 75, pic: 'TIM ELEKTRIK' },
  { komponen: 'Relay GR', plan: 80, actual: 70, pic: 'TIM ELEKTRIK' },
  { komponen: 'IPM', plan: 85, actual: 80, pic: 'TIM ELEKTRIK' },
  { komponen: 'MPIO', plan: 80, actual: 70, pic: 'TIM ELEKTRIK' },
  { komponen: 'BPCP', plan: 90, actual: 85, pic: 'TIM ELEKTRIK' },

  // Tim Engine
  { komponen: 'Flexible Hose', plan: 80, actual: 70, pic: 'TIM ENGINE' },
  { komponen: 'Water Pump', plan: 85, actual: 80, pic: 'TIM ENGINE' },
  { komponen: 'Turbocharger', plan: 90, actual: 85, pic: 'TIM ENGINE' },
  { komponen: 'Fuel Pump', plan: 80, actual: 75, pic: 'TIM ENGINE' },
  { komponen: 'Power Assembly', plan: 90, actual: 85, pic: 'TIM ENGINE' },

  // Tim Angin
  { komponen: 'Wiper', plan: 70, actual: 60, pic: 'TIM ANGIN' },
  { komponen: 'BPCP', plan: 90, actual: 80, pic: 'TIM ANGIN' },
  { komponen: 'Kompresor', plan: 90, actual: 75, pic: 'TIM ANGIN' }
];

// Hitung persentase progres tiap tim secara dinamis
function getTeamPercent(teamName) {
  const data = actionPlanData.filter(d => d.pic === teamName);
  if (!data.length) return 0;
  const totalPlan = data.reduce((a, b) => a + b.plan, 0);
  const totalActual = data.reduce((a, b) => a + b.actual, 0);
  return Number(Math.min((totalActual / totalPlan) * 100, 100).toFixed(2));
}

// Fungsi untuk mengambil total plan dan actual per tim
function getTeamTotal(teamName) {
  const data = actionPlanData.filter(d => d.pic === teamName);
  return {
    plan: data.reduce((a, b) => a + b.plan, 0),
    actual: data.reduce((a, b) => a + b.actual, 0)
  };
}

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

function getAchievement(data) {
  if (!data.length) return 0;
  const totalPlan = data.reduce((a, b) => a + b.plan, 0);
  const totalActual = data.reduce((a, b) => a + b.actual, 0);
  const achievement = totalPlan ? (totalActual / totalPlan) * 100 : 0;
  return Math.min(achievement, 100).toFixed(2); // Ensure max 100%
}

// Data detail aktivitas per tim, konsisten dengan actionPlanData
import evidenceAktivitas from 'assets/images/evidence-aktivitas.jpg';
const teamActivities = {
  'TIM FLYING GANG': [
    { tanggal: '2025-06-10', noLoko: 'CC 1302', komponen: 'Relay GR', aktivitas: 'Pemeriksaan Relay GR', evidence: evidenceAktivitas },
    { tanggal: '2025-06-11', noLoko: 'CC 1302', komponen: 'Kompresor', aktivitas: 'Pemeriksaan Kompresor', evidence: '' },
    { tanggal: '2025-06-12', noLoko: 'CC 1302', komponen: 'Plug PD2', aktivitas: 'Pemeriksaan Plug PD2', evidence: '' },
    { tanggal: '2025-06-13', noLoko: 'CC 1302', komponen: 'Wiper', aktivitas: 'Pemeriksaan Wiper', evidence: '' },
    { tanggal: '2025-06-14', noLoko: 'CC 1302', komponen: 'Pemasir', aktivitas: 'Pemeriksaan Pemasir', evidence: '' },
    { tanggal: '2025-06-15', noLoko: 'CC 1302', komponen: 'Motor Blower', aktivitas: 'Pemeriksaan Motor Blower', evidence: '' },
    { tanggal: '2025-06-16', noLoko: 'CC 1302', komponen: 'EM2000', aktivitas: 'Pemeriksaan EM2000', evidence: '' },
    { tanggal: '2025-06-17', noLoko: 'CC 1302', komponen: 'BPCP', aktivitas: 'Pemeriksaan BPCP', evidence: '' },
    { tanggal: '2025-06-18', noLoko: 'CC 1302', komponen: 'MPIO', aktivitas: 'Pemeriksaan MPIO', evidence: '' },
    { tanggal: '2025-06-19', noLoko: 'CC 1302', komponen: 'Flexible Hose', aktivitas: 'Pemeriksaan Flexible Hose', evidence: '' },
    { tanggal: '2025-06-20', noLoko: 'CC 1302', komponen: 'PSU 500', aktivitas: 'Pemeriksaan PSU 500', evidence: '' },
    { tanggal: '2025-06-21', noLoko: 'CC 1302', komponen: 'PCM 500', aktivitas: 'Pemeriksaan PCM 500', evidence: '' },
    { tanggal: '2025-06-22', noLoko: 'CC 1302', komponen: 'MPU', aktivitas: 'Pemeriksaan MPU', evidence: '' },
    { tanggal: '2025-06-23', noLoko: 'CC 1302', komponen: 'IPM', aktivitas: 'Pemeriksaan IPM', evidence: '' },
    { tanggal: '2025-06-24', noLoko: 'CC 1302', komponen: 'Power Supply Module', aktivitas: 'Pemeriksaan Power Supply Module', evidence: '' },
    { tanggal: '2025-06-25', noLoko: 'CC 1302', komponen: 'VDCL', aktivitas: 'Pemeriksaan VDCL', evidence: '' }
  ],
  'TIM PRL': [
    { tanggal: '2025-06-26', noLoko: 'CC 1304', komponen: 'IPM', aktivitas: 'Pemeriksaan IPM', evidence: '/src/assets/images/logo-kai.png' },
    { tanggal: '2025-06-27', noLoko: 'CC 1304', komponen: 'Blower Motor MG', aktivitas: 'Pemeriksaan Blower Motor MG', evidence: '/src/assets/images/logo-kai.png' },
    { tanggal: '2025-06-28', noLoko: 'CC 1304', komponen: 'Dustbin Blower', aktivitas: 'Pemeriksaan Dustbin Blower', evidence: '/src/assets/images/logo-kai.png' },
    { tanggal: '2025-06-29', noLoko: 'CC 1304', komponen: 'Fan Radiator', aktivitas: 'Pemeriksaan Fan Radiator', evidence: '/src/assets/images/logo-kai.png' },
    { tanggal: '2025-06-30', noLoko: 'CC 1304', komponen: 'Blower Traksi Motor', aktivitas: 'Pemeriksaan Blower Traksi Motor', evidence: '/src/assets/images/logo-kai.png' },
    { tanggal: '2025-07-01', noLoko: 'CC 1304', komponen: 'Power Supply Module', aktivitas: 'Pemeriksaan Power Supply Module', evidence: '/src/assets/images/logo-kai.png' }
  ],
  'TIM SELF TEST': [
    { tanggal: '2025-07-02', noLoko: 'CC 1305', komponen: 'PCM 500', aktivitas: 'Pemeriksaan PCM 500', evidence: '/src/assets/images/logo-kai.png' }
  ]
};

function getTeamActivities(team) {
  return teamActivities[team] || [];
}

function ActionPlanDashboard() {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [showDetail, setShowDetail] = useState(false);

  // Filter data by team
  const filteredData = selectedTeam
    ? actionPlanData.filter((d) => d.pic && d.pic.toLowerCase().includes(selectedTeam.toLowerCase().replace('tim ', '')))
    : actionPlanData;

  // Achievement data
  const achievement = getAchievement(filteredData);
  
  // Pie chart data (max 100%)
  const pieData = {
    labels: ['Achievement', 'Remaining'],
    datasets: [{
      data: [achievement, 100 - achievement],
      backgroundColor: ['#4CAF50', '#E0E0E0'],
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
        backgroundColor: '#1976d2',
        borderRadius: 4,
        barPercentage: 0.5,
      },
      {
        type: 'bar',
        label: 'Actual',
        data: filteredData.map((d) => d.actual),
        backgroundColor: '#ff9800',
        borderRadius: 4,
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
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700}>Monitoring Action Plan</Typography>
        <Typography variant="body2" color="textSecondary">Realisasi Pekerjaan Per Komponen</Typography>
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
              <Typography variant="subtitle1" fontWeight={700} mb={2} sx={{ color: '#fff', bgcolor: '#1976d2', px: 2, py: 1, borderRadius: 1 }}>
                TABEL REALISASI ACTION PLAN TIAP KOMPONEN
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 0, borderRadius: 2, maxHeight: 440 }}>
  <Table size="small" sx={{ width: '100%' }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#1976d2' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>No</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Komponen</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Lagging Indicator</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Leading Indicator</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Target</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>PIC</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Plan</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Actual</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Realisasi (%)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {actionPlanData.map((row, idx) => (
                      <TableRow key={idx} sx={{ bgcolor: idx % 2 === 0 ? '#f5f7fa' : '#fff' }}>
                        <TableCell sx={{ fontSize: 12, py: 0.5 }}>{idx+1}</TableCell>
                        <TableCell sx={{ fontSize: 12, py: 0.5 }}>{row.komponen}</TableCell>
<TableCell sx={{ fontSize: 12, py: 0.5 }}>{row.lagging || 'Contoh lagging...'}</TableCell>
<TableCell sx={{ fontSize: 12, py: 0.5 }}>{row.leading || 'Contoh leading...'}</TableCell>
<TableCell sx={{ fontSize: 12, py: 0.5 }}>{row.target || 'Setiap Perawatan'}</TableCell>
<TableCell sx={{ fontSize: 12, py: 0.5 }}>{row.pic || 'Engine'}</TableCell>
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
        <Button size="small" variant="contained" sx={{ mt: 1 }} onClick={() => { setSelectedTeam(team.name); setShowDetail(true); }}>
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
              >
                Tutup
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#ffecb3' }}>
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
                      <TableCell>{row.tanggal}</TableCell>
                      <TableCell>{row.noLoko}</TableCell>
                      <TableCell>{row.komponen}</TableCell>
                      <TableCell>{row.aktivitas}</TableCell>
                      <TableCell>
                        {row.evidence ? (
                          <img src={row.evidence} alt="evidence" style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 4 }} />
                        ) : '-'}
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
