import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
  Autocomplete
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector } from 'react-redux';

const blueGradient = 'linear-gradient(180deg, #5de0e6, #004aad)';

const tabLabels = [
  'Data Manpower',
  'Pantauan Roda',
  'Action Plan',
  'Fasilitas'
];

function TabPanel({ children, value, index }) {
  return value === index && (
    <Box sx={{ pt: 2 }}>{children}</Box>
  );
}

export default function InputDataMultiKategori() {
  // Ambil role user dari Redux (default ke 'user' jika tidak ada)
  const role = useSelector(state => state.auth?.user?.role || 'user');
  const [tab, setTab] = useState(1);

  // Auto sync role-based UI: jika role berubah ke 'user', paksa tab ke Pantauan Roda
  useEffect(() => {
    if (role === 'user' && tab !== 1) setTab(1);
  }, [role]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State for each form
  const [manpower, setManpower] = useState({
  nipp: '',
  nama: '',
  jabatan: '',
  regu: '',
  tempatLahir: '',
  tanggalLahir: null,
  tmtPensiun: null,
  pendidikan: '',
  diklatT2PRS: null,
  diklatT2PMS: null,
  diklatT3PRS: null,
  diklatT3PMS: null,
  diklatT4: null,
  diklatSMDP: null,
  diklatJMDP: null,
  diklatDIKSAR: null,
  sertifikasi: '',
  nomorSertifikat: '',
  tanggalTerbitSertifikat: null,
  masaBerlakuSertifikat: null,
  dtoPRS: null,
  dtoPMS: null
});
  const [pantauan, setPantauan] = useState({ diameter: '', flensKanan: '', flensKiri: '', tinggiKanan: '', tinggiKiri: '' });
  const nomorLokomotifOptions = [
  'CC 205 01', 'CC 205 02', 'CC 205 03', 'CC 205 04', 'CC 205 05', 'CC 205 06', 'CC 205 07', 'CC 205 08', 'CC 205 09', 'CC 205 10',
];
const komponenOptions = [
  'Engine', 'Transmisi', 'Rem', 'Sistem Listrik', 'Body', 'Chassis', 'Roda', 'Tangki', 'Sistem Pendingin', 'Lampu',
];
const aktivitasOptions = [
  'Pemeriksaan', 'Perbaikan', 'Penggantian', 'Pembersihan', 'Pengujian', 'Kalibrasi', 'Pengecatan', 'Pengelasan',
];

const [actionPlan, setActionPlan] = useState({
  namaPemeriksa: '',
  tanggal: null,
  nomorLokomotif: '',
  komponen: '',
  aktivitas: '',
  foto: null,
  fotoError: '',
  fotoPreview: null,
});
const kategoriFasilitasOptions = [
  'Alat Angkut', 'Evakuasi', 'Safety', 'Perawatan', 'Pendukung',
];
const kategoriStandardisasiOptions = [
  'UJI BERKALA', 'KALIBRASI', 'VERIFIKASI',
];

const [fasilitas, setFasilitas] = useState({
  nomorAset: '',
  namaPemeriksa: '',
  kategori: '',
  namaFasilitas: '',
  jumlahSatuan: '',
  baik: '',
  pantauan: '',
  rusak: '',
  spesifikasi: '',
  merk: '',
  tahunPengadaan: '',
  tahunMulaiDinas: '',
  tanggalPerawatan: null,
  kategoriStandardisasi: '',
  tanggalSertifikasi: null,
  lokasiPenyimpanan: '',
  umurKomponen: '',
  foto: null,
  fotoError: '',
  fotoPreview: null,
});

  // Handlers
const handleTabChange = (_, newValue) => setTab(newValue);
const handleManpowerChange = (e) => setManpower({ ...manpower, [e.target.name]: e.target.value });
const handleManpowerDateChange = (field, value) => setManpower({ ...manpower, [field]: value });
const handlePantauanChange = (e) => setPantauan({ ...pantauan, [e.target.name]: e.target.value });
const handleActionPlanChange = (e) => setActionPlan({ ...actionPlan, [e.target.name]: e.target.value });
const handleActionPlanDateChange = (value) => setActionPlan({ ...actionPlan, tanggal: value });
const handleActionPlanSelectChange = (field, value) => setActionPlan({ ...actionPlan, [field]: value });

const handleActionPlanFile = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      setActionPlan((prev) => ({ ...prev, foto: null, fotoError: 'Ukuran file maksimal 10MB', fotoPreview: null }));
      return;
    }
    setActionPlan((prev) => ({ ...prev, foto: file, fotoError: '', fotoPreview: URL.createObjectURL(file) }));
  }
};

const handleActionPlanDrop = (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      setActionPlan((prev) => ({ ...prev, foto: null, fotoError: 'Ukuran file maksimal 10MB', fotoPreview: null }));
      return;
    }
    setActionPlan((prev) => ({ ...prev, foto: file, fotoError: '', fotoPreview: URL.createObjectURL(file) }));
  }
};
const handleActionPlanDragOver = (e) => e.preventDefault();
const handleFasilitasChange = (e) => setFasilitas({ ...fasilitas, [e.target.name]: e.target.value });
const handleFasilitasSelectChange = (field, value) => setFasilitas({ ...fasilitas, [field]: value });
const handleFasilitasDateChange = (field, value) => setFasilitas({ ...fasilitas, [field]: value });
const handleFasilitasFile = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      setFasilitas((prev) => ({ ...prev, foto: null, fotoError: 'Ukuran file maksimal 10MB', fotoPreview: null }));
      return;
    }
    setFasilitas((prev) => ({ ...prev, foto: file, fotoError: '', fotoPreview: URL.createObjectURL(file) }));
  }
};
const handleFasilitasDrop = (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      setFasilitas((prev) => ({ ...prev, foto: null, fotoError: 'Ukuran file maksimal 10MB', fotoPreview: null }));
      return;
    }
    setFasilitas((prev) => ({ ...prev, foto: file, fotoError: '', fotoPreview: URL.createObjectURL(file) }));
  }
};
const handleFasilitasDragOver = (e) => e.preventDefault();

  // File inputs
  // (handleActionPlanFile and handleFasilitasFile already defined above with validation and preview handling)

  // Integrasi submit ke backend
const handleSubmit = async (kategori) => {
  let data;
  switch (kategori) {
    case 'manpower':
    case 'actionPlan':
    case 'fasilitas':
      if (role === 'user') return; // user tidak boleh submit ini
      break;
    default:
      break;
  }

  switch (kategori) {
    case 'manpower':
      data = manpower;
      break;
    case 'pantauan':
      data = pantauan;
      break;
    case 'actionPlan':
      data = actionPlan;
      break;
    case 'fasilitas':
      data = fasilitas;
      break;
    default:
      data = {};
  }

  if (kategori === 'fasilitas') {
    // Mapping field camelCase ke snake_case sesuai tabel DB
    const fasilitasPayload = {
      nomor_aset: data.nomorAset,
      nama_fasilitas: data.namaFasilitas,
      kategori: data.kategori,
      jumlah_satuan: data.jumlahSatuan ? parseInt(data.jumlahSatuan) : 0,
      baik: data.baik ? parseInt(data.baik) : 0,
      pantauan: data.pantauan ? parseInt(data.pantauan) : 0,
      rusak: data.rusak ? parseInt(data.rusak) : 0,
      spesifikasi: data.spesifikasi,
      merk: data.merk,
      tahun_pengadaan: data.tahunPengadaan ? parseInt(data.tahunPengadaan) : null,
      tahun_mulai_dinas: data.tahunMulaiDinas ? parseInt(data.tahunMulaiDinas) : null,
      tanggal_perawatan: data.tanggalPerawatan ? new Date(data.tanggalPerawatan).toISOString().slice(0,10) : null,
      kategori_standardisasi: data.kategoriStandardisasi,
      tanggal_sertifikasi: data.tanggalSertifikasi ? new Date(data.tanggalSertifikasi).toISOString().slice(0,10) : null,
      lokasi_penyimpanan: data.lokasiPenyimpanan,
      umur_komponen: data.umurKomponen ? parseInt(data.umurKomponen) : null,
      foto_path: data.foto ? data.foto.name : null, // Untuk demo, hanya simpan nama file
      is_active: true
    };
    try {
      const res = await fetch('/api/fasilitas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fasilitasPayload)
      });
      if (res.ok) {
        alert('Data fasilitas berhasil disimpan!');
        // Optionally, reset form here
      } else {
        const err = await res.json();
        alert('Gagal menyimpan data fasilitas: ' + (err.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Gagal menyimpan data fasilitas: ' + error.message);
    }
    return;
  }

  // Untuk kategori lain, tetap pakai alert simulasi
  alert('Data disimpan untuk kategori: ' + kategori + '\n' + JSON.stringify(data, null, 2));
};  

  // Form UI
  const formCardStyle = {
    borderRadius: 4,
    boxShadow: 3,
    mb: 3,
    bgcolor: '#fff',
    p: { xs: 2, md: 4 },
    maxWidth: 600,
    mx: 'auto',
  };

  const headerStyle = {
    background: blueGradient,
    color: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    px: 3,
    py: 2,
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    minHeight: 56
  };

  // --- FORMS ---
  const pendidikanOptions = [
  'SMA/SMK', 'D3', 'D4', 'S1', 'S2', 'S3'
];
const sertifikasiOptions = [
  'Sertifikat A', 'Sertifikat B', 'Sertifikat C', 'Sertifikat D'
];

const ManpowerForm = (
  <Card sx={formCardStyle}>
    <Box sx={headerStyle}>
      <Typography variant="h6" fontWeight={700}>Input Data Manpower</Typography>
    </Box>
    <CardContent>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2}>
          {/* Identitas Dasar */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Identitas Dasar</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 0 }}><TextField name="nipp" label="NIPP" fullWidth value={manpower.nipp} onChange={handleManpowerChange} size="small" sx={{ mb: { xs: 2, md: 0 } }} /></Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 0 }}><TextField name="nama" label="Nama" fullWidth value={manpower.nama} onChange={handleManpowerChange} size="small" sx={{ mb: { xs: 2, md: 0 } }} /></Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 0 }}><TextField name="jabatan" label="Jabatan" fullWidth value={manpower.jabatan} onChange={handleManpowerChange} size="small" sx={{ mb: { xs: 2, md: 0 } }} /></Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 0 }}><TextField name="regu" label="Regu" fullWidth value={manpower.regu} onChange={handleManpowerChange} size="small" sx={{ mb: { xs: 2, md: 0 } }} /></Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 0 }}><TextField name="tempatLahir" label="Tempat Lahir" fullWidth value={manpower.tempatLahir} onChange={handleManpowerChange} size="small" sx={{ mb: { xs: 2, md: 0 } }} /></Grid>
          <Grid item xs={12} md={3} sx={{ minWidth: 0 }}>
            <DatePicker
              label="Tanggal Lahir"
              value={manpower.tanggalLahir}
              onChange={(v) => handleManpowerDateChange('tanggalLahir', v)}
              slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mb: { xs: 2, md: 0 } } } }}
            />
          </Grid>
          <Grid item xs={12} md={3} sx={{ minWidth: 0 }}>
            <DatePicker
              label="TMT Pensiun"
              value={manpower.tmtPensiun}
              onChange={(v) => handleManpowerDateChange('tmtPensiun', v)}
              slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mb: { xs: 2, md: 0 } } } }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
            <Autocomplete
              options={pendidikanOptions}
              value={manpower.pendidikan}
              onChange={(_, v) => setManpower({ ...manpower, pendidikan: v })}
              renderInput={(params) => <TextField {...params} label="Pendidikan Diakui" fullWidth size="small" />}
              fullWidth
              disableClearable
              autoHighlight
              sx={{ mb: { xs: 2, md: 0 } }}
            />
          </Grid>
          {/* Pendidikan & Diklat */}
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Pendidikan & Diklat</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} md={3} sx={{ minWidth: 0 }}><DatePicker label="Diklat T2 PRS" value={manpower.diklatT2PRS} onChange={(v) => handleManpowerDateChange('diklatT2PRS', v)} slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mb: { xs: 2, md: 0 } } } }} /></Grid>
          <Grid item xs={12} md={3} sx={{ minWidth: 0 }}><DatePicker label="Diklat T2 PMS" value={manpower.diklatT2PMS} onChange={(v) => handleManpowerDateChange('diklatT2PMS', v)} slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mb: { xs: 2, md: 0 } } } }} /></Grid>
          <Grid item xs={12} md={3} sx={{ minWidth: 0 }}><DatePicker label="Diklat T3 PRS" value={manpower.diklatT3PRS} onChange={(v) => handleManpowerDateChange('diklatT3PRS', v)} slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mb: { xs: 2, md: 0 } } } }} /></Grid>
          <Grid item xs={12} md={3} sx={{ minWidth: 0 }}><DatePicker label="Diklat T3 PMS" value={manpower.diklatT3PMS} onChange={(v) => handleManpowerDateChange('diklatT3PMS', v)} slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mb: { xs: 2, md: 0 } } } }} /></Grid>
          <Grid item xs={12} md={3} sx={{ minWidth: 0 }}><DatePicker label="Diklat T4" value={manpower.diklatT4} onChange={(v) => handleManpowerDateChange('diklatT4', v)} slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mb: { xs: 2, md: 0 } } } }} /></Grid>
          <Grid item xs={12} md={3} sx={{ minWidth: 0 }}><DatePicker label="SMDP" value={manpower.diklatSMDP} onChange={(v) => handleManpowerDateChange('diklatSMDP', v)} slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mb: { xs: 2, md: 0 } } } }} /></Grid>
          <Grid item xs={12} md={3} sx={{ minWidth: 0 }}><DatePicker label="JMDP" value={manpower.diklatJMDP} onChange={(v) => handleManpowerDateChange('diklatJMDP', v)} slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mb: { xs: 2, md: 0 } } } }} /></Grid>
          <Grid item xs={12} md={3} sx={{ minWidth: 0 }}><DatePicker label="DIKSAR" value={manpower.diklatDIKSAR} onChange={(v) => handleManpowerDateChange('diklatDIKSAR', v)} slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mb: { xs: 2, md: 0 } } } }} /></Grid>
          {/* Sertifikasi */}
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Sertifikasi</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} md={4} sx={{ minWidth: 0 }}>
            <Autocomplete
              options={sertifikasiOptions}
              value={manpower.sertifikasi}
              onChange={(_, v) => setManpower({ ...manpower, sertifikasi: v })}
              renderInput={(params) => <TextField {...params} label="Jenis Sertifikasi" fullWidth size="small" />}
              fullWidth
              disableClearable
              autoHighlight
              sx={{ mb: { xs: 2, md: 0 } }}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ minWidth: 0 }}><TextField name="nomorSertifikat" label="Nomor Sertifikat" fullWidth value={manpower.nomorSertifikat} onChange={handleManpowerChange} size="small" sx={{ mb: { xs: 2, md: 0 } }} /></Grid>
          <Grid item xs={12} md={2} sx={{ minWidth: 0 }}><DatePicker label="Tanggal Terbit" value={manpower.tanggalTerbitSertifikat} onChange={(v) => handleManpowerDateChange('tanggalTerbitSertifikat', v)} slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mb: { xs: 2, md: 0 } } } }} /></Grid>
          <Grid item xs={12} md={2} sx={{ minWidth: 0 }}><DatePicker label="Masa Berlaku" value={manpower.masaBerlakuSertifikat} onChange={(v) => handleManpowerDateChange('masaBerlakuSertifikat', v)} slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mb: { xs: 2, md: 0 } } } }} /></Grid>
          {/* Status Teknik Operasi */}
          <Grid item xs={12} sx={{ mt: 3 }}>
  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Status Teknik Operasi</Typography>
  <Divider sx={{ mb: 2 }} />
</Grid>
<Grid item xs={12} md={6} sx={{ minWidth: 0 }}><DatePicker label="DTO PRS" value={manpower.dtoPRS} onChange={(v) => handleManpowerDateChange('dtoPRS', v)} slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mb: { xs: 2, md: 0 } } } }} /></Grid>
<Grid item xs={12} md={6} sx={{ minWidth: 0 }}><DatePicker label="DTO PMS" value={manpower.dtoPMS} onChange={(v) => handleManpowerDateChange('dtoPMS', v)} slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mb: { xs: 2, md: 0 } } } }} /></Grid>
</Grid>
</LocalizationProvider>
<Box display="flex" gap={2} mt={4}>
  {role === 'admin' && (
    <>
      <Button variant="contained" color="primary" sx={{ fontWeight: 700, minWidth: 120, px: 4, borderRadius: 3, background: blueGradient, boxShadow: 2 }} onClick={() => handleSubmit('manpower')}>Simpan</Button>
    </>
  )}
</Box>
</CardContent>
</Card>
);

// Identitas Dasar fields for Pantauan Roda
const identitasDasarPantauanFields = [
  { name: 'nipp', label: 'NIPP', helper: 'Nomor Induk Pegawai' },
  { name: 'nama', label: 'Nama Pegawai', helper: 'Nama lengkap petugas' },
  { name: 'jabatan', label: 'Jabatan', helper: 'Jabatan pegawai' },
  { name: 'depo', label: 'Depo', helper: 'Nama depo' },
  { name: 'nomorLokomotif', label: 'Nomor Lokomotif', helper: 'Nomor identitas lokomotif' }
];

const wheelLabels = [1,2,3,4,5,6];
const sectionConfigs = [
  {
    key: 'diameter',
    title: 'Diameter Roda',
    subtitle: 'Wheel Diameter',
    bg: 'linear-gradient(90deg, #5de0e6 0%, #2563eb 100%)',
    inputs: wheelLabels.map(n => ([
      {
        name: `diameterRight${n}`,
        label: `Right Wheel ${n} – Wheel Diameter`,
        helper: `Roda ${n} Kanan – Diameter Roda`
      },
      {
        name: `diameterLeft${n}`,
        label: `Left Wheel ${n} – Wheel Diameter`,
        helper: `Roda ${n} Kiri – Diameter Roda`
      }
    ])).flat()
  },
  {
    key: 'flangeThickness',
    title: 'Ketebalan Flens',
    subtitle: 'Flange Thickness',
    bg: 'linear-gradient(90deg, #e0e7ff 0%, #2563eb 100%)',
    inputs: wheelLabels.map(n => ([
      {
        name: `flangeThicknessRight${n}`,
        label: `Right Wheel ${n} – Flange Thickness`,
        helper: `Roda ${n} Kanan – Ketebalan Flens`
      },
      {
        name: `flangeThicknessLeft${n}`,
        label: `Left Wheel ${n} – Flange Thickness`,
        helper: `Roda ${n} Kiri – Ketebalan Flens`
      }
    ])).flat()
  },
  {
    key: 'flangeHeight',
    title: 'Ketinggian Flens',
    subtitle: 'Flange Height',
    bg: 'linear-gradient(90deg, #f5f7fa 0%, #2563eb 100%)',
    inputs: wheelLabels.map(n => ([
      {
        name: `flangeHeightRight${n}`,
        label: `Right Wheel ${n} – Flange Height`,
        helper: `Roda ${n} Kanan – Ketinggian Flens`
      },
      {
        name: `flangeHeightLeft${n}`,
        label: `Left Wheel ${n} – Flange Height`,
        helper: `Roda ${n} Kiri – Ketinggian Flens`
      }
    ])).flat()
  }
];

const checklistIcon = <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', mr: 1 }}><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#2563eb"/><path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Box>;

const [pantauanRoda, setPantauanRoda] = useState(() => {
  const state = {};
  identitasDasarPantauanFields.forEach(f => { state[f.name] = ''; });
  sectionConfigs.forEach(sec => sec.inputs.forEach(inp => { state[inp.name] = ''; }));
  return state;
});
const handlePantauanRodaChange = e => setPantauanRoda({ ...pantauanRoda, [e.target.name]: e.target.value });

const PantauanRodaForm = (
  <Card sx={formCardStyle}>
    {/* Identitas Dasar Section */}
    <Box sx={{ mb: 4, borderRadius: 3, boxShadow: 1, bgcolor: '#f8fafc' }}>
      <Box sx={{
        background: 'linear-gradient(90deg, #5de0e6 0%, #2563eb 100%)',
        color: '#fff',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        px: 3,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        mb: 2
      }}>
        {checklistIcon}
        <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1 }}>Identitas Dasar <span style={{ fontWeight: 400, opacity: 0.7, marginLeft: 8 }}>(Basic Identity)</span></Typography>
      </Box>
      <CardContent sx={{ pt: 0 }}>
        <Grid container spacing={2}>
          {identitasDasarPantauanFields.map((f, i) => (
            <Grid item xs={12} md={6} key={f.name} sx={{ minWidth: 0 }}>
              <TextField
                name={f.name}
                label={f.label}
                value={pantauanRoda[f.name]}
                onChange={handlePantauanRodaChange}
                fullWidth
                size="small"
                helperText={f.helper}
                sx={{ mb: { xs: 2, md: 0 } }}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Box>
    {sectionConfigs.map((section, idx) => (
      <Box key={section.key} sx={{ mb: 4, borderRadius: 3, boxShadow: 1, bgcolor: '#f8fafc' }}>
        <Box sx={{
          background: section.bg,
          color: '#fff',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          px: 3,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          mb: 2
        }}>
          {checklistIcon}
          <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1 }}>{section.title} <span style={{ fontWeight: 400, opacity: 0.7, marginLeft: 8 }}>({section.subtitle})</span></Typography>
        </Box>
        <CardContent sx={{ pt: 0 }}>
          <Grid container spacing={2}>
            {section.inputs.map((inp, i) => (
              <Grid item xs={12} md={6} key={inp.name} sx={{ minWidth: 0 }}>
                <TextField
                  name={inp.name}
                  label={inp.label}
                  value={pantauanRoda[inp.name]}
                  onChange={handlePantauanRodaChange}
                  fullWidth
                  size="small"
                  helperText={inp.helper}
                  sx={{ mb: { xs: 2, md: 0 } }}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Box>
    ))}
    <Box display="flex" gap={2} mt={2} mb={1} justifyContent="flex-end">
      <Button variant="contained" color="primary" sx={{ fontWeight: 700, minWidth: 120, px: 4, borderRadius: 3, background: blueGradient, boxShadow: 2 }} onClick={() => handleSubmit('pantauanRoda')}>Simpan</Button>
    </Box>
  </Card>
);


  const ActionPlanForm = (
  <Card sx={formCardStyle}>
    {/* Card Header */}
    <Box sx={{
      background: 'linear-gradient(90deg, #5de0e6 0%, #2563eb 100%)',
      color: '#fff',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      px: 3,
      py: 2,
      mb: 2,
      display: 'flex',
      alignItems: 'center',
      minHeight: 56
    }}>
      <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: 1 }}>ACTION PLAN</Typography>
    </Box>
    <CardContent>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2}>
          {/* Nama Pemeriksa */}
          <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
            <TextField
              name="namaPemeriksa"
              label="Nama Pemeriksa"
              value={actionPlan.namaPemeriksa}
              onChange={handleActionPlanChange}
              fullWidth
              size="small"
              helperText="Nama lengkap pemeriksa"
            />
          </Grid>
          {/* Tanggal Pelaksanaan */}
          <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
            <DatePicker
              label="Tanggal Pelaksanaan"
              value={actionPlan.tanggal}
              onChange={handleActionPlanDateChange}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
          </Grid>
          {/* Nomor Lokomotif */}
          <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
            <Autocomplete
              options={nomorLokomotifOptions}
              value={actionPlan.nomorLokomotif}
              onChange={(_, v) => handleActionPlanSelectChange('nomorLokomotif', v)}
              renderInput={(params) => <TextField {...params} label="Nomor Lokomotif" fullWidth size="small" helperText="Pilih nomor lokomotif" />}
              fullWidth
              disableClearable
              autoHighlight
            />
          </Grid>
          {/* Komponen Action Plan */}
          <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
            <Autocomplete
              options={komponenOptions}
              value={actionPlan.komponen}
              onChange={(_, v) => handleActionPlanSelectChange('komponen', v)}
              renderInput={(params) => <TextField {...params} label="Komponen Action Plan" fullWidth size="small" helperText="Pilih komponen" />}
              fullWidth
              disableClearable
              autoHighlight
            />
          </Grid>
          {/* Aktivitas Action Plan */}
          <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
            <Autocomplete
              options={aktivitasOptions}
              value={actionPlan.aktivitas}
              onChange={(_, v) => handleActionPlanSelectChange('aktivitas', v)}
              renderInput={(params) => <TextField {...params} label="Aktivitas Action Plan" fullWidth size="small" helperText="Pilih aktivitas" />}
              fullWidth
              disableClearable
              autoHighlight
            />
          </Grid>
          {/* Upload Foto Action Plan */}
          <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
            <Box
              onDrop={handleActionPlanDrop}
              onDragOver={handleActionPlanDragOver}
              sx={{
                border: '2px dashed #2563eb',
                borderRadius: 3,
                p: 2,
                textAlign: 'center',
                bgcolor: '#f8fafc',
                cursor: 'pointer',
                minHeight: 120,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'border-color 0.2s',
                '&:hover': { borderColor: '#5de0e6' }
              }}
              onClick={() => document.getElementById('actionPlanFotoInput').click()}
            >
              <input
                id="actionPlanFotoInput"
                type="file"
                accept="image/*"
                hidden
                onChange={handleActionPlanFile}
              />
              <Box sx={{ mb: 1 }}>
                <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#2563eb" fillOpacity="0.08"/><path d="M16 32h16M24 16v16M24 16l-5 5M24 16l5 5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Box>
              <Typography variant="body2" color="#2563eb" fontWeight={600} sx={{ mb: 0.5 }}>Drag & Drop atau Klik untuk Upload Foto</Typography>
              <Typography variant="caption" color="text.secondary">Maksimal 10MB, format gambar</Typography>
              {actionPlan.foto && (
                <Box mt={2}>
                  <Typography variant="caption" color="#2563eb">{actionPlan.foto.name}</Typography>
                  {actionPlan.fotoPreview && (
                    <Box mt={1}><img src={actionPlan.fotoPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 100, borderRadius: 6 }} /></Box>
                  )}
                </Box>
              )}
              {actionPlan.fotoError && (
                <Typography variant="caption" color="error">{actionPlan.fotoError}</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
        <Box display="flex" gap={2} mt={4}>
          <Button variant="contained" color="primary" sx={{ fontWeight: 700, minWidth: 120, px: 4, borderRadius: 3, background: blueGradient, boxShadow: 2 }} onClick={() => handleSubmit('actionPlan')} disabled={role === 'user'}>Simpan</Button>
        </Box>
      </LocalizationProvider>
    </CardContent>
  </Card>
);

// ...
  const clipboardIcon = <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', mr: 1 }}><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="4" fill="#2563eb"/><rect x="8" y="6" width="8" height="2" rx="1" fill="#fff"/></svg></Box>;

  const FasilitasForm = (
    <Card sx={formCardStyle}>
      {/* Card Header */}
      <Box sx={{
        background: 'linear-gradient(90deg, #2563eb 0%, #5de0e6 100%)',
        color: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        px: 3,
        py: 2,
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        minHeight: 56
      }}>
        {clipboardIcon}
        <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: 1 }}>FASILITAS</Typography>
      </Box>
      <CardContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2}>
            {/* Nomor Aset */}
            <Grid item xs={12} md={6}><TextField name="nomorAset" label="Nomor Aset" value={fasilitas.nomorAset} onChange={handleFasilitasChange} fullWidth size="small" helperText="Nomor identitas aset fasilitas" /></Grid>
            {/* Nama Pemeriksa */}
            <Grid item xs={12} md={6}><TextField name="namaPemeriksa" label="Nama Pemeriksa" value={fasilitas.namaPemeriksa} onChange={handleFasilitasChange} fullWidth size="small" helperText="Nama lengkap pemeriksa" /></Grid>
            {/* Kategori */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={kategoriFasilitasOptions}
                value={fasilitas.kategori}
                onChange={(_, v) => handleFasilitasSelectChange('kategori', v)}
                renderInput={(params) => <TextField {...params} label="Kategori" fullWidth size="small" helperText="Pilih kategori fasilitas" />}
                fullWidth
                disableClearable
                autoHighlight
              />
            </Grid>
            {/* Nama Fasilitas Alat Kerja */}
            <Grid item xs={12} md={6}><TextField name="namaFasilitas" label="Nama Fasilitas Alat Kerja" value={fasilitas.namaFasilitas} onChange={handleFasilitasChange} fullWidth size="small" helperText="Nama alat kerja atau fasilitas" /></Grid>
            {/* Jumlah Satuan */}
            <Grid item xs={12} md={6}><TextField name="jumlahSatuan" label="Jumlah Satuan" value={fasilitas.jumlahSatuan} onChange={handleFasilitasChange} fullWidth size="small" helperText="Jumlah unit/satuan alat" type="number" /></Grid>
            {/* Baik */}
            <Grid item xs={12} md={6}><TextField name="baik" label="Baik" value={fasilitas.baik} onChange={handleFasilitasChange} fullWidth size="small" helperText="Jumlah alat dalam kondisi baik" type="number" /></Grid>
            {/* Pantauan */}
            <Grid item xs={12} md={6}><TextField name="pantauan" label="Pantauan" value={fasilitas.pantauan} onChange={handleFasilitasChange} fullWidth size="small" helperText="Jumlah alat dalam pantauan" type="number" /></Grid>
            {/* Rusak */}
            <Grid item xs={12} md={6}><TextField name="rusak" label="Rusak" value={fasilitas.rusak} onChange={handleFasilitasChange} fullWidth size="small" helperText="Jumlah alat rusak" type="number" /></Grid>
            {/* Spesifikasi */}
            <Grid item xs={12} md={6}><TextField name="spesifikasi" label="Spesifikasi" value={fasilitas.spesifikasi} onChange={handleFasilitasChange} fullWidth size="small" helperText="Spesifikasi teknis alat" /></Grid>
            {/* Merk */}
            <Grid item xs={12} md={6}><TextField name="merk" label="Merk" value={fasilitas.merk} onChange={handleFasilitasChange} fullWidth size="small" helperText="Merk alat" /></Grid>
            {/* Tahun Pengadaan */}
            <Grid item xs={12} md={6}><TextField name="tahunPengadaan" label="Tahun Pengadaan" value={fasilitas.tahunPengadaan} onChange={handleFasilitasChange} fullWidth size="small" helperText="Tahun pembelian/pengadaan alat" type="number" /></Grid>
            {/* Tahun Mulai Dinas */}
            <Grid item xs={12} md={6}><TextField name="tahunMulaiDinas" label="Tahun Mulai Dinas" value={fasilitas.tahunMulaiDinas} onChange={handleFasilitasChange} fullWidth size="small" helperText="Tahun mulai operasional alat" type="number" /></Grid>
            {/* Tanggal Perawatan */}
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Tanggal Perawatan"
                value={fasilitas.tanggalPerawatan}
                onChange={(v) => handleFasilitasDateChange('tanggalPerawatan', v)}
                slotProps={{ textField: { fullWidth: true, size: 'small', helperText: 'Tanggal terakhir perawatan alat' } }}
              />
            </Grid>
            {/* Kategori Standardisasi */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={kategoriStandardisasiOptions}
                value={fasilitas.kategoriStandardisasi}
                onChange={(_, v) => handleFasilitasSelectChange('kategoriStandardisasi', v)}
                renderInput={(params) => <TextField {...params} label="Kategori Standardisasi" fullWidth size="small" helperText="Pilih kategori standardisasi" />}
                fullWidth
                disableClearable
                autoHighlight
              />
            </Grid>
            {/* Tanggal Sertifikasi */}
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Tanggal Sertifikasi"
                value={fasilitas.tanggalSertifikasi}
                onChange={(v) => handleFasilitasDateChange('tanggalSertifikasi', v)}
                slotProps={{ textField: { fullWidth: true, size: 'small', helperText: 'Tanggal sertifikasi alat' } }}
              />
            </Grid>
            {/* Lokasi Penyimpanan */}
            <Grid item xs={12} md={6}><TextField name="lokasiPenyimpanan" label="Lokasi Penyimpanan" value={fasilitas.lokasiPenyimpanan} onChange={handleFasilitasChange} fullWidth size="small" helperText="Lokasi alat disimpan" /></Grid>
            {/* Umur Komponen */}
            <Grid item xs={12} md={6}><TextField name="umurKomponen" label="Umur Komponen (tahun)" value={fasilitas.umurKomponen} onChange={handleFasilitasChange} fullWidth size="small" helperText="Umur teknis komponen (tahun)" type="number" /></Grid>
            {/* Upload Foto Alat */}
            <Grid item xs={12} md={6}>
              <Box
                onDrop={handleFasilitasDrop}
                onDragOver={handleFasilitasDragOver}
                sx={{
                  border: '2px dashed #2563eb',
                  borderRadius: 3,
                  p: 2,
                  textAlign: 'center',
                  bgcolor: '#f8fafc',
                  cursor: 'pointer',
                  minHeight: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  transition: 'border-color 0.2s',
                  '&:hover': { borderColor: '#5de0e6' }
                }}
                onClick={() => document.getElementById('fasilitasFotoInput').click()}
              >
                <input
                  id="fasilitasFotoInput"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFasilitasFile}
                />
                <Box sx={{ mb: 1 }}>
                  <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#2563eb" fillOpacity="0.08"/><path d="M16 32h16M24 16v16M24 16l-5 5M24 16l5 5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Box>
                <Typography variant="body2" color="#2563eb" fontWeight={600} sx={{ mb: 0.5 }}>Drag & Drop atau Klik untuk Upload Foto Alat</Typography>
                <Typography variant="caption" color="text.secondary">Maksimal 10MB, format gambar</Typography>
                {fasilitas.foto && (
                  <Box mt={2}>
                    <Typography variant="caption" color="#2563eb">{fasilitas.foto.name}</Typography>
                    {fasilitas.fotoPreview && (
                      <Box mt={1}><img src={fasilitas.fotoPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 100, borderRadius: 6 }} /></Box>
                    )}
                  </Box>
                )}
                {fasilitas.fotoError && (
                  <Typography variant="caption" color="error">{fasilitas.fotoError}</Typography>
                )}
              </Box>
            </Grid>
          </Grid>
          <Box display="flex" gap={2} mt={4}>
            <Button variant="contained" color="primary" sx={{ fontWeight: 700, minWidth: 120, px: 4, borderRadius: 3, background: blueGradient, boxShadow: 2 }} onClick={() => handleSubmit('fasilitas')} disabled={role === 'user'}>Simpan</Button>
          </Box>
        </LocalizationProvider>
      </CardContent>
    </Card>
  );

  // --- MAIN RENDER ---
  return (
    <Box sx={{ width: '100%', mt: 2, mb: 4 }}>
      <Card sx={{ borderRadius: 4, boxShadow: 3, mb: 4, p: 0, bgcolor: '#f5f7fa' }}>
        <Box sx={{ background: 'linear-gradient(135deg, #5de0e6, #2563eb)', color: '#fff', borderRadius: '16px 16px 0 0', px: 3, py: 2 }}>
          <Typography variant="h5" fontWeight={700}>Input Data Multi-Kategori</Typography>
        </Box>
        <CardContent sx={{ p: { xs: 1, md: 3 } }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons={isMobile ? 'auto' : false}
            sx={{ mb: 2, '& .MuiTab-root': { fontWeight: 700 } }}
          >
            <Tab label="Data Manpower" disabled={role === 'user'} />
<Tab label="Pantauan Roda" />
<Tab label="Action Plan" disabled={role === 'user'} />
<Tab label="Fasilitas" disabled={role === 'user'} />
          </Tabs>
          <Divider sx={{ mb: 2 }} />
          <TabPanel value={tab} index={0}>{ManpowerForm}</TabPanel>
          <TabPanel value={tab} index={1}>{PantauanRodaForm}</TabPanel>
          <TabPanel value={tab} index={2}>{ActionPlanForm}</TabPanel>
          <TabPanel value={tab} index={3}>{FasilitasForm}</TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
}
