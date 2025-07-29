import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';
import { Box, Card, CardContent, Typography, TextField, Button, Link, InputAdornment, IconButton, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import bgKereta from '../../assets/images/bg-kereta-kai.png';

export default function LoginUser() {
  const dispatch = useDispatch();
  const [mode, setMode] = useState('user');
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.password) {
      setError('Email/Username dan Password harus diisi.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail: form.username, password: form.password })
      });
      const result = await response.json();
      setLoading(false);
      if (!response.ok) {
        setError(result.message || 'Login gagal.');
        return;
      }
      // Simpan token dan user ke localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      // Update Redux agar role langsung sync ke seluruh UI
      dispatch(loginSuccess({ user: result.user, token: result.token }));
      setSuccess('Login sukses!');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      setLoading(false);
      setError('Terjadi kesalahan koneksi/server.');
    }
  };

  const handleModeSwitch = () => {
    setMode(mode === 'user' ? 'admin' : 'user');
    setForm({ username: '', password: '' });
    setError('');
    if (mode === 'user') navigate('/login-admin');
    else navigate('/login-user');
  };

  const handleForgot = () => {
    // Implementasi reset password sesuai kebutuhan
    alert('Fitur reset password belum tersedia.');
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
          maxWidth: 360,
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
              {mode === 'user' ? 'Login User' : 'Login Admin'}
            </Typography>
            <form onSubmit={handleSubmit} autoComplete="off">
              <TextField
                label="Email/Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                margin="normal"
                size="small"
                sx={{ input: { color: '#fff' }, label: { color: '#ccc' }, mb: 2, bgcolor: 'rgba(255,255,255,0.06)' }}
                InputLabelProps={{ style: { color: '#bbb' } }}
                autoFocus
              />
              <Box sx={{ position: 'relative' }}>
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  size="small"
                  sx={{ input: { color: '#fff' }, label: { color: '#ccc' }, mb: 0, bgcolor: 'rgba(255,255,255,0.06)' }}
                  InputLabelProps={{ style: { color: '#bbb' } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((show) => !show)}
                          edge="end"
                          size="small"
                          sx={{ color: '#bbb' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <Link
                  component="button"
                  onClick={handleForgot}
                  sx={{ position: 'absolute', top: 0, right: 0, fontSize: 13, color: '#5de0e6', fontWeight: 600 }}
                  underline="none"
                >
                  Forgot?
                </Link>
              </Box>
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
                {loading ? 'Logging in...' : 'Login Now'}
              </Button>
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
              <Typography variant="body2" align="center" mt={2}>
                {mode === 'user' ? 'Login sebagai Admin?' : 'Login sebagai User?'}{' '}
                <Link component="button" onClick={handleModeSwitch} sx={{ color: '#5de0e6', fontWeight: 600 }} underline="hover">
                  {mode === 'user' ? 'Login Admin' : 'Login User'}
                </Link>
              </Typography>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Don't have any account?{' '}
                <Link href="/DepoLokoTanjungKarang/register-user" underline="hover" sx={{ color: '#5de0e6', fontWeight: 600 }}>
                  Create account
                </Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
