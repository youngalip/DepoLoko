import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Typography, TextField, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgKereta from '../../assets/images/bg-kereta-kai.png';

const RegisterUser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', nama_lengkap: '', nipp: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await axios.post('/api/users/register', form);
      // Jika backend return token dan user, simpan ke localStorage
      if (res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      setSuccess('Registrasi berhasil! Mengarahkan ke dashboard...');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Registrasi gagal, periksa data Anda.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      background: `url(${bgKereta}) center/cover no-repeat`,
      position: 'relative',
      '&:before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        bgcolor: 'rgba(30,30,30,0.55)',
        filter: 'grayscale(0.9)',
        zIndex: 0,
      }
    }}>
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <Card sx={{
          minWidth: 340,
          maxWidth: 380,
          width: '90vw',
          bgcolor: 'rgba(20, 28, 44, 0.82)',
          color: '#fff',
          borderRadius: 4,
          boxShadow: 6,
          backdropFilter: 'blur(10px)',
          p: 3
        }}>
          <CardContent>
            <Typography variant="h5" fontWeight={700} mb={2} align="center" letterSpacing={1} sx={{ color: '#5de0e6' }}>
              Create Account
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#ff6b6b', border: '1px solid rgba(211, 47, 47, 0.3)' }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2, bgcolor: 'rgba(46, 125, 50, 0.1)', color: '#4caf50', border: '1px solid rgba(46, 125, 50, 0.3)' }}>
                {success}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                margin="normal"
                size="small"
                required
                autoFocus
                sx={{ input: { color: '#fff' }, label: { color: '#ccc' }, mb: 2, bgcolor: 'rgba(255,255,255,0.06)' }}
                InputLabelProps={{ style: { color: '#bbb' } }}
              />
              <TextField
                label="Nama Lengkap"
                name="nama_lengkap"
                value={form.nama_lengkap}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                margin="normal"
                size="small"
                required
                sx={{ input: { color: '#fff' }, label: { color: '#ccc' }, mb: 2, bgcolor: 'rgba(255,255,255,0.06)' }}
                InputLabelProps={{ style: { color: '#bbb' } }}
              />
              <TextField
                label="NIPP"
                name="nipp"
                value={form.nipp}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                margin="normal"
                size="small"
                required
                sx={{ input: { color: '#fff' }, label: { color: '#ccc' }, mb: 2, bgcolor: 'rgba(255,255,255,0.06)' }}
                InputLabelProps={{ style: { color: '#bbb' } }}
              />
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                margin="normal"
                size="small"
                required
                type="email"
                sx={{ input: { color: '#fff' }, label: { color: '#ccc' }, mb: 2, bgcolor: 'rgba(255,255,255,0.06)' }}
                InputLabelProps={{ style: { color: '#bbb' } }}
              />
              <TextField
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                margin="normal"
                size="small"
                required
                type="password"
                inputProps={{ minLength: 6 }}
                sx={{ input: { color: '#fff' }, label: { color: '#ccc' }, mb: 0, bgcolor: 'rgba(255,255,255,0.06)' }}
                InputLabelProps={{ style: { color: '#bbb' } }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 1,
                  py: 1.2,
                  fontWeight: 700,
                  fontSize: 17,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #5de0e6, #2563eb)',
                  boxShadow: 2,
                  textTransform: 'none',
                  letterSpacing: 1
                }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register Now'}
              </Button>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Sudah punya akun?{' '}
                <Link href="/DepoLokoTanjungKarang/login-user" underline="hover" sx={{ color: '#5de0e6', fontWeight: 600 }}>
                  Login
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default RegisterUser;
