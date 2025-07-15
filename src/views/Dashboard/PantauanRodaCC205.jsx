import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, Divider } from '@mui/material';

const summaryData = [
  {
    title: 'DIAMETER',
    status: [
      { label: 'URGENT', value: 21, color: '#f44336', sub: '(890-938)' },
      { label: 'WARNING', value: 19, color: '#ff9800', sub: '(939-1016)' },
      { label: 'NORMAL', value: 45, color: '#4caf50', sub: '(1016-1067)' },
      { label: 'INVALID', value: 1, color: '#757575', sub: '(Out Range)' },
    ],
  },
  {
    title: 'F THICKNESS',
    status: [
      { label: 'URGENT', value: 18, color: '#f44336', sub: '(22/6 - 23/7)' },
      { label: 'WARNING', value: 32, color: '#ff9800', sub: '(23/8 - 25/4)' },
      { label: 'NORMAL', value: 35, color: '#4caf50', sub: '(25/4 - 29/4)' },
      { label: 'INVALID', value: 1, color: '#757575', sub: '(Out Range)' },
    ],
  },
  {
    title: 'F HEIGHT',
    status: [
      { label: 'URGENT', value: 0, color: '#f44336', sub: '(33)' },
      { label: 'WARNING', value: 2, color: '#ff9800', sub: '(33-32)' },
      { label: 'NORMAL', value: 64, color: '#4caf50', sub: '(28-30)' },
      { label: 'INVALID', value: 20, color: '#757575', sub: '(Out Range)' },
    ],
  },
];

const mainTableData = [
  { no: 1, loko: 'CC205 13 33', date: '7 Juni 2025', diameter: 1067, thickness: 37, height: 28, status: 'BGR', lifetime: '-4536 Day' },
  { no: 2, loko: 'CC205 13 37', date: '7 Juni 2025', diameter: 1067, thickness: 37, height: 28, status: 'BGR', lifetime: '-4536 Day' },
  { no: 3, loko: 'CC205 13 16', date: '7 Juni 2025', diameter: 1067, thickness: 37, height: 28, status: 'BGR', lifetime: '-4536 Day' },
  { no: 4, loko: 'CC205 14 04', date: '7 Juni 2025', diameter: 1067, thickness: 37, height: 28, status: 'BGR', lifetime: '-4536 Day' },
];

// Generate detail table data per parameter
const detailTableDataDiameter = mainTableData.map((row, idx) => ({
  no: row.no,
  loko: row.loko,
  date: row.date,
  r: Array.from({length: 12}, (_, i) => row.diameter) // dummy, replace with real data per roda jika ada
}));
const detailTableDataThickness = mainTableData.map((row, idx) => ({
  no: row.no,
  loko: row.loko,
  date: row.date,
  r: Array.from({length: 12}, (_, i) => row.thickness) // dummy, replace with real data per roda jika ada
}));
const detailTableDataHeight = mainTableData.map((row, idx) => ({
  no: row.no,
  loko: row.loko,
  date: row.date,
  r: Array.from({length: 12}, (_, i) => row.height) // dummy, replace with real data per roda jika ada
}));


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
  return (
    <Box p={3}>
      {/* Summary Box */}
      <Grid container spacing={3} mb={2}>
        {summaryData.map((sum, idx) => (
          <Grid item xs={12} md={4} key={sum.title}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, p: 0 }}>
              <CardContent>
                {['DIAMETER'].includes(sum.title) ? (
  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
    <Button variant="contained" color="primary" fullWidth sx={{ fontWeight: 700, fontSize: 18, bgcolor: '#448aff', color: '#fff', borderRadius: 2, py: 1.5 }} onClick={() => { setActiveParam('DIAMETER'); setOpenDetail(true); }}>
      Diameter
    </Button>
  </Box>
) : ['F THICKNESS'].includes(sum.title) ? (
  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
    <Button variant="contained" color="primary" fullWidth sx={{ fontWeight: 700, fontSize: 18, bgcolor: '#448aff', color: '#fff', borderRadius: 2, py: 1.5 }} onClick={() => { setActiveParam('F THICKNESS'); setOpenDetail(true); }}>
      F Thickness
    </Button>
  </Box>
) : ['F HEIGHT'].includes(sum.title) ? (
  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
    <Button variant="contained" color="primary" fullWidth sx={{ fontWeight: 700, fontSize: 18, bgcolor: '#448aff', color: '#fff', borderRadius: 2, py: 1.5 }} onClick={() => { setActiveParam('F HEIGHT'); setOpenDetail(true); }}>
      F Height
    </Button>
  </Box>
) : (
  <Typography align="center" fontWeight={700} sx={{ bgcolor: '#448aff', color: '#fff', borderRadius: 2, py: 1, mb: 2, fontSize: 18 }}>
    {sum.title}
  </Typography>
)}

                <Grid container spacing={1}>
                  {sum.status.map((st) => (
                    <Grid item xs={6} md={3} key={st.label}>
                      <Box sx={{ bgcolor: st.color, color: '#fff', borderRadius: 2, textAlign: 'center', py: 1.5, mb: 1, boxShadow: 1 }}>
                        <Typography fontWeight={700} fontSize={22}>{st.value}</Typography>
                        <Typography fontSize={12} fontWeight={500}>{st.label}</Typography>
                        <Typography fontSize={10} sx={{ opacity: 0.7 }}>{st.sub}</Typography>
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
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#1976d2' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>No.</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>LOCOMOTIVE NUMBER</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>INSPECTION DATE</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>MIN DIAMETER</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>MIN FLANGE THICKNESS</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>MIN FLANGE HEIGHT</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>ACTION STATUS</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>ESTIMATE LIFETIME</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mainTableData.map((row) => (
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
        {/* Modal detail parameter */}
        <Modal open={openDetail} onClose={() => setOpenDetail(false)}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', borderRadius: 3, boxShadow: 24, p: 3, minWidth: 900, maxWidth: '95vw', maxHeight: '90vh', overflow: 'auto' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight={700}>
                Detail Data Pantauan Roda per Parameter {activeParam}
              </Typography>
              <Button variant="outlined" size="small" onClick={() => setOpenDetail(false)}>Tutup</Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#ffecb3' }}>
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
  {(activeParam === 'DIAMETER' ? detailTableDataDiameter :
    activeParam === 'F THICKNESS' ? detailTableDataThickness :
    activeParam === 'F HEIGHT' ? detailTableDataHeight :
    []).map((row) => (
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
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}
