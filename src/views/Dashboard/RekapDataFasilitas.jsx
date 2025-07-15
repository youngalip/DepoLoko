import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, Button } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// Dummy data for demonstration (replace with real data or API integration)
// Kategori utama
const kategoriUtama = [
  'ALAT ANGKUT',
  'FASILITAS EVAKUASI',
  'FASILITAS SAFETY',
  'FASILITAS PERAWATAN',
  'FASILITAS PENDUKUNG',
];

// Data detail fasilitas (satu sumber untuk semua visual) dipindahkan ke dalam komponen untuk menghindari redeklarasi


// Data rekap kategori dan bar chart dipindahkan ke dalam komponen untuk akses ke detailFasilitas

const pieChartData = {
  labels: ['DAMKAR', 'Operator Forklift', 'Operator Overhead Crane', 'Operator Railway Crane', 'Petugas PSK', 'Operator Hyd Jack', 'Operator Kompresor'],
  datasets: [
    {
      data: [16, 12, 7, 5, 8, 4, 3],
      backgroundColor: ['#42a5f5', '#66bb6a', '#ffa726', '#ab47bc', '#ef5350', '#1976d2', '#ff9800'],
    },
  ],
};

const sertifikasiPersonel = [
  { nipp: '12345', nama: 'Agus Santoso', jabatan: 'Pengawas Railway', sertifikat: 'Operator Forklift', ket: 'Komandan', noSertifikat: '082/2019/KAO/26/VI/2023', masaAktif: '2 Tahun' },
  { nipp: '23456', nama: 'Budi Hartono', jabatan: 'Operator', sertifikat: 'Operator Overhead Crane', ket: 'Anggota', noSertifikat: '083/2019/KAO/26/VI/2023', masaAktif: '2 Tahun' },
  { nipp: '34567', nama: 'Citra Dewi', jabatan: 'Operator', sertifikat: 'Operator Railway Crane', ket: 'Anggota', noSertifikat: '084/2019/KAO/26/VI/2023', masaAktif: '2 Tahun' },
  { nipp: '45678', nama: 'Dedi Kurniawan', jabatan: 'Petugas PSK', sertifikat: 'Operator Hyd Jack', ket: 'Anggota', noSertifikat: '085/2019/KAO/26/VI/2023', masaAktif: '2 Tahun' },
  { nipp: '56789', nama: 'Eka Putri', jabatan: 'Operator', sertifikat: 'Operator Kompresor', ket: 'Anggota', noSertifikat: '086/2019/KAO/26/VI/2023', masaAktif: '2 Tahun' },
  { nipp: '67890', nama: 'Fajar Pratama', jabatan: 'Operator', sertifikat: 'Operator Forklift', ket: 'Anggota', noSertifikat: '087/2019/KAO/26/VI/2023', masaAktif: '2 Tahun' },
  { nipp: '78901', nama: 'Gilang Saputra', jabatan: 'Operator', sertifikat: 'Operator Overhead Crane', ket: 'Anggota', noSertifikat: '088/2019/KAO/26/VI/2023', masaAktif: '2 Tahun' },
  { nipp: '89012', nama: 'Hanafi', jabatan: 'Operator', sertifikat: 'Operator Railway Crane', ket: 'Anggota', noSertifikat: '089/2019/KAO/26/VI/2023', masaAktif: '2 Tahun' },
];

export default function RekapDataFasilitas() {
  const [selectedKategori, setSelectedKategori] = useState('ALAT ANGKUT');
  const [openDetail, setOpenDetail] = useState(false);

  // Data detail fasilitas (satu sumber untuk semua visual) dipindahkan ke dalam komponen untuk menghindari redeklarasi
  const detailFasilitas = [
    { kategori: 'ALAT ANGKUT', nama: 'FORKLIFT 3 TON', jumlah: 3, satuan: 'Unit', good: 2, fine: 1, bad: 0, tahunPengadaan: 2018, tahunMulaiDinas: 2018, tglPerawatan: '12 JUNI 2025', uji: 'SERTIFIKASI', masaBerlaku: '3 Ton', spesifikasi: 'Diesel, 3 Ton, 4m' },
    { kategori: 'ALAT ANGKUT', nama: 'RAILWAY CRANE', jumlah: 2, satuan: 'Unit', good: 2, fine: 0, bad: 0, tahunPengadaan: 2015, tahunMulaiDinas: 2015, tglPerawatan: '30 MEI 2025', uji: 'SERTIFIKASI', masaBerlaku: '20 Ton', spesifikasi: '20 Ton, 15m' },
    { kategori: 'FASILITAS EVAKUASI', nama: 'STRETCHER', jumlah: 10, satuan: 'Unit', good: 8, fine: 2, bad: 0, tahunPengadaan: 2020, tahunMulaiDinas: 2020, tglPerawatan: '10 JULI 2025', uji: 'INSPEKSI', masaBerlaku: '-', spesifikasi: 'Aluminium, Lipat' },
    { kategori: 'FASILITAS EVAKUASI', nama: 'EMERGENCY EXIT', jumlah: 5, satuan: 'Pintu', good: 5, fine: 0, bad: 0, tahunPengadaan: 2019, tahunMulaiDinas: 2019, tglPerawatan: '15 JUNI 2025', uji: 'INSPEKSI', masaBerlaku: '-', spesifikasi: 'Pintu Besi' },
    { kategori: 'FASILITAS SAFETY', nama: 'APAR', jumlah: 20, satuan: 'Unit', good: 18, fine: 2, bad: 0, tahunPengadaan: 2022, tahunMulaiDinas: 2022, tglPerawatan: '01 JULI 2025', uji: 'SERTIFIKASI', masaBerlaku: '1 Tahun', spesifikasi: 'ABC Powder, 6kg' },
    { kategori: 'FASILITAS SAFETY', nama: 'SAFETY HELMET', jumlah: 50, satuan: 'Unit', good: 49, fine: 1, bad: 0, tahunPengadaan: 2021, tahunMulaiDinas: 2021, tglPerawatan: '01 JULI 2025', uji: 'INSPEKSI', masaBerlaku: '-', spesifikasi: 'SNI, Biru/Putih' },
    { kategori: 'FASILITAS PERAWATAN', nama: 'HYDRAULIC JACK', jumlah: 4, satuan: 'Unit', good: 3, fine: 1, bad: 0, tahunPengadaan: 2017, tahunMulaiDinas: 2017, tglPerawatan: '20 JUNI 2025', uji: 'SERTIFIKASI', masaBerlaku: '5 Ton', spesifikasi: '5 Ton, Manual' },
    { kategori: 'FASILITAS PERAWATAN', nama: 'AIR COMPRESSOR', jumlah: 3, satuan: 'Unit', good: 2, fine: 1, bad: 0, tahunPengadaan: 2016, tahunMulaiDinas: 2016, tglPerawatan: '21 JUNI 2025', uji: 'SERTIFIKASI', masaBerlaku: '3 Tahun', spesifikasi: '10 Bar, 3 HP' },
    { kategori: 'FASILITAS PENDUKUNG', nama: 'OVERHEAD CRANE', jumlah: 2, satuan: 'Unit', good: 2, fine: 0, bad: 0, tahunPengadaan: 2016, tahunMulaiDinas: 2016, tglPerawatan: '24 FEBRUARI 2025', uji: 'SERTIFIKASI', masaBerlaku: '16 Ton', spesifikasi: '16 Ton, 12m' },
    { kategori: 'FASILITAS PENDUKUNG', nama: 'LAMPU PORTABLE', jumlah: 12, satuan: 'Unit', good: 11, fine: 1, bad: 0, tahunPengadaan: 2023, tahunMulaiDinas: 2023, tglPerawatan: '25 JUNI 2025', uji: 'INSPEKSI', masaBerlaku: '-', spesifikasi: 'LED, Rechargeable' },
  ];

  // Data rekap kategori (tabel atas) di-generate otomatis dari detailFasilitas
  const kategoriData = kategoriUtama.map(kat => {
    const rows = detailFasilitas.filter(row => row.kategori === kat);
    return {
      kategori: kat,
      jumlah: rows.reduce((a, b) => a + (b.jumlah || 0), 0),
      good: rows.reduce((a, b) => a + (b.good || 0), 0),
      fine: rows.reduce((a, b) => a + (b.fine || 0), 0),
      bad: rows.reduce((a, b) => a + (b.bad || 0), 0),
      tgl: rows.length > 0 ? rows[0].tglPerawatan || rows[0].tgl : '-',
      nama: rows.length > 0 ? rows[0].nama : '-', // Ensure 'nama' is available for the table
    };
  });

  // Data bar chart juga otomatis dari detailFasilitas
  const barChartData = {
    labels: kategoriUtama,
    datasets: [
      {
        label: 'GOOD',
        backgroundColor: '#43a047',
        data: kategoriUtama.map(kat => detailFasilitas.filter(row => row.kategori === kat).reduce((a, b) => a + (b.good || 0), 0)),
      },
      {
        label: 'FINE',
        backgroundColor: '#ffd600',
        data: kategoriUtama.map(kat => detailFasilitas.filter(row => row.kategori === kat).reduce((a, b) => a + (b.fine || 0), 0)),
      },
      {
        label: 'BAD',
        backgroundColor: '#e53935',
        data: kategoriUtama.map(kat => detailFasilitas.filter(row => row.kategori === kat).reduce((a, b) => a + (b.bad || 0), 0)),
      },
    ],
  };

  return (
    <Box p={3}>
      {/* Kategori Table */}
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#1976d2', mb: 2 }}>
            REKAP DATA FASILITAS
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#2196f3' }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>KATEGORI</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>NAMA FASILITAS / ALAT KERJA</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>JUMLAH</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>GOOD</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>FINE</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>BAD</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>TANGGAL PERAWATAN</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {kategoriData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.kategori}</TableCell>
                    <TableCell>{row.nama}</TableCell>
                    <TableCell>{row.jumlah}</TableCell>
                    <TableCell>{row.good}</TableCell>
                    <TableCell>{row.fine}</TableCell>
                    <TableCell>{row.bad}</TableCell>
                    <TableCell>{row.tgl}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Bar Chart Status Fasilitas per Kategori */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {barChartData.labels.map((label, idx) => (
  <Grid item xs={12} sm={6} md={2.4} key={label}>
    <Card sx={{ borderRadius: 2, boxShadow: 2, position: 'relative' }}>
      <CardContent>
        <Typography fontWeight={700} fontSize={13} align="center" sx={{ mb: 1 }}>{label}</Typography>
        <Bar
          data={{
            labels: ['GOOD', 'FINE', 'BAD'],
            datasets: [
              {
                label: 'Jumlah',
                data: [barChartData.datasets[0].data[idx], barChartData.datasets[1].data[idx], barChartData.datasets[2].data[idx]],
                backgroundColor: ['#43a047', '#ffd600', '#e53935'],
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } },
          }}
          height={90}
        />
        <Typography align="center" fontSize={12} sx={{ mt: 1 }}>JUMLAH: {barChartData.datasets[0].data[idx] + barChartData.datasets[1].data[idx] + barChartData.datasets[2].data[idx]}</Typography>
        <Button
          size="small"
          variant={openDetail && selectedKategori === label ? 'outlined' : 'contained'}
          sx={{ mt: 2, bgcolor: openDetail && selectedKategori === label ? '#fff' : '#1976d2', color: openDetail && selectedKategori === label ? '#1976d2' : '#fff', borderColor: '#1976d2', fontSize: 11, py: 0.5, px: 2, minWidth: 0, boxShadow: 'none', position: 'static' }}
          onClick={() => {
            setSelectedKategori(label);
            setOpenDetail(true);
          }}
        >
          Detail
        </Button>
      </CardContent>
    </Card>
  </Grid>
))}

{/* Detail Fasilitas per Kategori tampil di bawah, mirip detail aktivitas tim ActionPlanDashboard */}
{openDetail && (
  <Card sx={{ mt: 3 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Detail Fasilitas - {selectedKategori}
        </Typography>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => setOpenDetail(false)}
        >
          Tutup
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#ffecb3' }}>
              <TableCell sx={{ fontWeight: 700 }}>Nama Fasilitas</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Jumlah</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Satuan</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Good</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Fine</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Bad</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tahun Pengadaan</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tahun Mulai Dinas</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tanggal Perawatan</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Uji/Kalibrasi/Verifikasi</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Masa Berlaku</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Spesifikasi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detailFasilitas
              .filter(row => row.kategori === selectedKategori || selectedKategori === row.nama || selectedKategori === 'ALAT ANGKUT')
              .map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.nama}</TableCell>
                  <TableCell>{row.jumlah}</TableCell>
                  <TableCell>{row.satuan}</TableCell>
                  <TableCell>{row.good}</TableCell>
                  <TableCell>{row.fine}</TableCell>
                  <TableCell>{row.bad}</TableCell>
                  <TableCell>{row.tahunPengadaan}</TableCell>
                  <TableCell>{row.tahunMulaiDinas}</TableCell>
                  <TableCell>{row.tglPerawatan}</TableCell>
                  <TableCell>{row.uji}</TableCell>
                  <TableCell>{row.masaBerlaku}</TableCell>
                  <TableCell>{row.spesifikasi}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {detailFasilitas.filter(row => row.kategori === selectedKategori || selectedKategori === row.nama || selectedKategori === 'ALAT ANGKUT').length === 0 && (
        <Typography variant="body2" color="textSecondary">Belum ada data fasilitas untuk kategori ini.</Typography>
      )}
    </CardContent>
  </Card>
)}
      </Grid>

      {/* Pie Chart & Sertifikasi Personel */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 2, boxShadow: 2, height: '100%' }}>
            <CardContent>
              <Pie data={pieChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} height={200} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography fontWeight={700} fontSize={13} sx={{ mb: 1 }}>
                SERTIFIKAT SIO PERSONEL
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#2196f3' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>NIPP</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>NAMA</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>JABATAN</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>SERTIFIKAT</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>KET</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>NO SERTIFIKAT</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700 }}>MASA AKTIF</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sertifikasiPersonel.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.nipp}</TableCell>
                        <TableCell>{row.nama}</TableCell>
                        <TableCell>{row.jabatan}</TableCell>
                        <TableCell>{row.sertifikat}</TableCell>
                        <TableCell>{row.ket}</TableCell>
                        <TableCell>{row.noSertifikat}</TableCell>
                        <TableCell>{row.masaAktif}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
