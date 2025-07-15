import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, Button, Chip, Avatar, Stack } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Dummy data for demonstration (replace with API or real data)
const totalManpower = [
  { label: 'Kepala UPT', value: 1 },
  { label: 'Supervisor', value: 4 },
  { label: 'Pengawas Gudang', value: 2 },
  { label: 'Tenisi Gudang', value: 1 },
  { label: 'Pengawas Fasilitas', value: 2 },
  { label: 'Teknisi Fasilitas', value: 2 },
  { label: 'Pengawas LOS', value: 2 },
  { label: 'MC Crew', value: 45 },
  { label: 'BKD MSA', value: 1 },
  { label: 'Pengawas DC', value: 2 },
  { label: 'DC Crew', value: 30 },
  { label: 'Calon Teknisi', value: 7 },
  { label: 'Calon Pegawai', value: 1 },
  { label: 'KAI Service', value: 2 },
];

const statusDTO = { labels: ['Sudah', 'Belum'], data: [70, 16] };
const diklatFungsional = { labels: ['5 Kali', '4 Kali', '3 Kali', '2 Kali', '1 Kali', 'Belum Pernah'], data: [2, 6, 20, 50, 8, 2] };
const sertifikasi = { labels: ['Oke', 'Belum', 'Expired', 'THS'], data: [60, 30, 6, 4] };
const tmtPensiun = { labels: ['> 5 Tahun', '< 2 Tahun', '< 5 Tahun'], data: [15, 5, 66] };
const pendidikan = { labels: ['SLTA', 'D3', 'D1', 'SD'], data: [60, 20, 4, 2] };

const manpowerTable = [
  { nipp: '12345', nama: 'Sumanto', jabatan: 'Teknisi Los', pensiun: '5 Tahun', dto: 'Done', sertifikasi: 'Oke' },
  { nipp: '12345', nama: 'Sumanto', jabatan: 'Teknisi Los', pensiun: '5 Tahun', dto: 'Done', sertifikasi: 'Expired' },
  { nipp: '12345', nama: 'Sumanto', jabatan: 'Teknisi Los', pensiun: '5 Tahun', dto: 'Belum', sertifikasi: 'Belum' },
  // ... tambahkan data lain sesuai kebutuhan
];

export default function ManpowerDataManage() {
  const [selectedRow, setSelectedRow] = useState(null);

  // Chart data
  const barOptions = { responsive: true, plugins: { legend: { display: false } } };

  return (
    <Box p={3}>
      <Grid container spacing={2}>
        {/* Kiri: Total Manpower */}
        <Grid item xs={12} md={3}>
          <Card sx={{ mb: 2, borderRadius: 2 }}>
            <CardContent>
              <Typography fontWeight={700} sx={{ color: '#1976d2', mb: 2 }}>Total Manpower</Typography>
              {totalManpower.map((row, idx) => (
                <Box display="flex" justifyContent="space-between" alignItems="center" key={idx}>
                  <Typography fontSize={13}>{row.label}</Typography>
                  <Chip label={row.value} size="small" color="primary" />
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Typography fontWeight={700} align="right">86</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Tengah: Chart dan Table */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            {/* STATUS DTO, DIKLAT, SERTIFIKASI */}
            <Grid item xs={12} md={4}>
              <Card sx={{ mb: 2, borderRadius: 2 }}>
                <CardContent>
                  <Typography fontWeight={700} sx={{ color: '#1976d2', mb: 1 }}>STATUS DTO</Typography>
                  <Bar data={{ labels: statusDTO.labels, datasets: [{ data: statusDTO.data, backgroundColor: ['#43a047', '#e53935'] }] }} options={barOptions} height={80} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ mb: 2, borderRadius: 2 }}>
                <CardContent>
                  <Typography fontWeight={700} sx={{ color: '#1976d2', mb: 1 }}>DIKLAT FUNGSIONAL</Typography>
                  <Bar data={{ labels: diklatFungsional.labels, datasets: [{ data: diklatFungsional.data, backgroundColor: '#1976d2' }] }} options={barOptions} height={80} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ mb: 2, borderRadius: 2 }}>
                <CardContent>
                  <Typography fontWeight={700} sx={{ color: '#1976d2', mb: 1 }}>SERTIFIKASI</Typography>
                  <Bar data={{ labels: sertifikasi.labels, datasets: [{ data: sertifikasi.data, backgroundColor: ['#43a047', '#ffd600', '#e53935', '#1976d2'] }] }} options={barOptions} height={80} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {/* TMT Pensiun, Pendidikan */}
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 2, borderRadius: 2 }}>
                <CardContent>
                  <Typography fontWeight={700} sx={{ color: '#1976d2', mb: 1 }}>TMT Pensiun</Typography>
                  <Bar data={{ labels: tmtPensiun.labels, datasets: [{ data: tmtPensiun.data, backgroundColor: ['#43a047', '#e53935', '#ffd600'] }] }} options={barOptions} height={80} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 2, borderRadius: 2 }}>
                <CardContent>
                  <Typography fontWeight={700} sx={{ color: '#1976d2', mb: 1 }}>PENDIDIKAN</Typography>
                  <Bar data={{ labels: pendidikan.labels, datasets: [{ data: pendidikan.data, backgroundColor: ['#1976d2', '#43a047', '#ffd600', '#e53935'] }] }} options={barOptions} height={80} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {/* Table Manpower */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#2196f3' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>NIPP</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>NAMA</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>JABATAN</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>PENSIUN</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>DTO</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>SERTIFIKASI</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {manpowerTable.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.nipp}</TableCell>
                        <TableCell>{row.nama}</TableCell>
                        <TableCell>{row.jabatan}</TableCell>
                        <TableCell>{row.pensiun}</TableCell>
                        <TableCell>{row.dto}</TableCell>
                        <TableCell>{row.sertifikasi}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Tabel Detail: DIKLAT FUNGSIONAL */}
      <Box mt={3}>
        <Card sx={{ borderRadius: 2, mb: 2 }}>
          <CardContent>
            <Typography fontWeight={700} sx={{ color: '#1976d2', mb: 1 }}>
              DETAIL MANPOWER PERKATEGORI : DIKLAT FUNGSIONAL
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#2196f3' }}>
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
                  {/* Dummy Data */}
                  <TableRow>
                    <TableCell>1234</TableCell>
                    <TableCell>ERFINDO ZICO SAPETA</TableCell>
                    <TableCell>TEKNISI GUDANG</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>1 Jan 2010</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>1 Jan 2010</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>1 Jan 2010</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>12234</TableCell>
                    <TableCell>AKMAL ZAMAL</TableCell>
                    <TableCell>TEKNISI LOS</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>1 Jan 2010</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>1 Jan 2010</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>1 Jan 2010</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>12234</TableCell>
                    <TableCell>FERRNARDO STUFO</TableCell>
                    <TableCell>KEPALA UPT</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>1 Jan 2010</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>1 Jan 2010</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>1 Jan 2010</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        {/* Tabel Detail: SERTIFIKASI */}
        <Card sx={{ borderRadius: 2, mb: 2 }}>
          <CardContent>
            <Typography fontWeight={700} sx={{ color: '#1976d2', mb: 1 }}>
              DETAIL MANPOWER PERKATEGORI : SERTIFIKASI
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#2196f3' }}>
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
                  {/* Dummy Data */}
                  <TableRow>
                    <TableCell>12234</TableCell>
                    <TableCell>ERFINDO ZICO SAPETA</TableCell>
                    <TableCell>TEKNISI GUDANG</TableCell>
                    <TableCell>PMS PELAKSANA</TableCell>
                    <TableCell>1 Jan 2010</TableCell>
                    <TableCell>PRS.070386.01628</TableCell>
                    <TableCell>1 Jan 2010</TableCell>
                    <TableCell>2 Tahun 0 Bulan 17 Hari</TableCell>
                    <TableCell>OK</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>12234</TableCell>
                    <TableCell>AKMAL ZAMAL</TableCell>
                    <TableCell>PMS PELAKSANA</TableCell>
                    <TableCell>PMS PELAKSANA</TableCell>
                    <TableCell>1 Jan 2010</TableCell>
                    <TableCell>PRS.070386.01628</TableCell>
                    <TableCell>1 Jan 1999</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>EXPIRED</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>12234</TableCell>
                    <TableCell>FERRNARDO STUFO</TableCell>
                    <TableCell>KEPALA UPT</TableCell>
                    <TableCell>THS</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>THS</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        {/* Tabel Detail: TMT Pensiun & Pendidikan */}
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography fontWeight={700} sx={{ color: '#1976d2', mb: 1 }}>
              DETAIL MANPOWER PERKATEGORI : TMT PENSIUN & PENDIDIKAN
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#2196f3' }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>NIPP</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>NAMA</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>JABATAN</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>PENDIDIKAN</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>USIA</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>TMT PENSIUN</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>COUNTER PENSIUN</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 700 }}>KATEGORI PENSIUN</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Dummy Data */}
                  <TableRow>
                    <TableCell>12234</TableCell>
                    <TableCell>ERFINDO ZICO SAPETA</TableCell>
                    <TableCell>TEKNISI GUDANG</TableCell>
                    <TableCell>SLTA</TableCell>
                    <TableCell>54 Tahun</TableCell>
                    <TableCell>1 Mar 2027</TableCell>
                    <TableCell>2 Tahun</TableCell>
                    <TableCell>&lt;5 Tahun</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>12234</TableCell>
                    <TableCell>AKMAL ZAMAL</TableCell>
                    <TableCell>SD</TableCell>
                    <TableCell>38 Tahun</TableCell>
                    <TableCell>1 Des 2040</TableCell>
                    <TableCell>15 Tahun</TableCell>
                    <TableCell>&gt;5 Tahun</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>12234</TableCell>
                    <TableCell>FERRNARDO STUFO</TableCell>
                    <TableCell>D3</TableCell>
                    <TableCell>23 Tahun</TableCell>
                    <TableCell>1 Agu 2028</TableCell>
                    <TableCell>3 Tahun</TableCell>
                    <TableCell>&lt;5 Tahun</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
