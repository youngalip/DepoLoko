import React, { useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Divider,
  Select, MenuItem, FormControl, InputLabel, OutlinedInput, Stack, TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const summaryData = [
  {
    title: 'DIAMETER',
    status: [
      { label: 'URGENT', value: 21, color: '#f44336', sub: '(890-938)' },
      { label: 'WARNING', value: 19, color: '#ff9800', sub: '(939-1016)' },
      { label: 'NORMAL', value: 45, color: '#4caf50', sub: '(1016-1067)' },
      { label: 'INVALID', value: 1, color: '#757575', sub: '(Out of Range)' },
    ],
  },
  {
    title: 'F THICKNESS',
    status: [
      { label: 'URGENT', value: 18, color: '#f44336', sub: '(22/6 - 23/7)' },
      { label: 'WARNING', value: 32, color: '#ff9800', sub: '(23/8 - 25/4)' },
      { label: 'NORMAL', value: 35, color: '#4caf50', sub: '(25/4 - 29/4)' },
      { label: 'INVALID', value: 1, color: '#757575', sub: '(Out of Range)' },
    ],
  },
  {
    title: 'F HEIGHT',
    status: [
      { label: 'URGENT', value: 0, color: '#f44336', sub: '(33)' },
      { label: 'WARNING', value: 2, color: '#ff9800', sub: '(33-32)' },
      { label: 'NORMAL', value: 64, color: '#4caf50', sub: '(28-30)' },
      { label: 'INVALID', value: 20, color: '#757575', sub: '(Out of Range)' },
    ],
  },
];

const mainTableData = [
  // 24 data awal (copy dari sebelumnya)
  { no: 1, loko: 'CC205 13 33', date: '2025-07-01', diameter: 900, thickness: 22, height: 27, status: 'URGENT', lifetime: '-4536 Day' },
  { no: 2, loko: 'CC205 13 37', date: '2025-07-02', diameter: 945, thickness: 24, height: 28, status: 'WARNING', lifetime: '-4000 Day' },
  { no: 3, loko: 'CC205 13 16', date: '2025-07-03', diameter: 1018, thickness: 27, height: 29, status: 'NORMAL', lifetime: '-3500 Day' },
  { no: 4, loko: 'CC205 14 04', date: '2025-07-04', diameter: 1065, thickness: 29, height: 30, status: 'NORMAL', lifetime: '-3200 Day' },
  { no: 5, loko: 'CC205 13 33', date: '2025-07-05', diameter: 890, thickness: 23, height: 27, status: 'URGENT', lifetime: '-3100 Day' },
  { no: 6, loko: 'CC205 13 37', date: '2025-07-06', diameter: 950, thickness: 25, height: 28, status: 'WARNING', lifetime: '-3000 Day' },
  { no: 7, loko: 'CC205 13 16', date: '2025-07-07', diameter: 1020, thickness: 27, height: 29, status: 'NORMAL', lifetime: '-2900 Day' },
  { no: 8, loko: 'CC205 14 04', date: '2025-07-08', diameter: 1067, thickness: 30, height: 30, status: 'NORMAL', lifetime: '-2800 Day' },
  { no: 9, loko: 'CC205 13 33', date: '2025-07-09', diameter: 938, thickness: 22, height: 27, status: 'URGENT', lifetime: '-2700 Day' },
  { no: 10, loko: 'CC205 13 37', date: '2025-07-10', diameter: 1010, thickness: 25, height: 28, status: 'WARNING', lifetime: '-2600 Day' },
  { no: 11, loko: 'CC205 13 16', date: '2025-07-11', diameter: 1040, thickness: 28, height: 29, status: 'NORMAL', lifetime: '-2500 Day' },
  { no: 12, loko: 'CC205 14 04', date: '2025-07-12', diameter: 980, thickness: 26, height: 30, status: 'WARNING', lifetime: '-2400 Day' },
  { no: 13, loko: 'CC205 13 33', date: '2025-07-13', diameter: 920, thickness: 23, height: 27, status: 'URGENT', lifetime: '-2300 Day' },
  { no: 14, loko: 'CC205 13 37', date: '2025-07-14', diameter: 965, thickness: 24, height: 28, status: 'WARNING', lifetime: '-2200 Day' },
  { no: 15, loko: 'CC205 13 16', date: '2025-07-15', diameter: 1025, thickness: 27, height: 29, status: 'NORMAL', lifetime: '-2100 Day' },
  { no: 16, loko: 'CC205 14 04', date: '2025-07-16', diameter: 1060, thickness: 29, height: 30, status: 'NORMAL', lifetime: '-2000 Day' },
  { no: 17, loko: 'CC205 13 33', date: '2025-07-17', diameter: 910, thickness: 22, height: 27, status: 'URGENT', lifetime: '-1900 Day' },
  { no: 18, loko: 'CC205 13 37', date: '2025-07-18', diameter: 940, thickness: 25, height: 28, status: 'EX KKA', lifetime: '-1800 Day' },
  { no: 19, loko: 'CC205 13 16', date: '2025-07-19', diameter: 1030, thickness: 28, height: 29, status: 'PANTAUAN RCD', lifetime: '-1700 Day' },
  { no: 20, loko: 'CC205 14 04', date: '2025-07-20', diameter: 1062, thickness: 30, height: 30, status: 'INVALID', lifetime: '-1600 Day' },
  { no: 21, loko: 'CC205 13 33', date: '2025-07-21', diameter: 900, thickness: 22, height: 27, status: 'URGENT', lifetime: '-1500 Day' },
  { no: 22, loko: 'CC205 13 37', date: '2025-07-22', diameter: 950, thickness: 25, height: 28, status: 'EX KKA', lifetime: '-1400 Day' },
  { no: 23, loko: 'CC205 13 16', date: '2025-07-23', diameter: 1035, thickness: 28, height: 29, status: 'PANTAUAN RCD', lifetime: '-1300 Day' },
  { no: 24, loko: 'CC205 14 04', date: '2025-07-24', diameter: 1055, thickness: 29, height: 30, status: 'INVALID', lifetime: '-1200 Day' },
  // Tambahan dummy data agar total 40 baris
  { no: 25, loko: 'CC205 13 33', date: '2025-07-25', diameter: 905, thickness: 23, height: 27, status: 'URGENT', lifetime: '-1190 Day' },
  { no: 26, loko: 'CC205 13 37', date: '2025-07-26', diameter: 948, thickness: 24, height: 28, status: 'WARNING', lifetime: '-1180 Day' },
  { no: 27, loko: 'CC205 13 16', date: '2025-07-27', diameter: 1015, thickness: 27, height: 29, status: 'NORMAL', lifetime: '-1170 Day' },
  { no: 28, loko: 'CC205 14 04', date: '2025-07-28', diameter: 1068, thickness: 29, height: 30, status: 'NORMAL', lifetime: '-1160 Day' },
  { no: 29, loko: 'CC205 13 33', date: '2025-07-29', diameter: 892, thickness: 23, height: 27, status: 'URGENT', lifetime: '-1150 Day' },
  { no: 30, loko: 'CC205 13 37', date: '2025-07-30', diameter: 954, thickness: 25, height: 28, status: 'WARNING', lifetime: '-1140 Day' },
  { no: 31, loko: 'CC205 13 16', date: '2025-07-31', diameter: 1022, thickness: 27, height: 29, status: 'NORMAL', lifetime: '-1130 Day' },
  { no: 32, loko: 'CC205 14 04', date: '2025-08-01', diameter: 1069, thickness: 30, height: 30, status: 'NORMAL', lifetime: '-1120 Day' },
  { no: 33, loko: 'CC205 13 33', date: '2025-08-02', diameter: 939, thickness: 22, height: 27, status: 'URGENT', lifetime: '-1110 Day' },
  { no: 34, loko: 'CC205 13 37', date: '2025-08-03', diameter: 1012, thickness: 25, height: 28, status: 'WARNING', lifetime: '-1100 Day' },
  { no: 35, loko: 'CC205 13 16', date: '2025-08-04', diameter: 1042, thickness: 28, height: 29, status: 'NORMAL', lifetime: '-1090 Day' },
  { no: 36, loko: 'CC205 14 04', date: '2025-08-05', diameter: 982, thickness: 26, height: 30, status: 'WARNING', lifetime: '-1080 Day' },
  { no: 37, loko: 'CC205 13 33', date: '2025-08-06', diameter: 922, thickness: 23, height: 27, status: 'URGENT', lifetime: '-1070 Day' },
  { no: 38, loko: 'CC205 13 37', date: '2025-08-07', diameter: 967, thickness: 24, height: 28, status: 'WARNING', lifetime: '-1060 Day' },
  { no: 39, loko: 'CC205 13 16', date: '2025-08-08', diameter: 1027, thickness: 27, height: 29, status: 'NORMAL', lifetime: '-1050 Day' },
  { no: 40, loko: 'CC205 14 04', date: '2025-08-09', diameter: 1061, thickness: 29, height: 30, status: 'NORMAL', lifetime: '-1040 Day' },
];



const cellColor = (val) => {
  if(val === 27) return '#e0e0e0'; // abu
  if(val === 28) return '#fffde7'; // kuning muda
  if(val === 29) return '#c8e6c9'; // hijau muda
  if(val === 30) return '#b2dfdb'; // biru muda
  return '#fff';
};

export default function PantauanRodaCC205() {
  const [openDetail, setOpenDetail] = useState(false);
  const [activeParam, setActiveParam] = useState('DIAMETER');

  // Filter state
  const statusOptions = ['URGENT', 'WARNING', 'NORMAL', 'INVALID', 'EX KKA', 'PANTAUAN RCD'];
  const uniqueLokos = [...new Set(mainTableData.map(row => row.loko))];
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLoko, setFilterLoko] = useState('');
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);

  // Filter logic main table
  const filteredMainTable = mainTableData.filter(row => {
    const statusMatch = filterStatus ? row.status === filterStatus : true;
    const lokoMatch = filterLoko ? row.loko === filterLoko : true;
    const dateMatch = (filterStartDate && filterEndDate)
      ? (new Date(row.date) >= new Date(filterStartDate) && new Date(row.date) <= new Date(filterEndDate))
      : true;
    return statusMatch && lokoMatch && dateMatch;
  });

  // Generate detail table data per parameter (berdasarkan filteredMainTable)
  const detailTableDataDiameter = filteredMainTable.map((row, idx) => ({
    no: row.no,
    loko: row.loko,
    date: row.date,
    r: Array.from({length: 12}, (_, i) => row.diameter)
  }));
  const detailTableDataThickness = filteredMainTable.map((row, idx) => ({
    no: row.no,
    loko: row.loko,
    date: row.date,
    r: Array.from({length: 12}, (_, i) => row.thickness)
  }));
  const detailTableDataHeight = filteredMainTable.map((row, idx) => ({
    no: row.no,
    loko: row.loko,
    date: row.date,
    r: Array.from({length: 12}, (_, i) => row.height)
  }));

  // Filter state for detail table
  const [detailFilterLoko, setDetailFilterLoko] = useState('');
  const [detailFilterStartDate, setDetailFilterStartDate] = useState(null);
  const [detailFilterEndDate, setDetailFilterEndDate] = useState(null);
  // Detail table data by param
  const getFilteredDetail = (data) =>
    data.filter(row => {
      const lokoMatch = detailFilterLoko ? row.loko === detailFilterLoko : true;
      const dateMatch = (detailFilterStartDate && detailFilterEndDate)
        ? (new Date(row.date) >= new Date(detailFilterStartDate) && new Date(row.date) <= new Date(detailFilterEndDate))
        : true;
      return lokoMatch && dateMatch;
    });

  return (
    <Box sx={{ flexGrow: 1, mt: 2, minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ position: 'relative', mb: 4 }}>
        <Card sx={{ background: '#f8fafc', color: '#2196f3', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(13,41,86,0.08)' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', minHeight: 120, px: { xs: 2, md: 5 }, py: { xs: 3, md: 4 } }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#1e3a8a', mb: 1 }}>
                Pantauan Roda CC205
              </Typography>
              <Typography variant="body1" sx={{ color: '#334155' }}>
                Dashboard monitoring kondisi roda lokomotif CC205
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      {/* Summary Box */}
      <Grid container spacing={3} mb={2}>
        {/* Summary box mengikuti filteredMainTable */}
        {summaryData.map((sum, idx) => (
          <Grid item xs={12} md={4} key={sum.title}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, p: 0 }}>
              <CardContent>
                {['DIAMETER'].includes(sum.title) ? (
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      fontWeight: 700,
                      fontSize: 18,
                      background: 'linear-gradient(135deg, #5de0e6, #2563eb)',
                      color: '#fff',
                      borderRadius: 2,
                      py: 1.5,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4ecdc4, #1d4ed8)', // optional hover gradient
                      },
                    }}
                    onClick={() => {
                      setActiveParam('DIAMETER');
                      setOpenDetail(true);
                    }}
                  >
                    Diameter
                  </Button>
                </Box>
                ) : ['F THICKNESS'].includes(sum.title) ? (
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        fontWeight: 700,
                        fontSize: 18,
                        background: 'linear-gradient(135deg, #5de0e6, #2563eb)',
                        color: '#fff',
                        borderRadius: 2,
                        py: 1.5,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #4ecdc4, #1d4ed8)', // optional hover gradient
                        },
                      }}
                      onClick={() => {
                        setActiveParam('F THICKNESS');
                        setOpenDetail(true);
                      }}
                    >
                      F Thickness
                    </Button>
                  </Box>
                ) : ['F HEIGHT'].includes(sum.title) ? (
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        fontWeight: 700,
                        fontSize: 18,
                      background: 'linear-gradient(135deg, #5de0e6, #2563eb)',
                      color: '#fff',
                      borderRadius: 2,
                      py: 1.5,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4ecdc4, #1d4ed8)', // optional hover gradient
                      },
                    }}
                    onClick={() => {
                      setActiveParam('F HEIGHT');
                      setOpenDetail(true);
                    }}
                  >
                    F Height
                  </Button>
                </Box>
                ) : (
                  <Typography align="center" fontWeight={700} sx={{ bgcolor: '#2563eb', color: '#fff', borderRadius: 2, py: 1, mb: 2, fontSize: 18 }}>
                    {sum.title}
                  </Typography>
                )}

                <Grid container spacing={1}>
                  {(sum.status || []).map((st) => (
                    <Grid item xs={6} md={3} key={st.label}>
                      <Box
                        sx={{
                          bgcolor: st.color,
                          color: '#fff',
                          borderRadius: 2,
                          textAlign: 'center',
                          mb: 1,
                          boxShadow: 1,
                          minHeight: { xs: 72, sm: 90 },
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          px: 1,
                          overflow: 'hidden',
                          minWidth: 0,
                        }}
                      >
                        <Typography fontWeight={700} fontSize={{ xs: 16, sm: 20, md: 22 }} sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{st.value}</Typography>
                        <Typography fontWeight={500} sx={{ fontSize: 'clamp(7.5px, 1.7vw, 11px)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', wordBreak: 'normal', lineHeight: 1.15, maxWidth: '100%', flexShrink: 1, minWidth: 0 }}>{st.label}</Typography>
                        <Typography sx={{ fontSize: 'clamp(7px, 1.2vw, 9.5px)', opacity: 0.7, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', wordBreak: 'normal', lineHeight: 1.1, maxWidth: '100%', flexShrink: 1, minWidth: 0 }}>{st.sub}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Main Table */}
      <Box mb={2}>
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2, maxHeight: 400, overflowY: 'auto' }}>
          {/* FILTER MAIN TABLE */}
          <Box px={2} pt={2} pb={1}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  input={<OutlinedInput label="Status" />}
                >
                  <MenuItem value=""><em>Semua</em></MenuItem>
                  {statusOptions.map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Seri Lokomotif</InputLabel>
                <Select
                  value={filterLoko}
                  onChange={e => setFilterLoko(e.target.value)}
                  input={<OutlinedInput label="Seri Lokomotif" />}
                >
                  <MenuItem value=""><em>Semua</em></MenuItem>
                  {uniqueLokos.map(loko => (
                    <MenuItem key={loko} value={loko}>{loko}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <DatePicker
                label="Tanggal Awal"
                value={filterStartDate}
                onChange={setFilterStartDate}
                slotProps={{ textField: { size: 'small', sx: { minWidth: 140 } } }}
                format="yyyy-MM-dd"
              />
              <DatePicker
                label="Tanggal Akhir"
                value={filterEndDate}
                onChange={setFilterEndDate}
                slotProps={{ textField: { size: 'small', sx: { minWidth: 140 } } }}
                format="yyyy-MM-dd"
              />
              <Button variant="outlined" size="small" onClick={() => { setFilterStatus(''); setFilterLoko(''); setFilterStartDate(null); setFilterEndDate(null); }}>Reset</Button>
            </Stack>
          </Box>
          <Table size="small" stickyHeader>
            <TableHead stickyHeader>
  <TableRow>
    <TableCell sx={{ background: '#2196f3', color: '#fff', fontWeight: 700 }}>No.</TableCell>
    <TableCell sx={{ background: '#2196f3', color: '#fff', fontWeight: 700 }}>LOCOMOTIVE NUMBER</TableCell>
    <TableCell sx={{ background: '#2196f3', color: '#fff', fontWeight: 700 }}>INSPECTION DATE</TableCell>
    <TableCell sx={{ background: '#2196f3', color: '#fff', fontWeight: 700 }}>MIN DIAMETER</TableCell>
    <TableCell sx={{ background: '#2196f3', color: '#fff', fontWeight: 700 }}>MIN FLANGE THICKNESS</TableCell>
    <TableCell sx={{ background: '#2196f3', color: '#fff', fontWeight: 700 }}>MIN FLANGE HEIGHT</TableCell>
    <TableCell sx={{ background: '#2196f3', color: '#fff', fontWeight: 700 }}>ACTION STATUS</TableCell>
    <TableCell sx={{ background: '#2196f3', color: '#fff', fontWeight: 700 }}>ESTIMATE LIFETIME</TableCell>
  </TableRow>
</TableHead>
            <TableBody>
               {filteredMainTable.map((row) => (
                <TableRow key={row.no}>
                  <TableCell>{row.no}</TableCell>
                  <TableCell>{row.loko}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.diameter}</TableCell>
                  <TableCell>{row.thickness}</TableCell>
                  <TableCell>{row.height}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.lifetime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* Tombol detail di box F HEIGHT */}
      <Box>
        {/* Inline detail parameter */}
        {openDetail && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              {/* FILTER DETAIL TABLE */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" mb={2}>
                <FormControl sx={{ minWidth: 180 }}>
                  <InputLabel>Seri Lokomotif</InputLabel>
                  <Select
                    value={detailFilterLoko}
                    onChange={e => setDetailFilterLoko(e.target.value)}
                    input={<OutlinedInput label="Seri Lokomotif" />}
                  >
                    <MenuItem value=""><em>Semua</em></MenuItem>
                    {uniqueLokos.map(loko => (
                      <MenuItem key={loko} value={loko}>{loko}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <DatePicker
                  label="Tanggal Awal"
                  value={detailFilterStartDate}
                  onChange={setDetailFilterStartDate}
                  slotProps={{ textField: { size: 'small', sx: { minWidth: 140 } } }}
                  format="yyyy-MM-dd"
                />
                <DatePicker
                  label="Tanggal Akhir"
                  value={detailFilterEndDate}
                  onChange={setDetailFilterEndDate}
                  slotProps={{ textField: { size: 'small', sx: { minWidth: 140 } } }}
                  format="yyyy-MM-dd"
                />
                <Button variant="outlined" size="small" onClick={() => { setDetailFilterLoko(''); setDetailFilterStartDate(null); setDetailFilterEndDate(null); }}>Reset</Button>
                <Button variant="outlined" size="small" onClick={() => setOpenDetail(false)}>Tutup</Button>
              </Stack>
              <Divider sx={{ mb: 2 }} />
               <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 1, maxHeight: 400, overflowY: 'auto' }}>
                 <Table size="small" stickyHeader>
                  <TableHead stickyHeader>
                    <TableRow sx={{ bgcolor: '#8bb6ff' }}>
                      <TableCell sx={{ fontWeight: 700 }}>LOKOMOTIF</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>TANGGAL</TableCell>
                      {activeParam === 'DIAMETER' && Array.from({length: 6}).map((_, idx) => [
                        <TableCell key={`r${idx+1}kiri`} sx={{ fontWeight: 700 }}>{`R${idx+1} Kiri`}</TableCell>,
                        <TableCell key={`r${idx+1}kanan`} sx={{ fontWeight: 700 }}>{`R${idx+1} Kanan`}</TableCell>
                      ])}
                      {activeParam === 'F THICKNESS' && Array.from({length: 6}).map((_, idx) => [
                        <TableCell key={`r${idx+1}kiri`} sx={{ fontWeight: 700 }}>{`R${idx+1} Kiri`}</TableCell>,
                        <TableCell key={`r${idx+1}kanan`} sx={{ fontWeight: 700 }}>{`R${idx+1} Kanan`}</TableCell>
                      ])}
                      {activeParam === 'F HEIGHT' && Array.from({length: 6}).map((_, idx) => [
                        <TableCell key={`r${idx+1}kiri`} sx={{ fontWeight: 700 }}>{`R${idx+1} Kiri`}</TableCell>,
                        <TableCell key={`r${idx+1}kanan`} sx={{ fontWeight: 700 }}>{`R${idx+1} Kanan`}</TableCell>
                      ])}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFilteredDetail(
                      activeParam === 'DIAMETER' ? detailTableDataDiameter :
                      activeParam === 'F THICKNESS' ? detailTableDataThickness :
                      activeParam === 'F HEIGHT' ? detailTableDataHeight :
                      []
                    ).map((row) => (
                      <TableRow key={row.no}>
                        <TableCell>{row.loko}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        {Array.from({length: 6}).flatMap((_, idx) => [
                          <TableCell key={`r${idx+1}kiri`} sx={{ bgcolor: cellColor(row.r[idx*2]), fontWeight: 600 }}>{row.r[idx*2]}</TableCell>,
                          <TableCell key={`r${idx+1}kanan`} sx={{ bgcolor: cellColor(row.r[idx*2+1]), fontWeight: 600 }}>{row.r[idx*2+1]}</TableCell>
                        ])}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {(activeParam === 'DIAMETER' && detailTableDataDiameter.length === 0 ||
                activeParam === 'F THICKNESS' && detailTableDataThickness.length === 0 ||
                activeParam === 'F HEIGHT' && detailTableDataHeight.length === 0) && (
                <Typography align="center" sx={{ mt: 2 }}>
                  Belum ada data
                </Typography>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}
