import { createSlice } from '@reduxjs/toolkit';

const userFromStorage = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const tokenFromStorage = localStorage.getItem('token') || null;

const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
  role: userFromStorage?.role || 'user',
  isAuthenticated: !!tokenFromStorage
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.user.role;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = 'user';
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { loginSuccess, logout, setRole } = authSlice.actions;
export default authSlice.reducer;
