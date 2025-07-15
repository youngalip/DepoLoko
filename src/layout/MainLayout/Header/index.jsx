import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, IconButton, Typography } from '@mui/material';

// project import
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import { NotificationProvider } from 'contexts/NotificationContext';
import { drawerWidth } from 'config.js';

// assets
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import logo from 'assets/images/logo-kai.png';

// ==============================|| HEADER ||============================== //

const Header = ({ drawerToggle }) => {
  const theme = useTheme();

  return (
    <>
      <Box width={drawerWidth} sx={{ zIndex: 1201, backgroundColor: '#000', color: '#fff' }}>
        <Grid container alignItems="center">
          {/* Tombol menu path paling kiri */}
          <Grid item>
            <IconButton
              edge="start"
              sx={{ ml: 1, mr: 2 }}
              color="inherit"
              aria-label="open drawer"
              onClick={drawerToggle}
              size="large"
            >
              <MenuTwoToneIcon sx={{ fontSize: '2 rem' }} />
            </IconButton>
          </Grid>
          {/* Logo dan teks branding */}
          <Grid item>
            <Box mt={0.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img src={logo} alt="Logo" style={{ height: 65, background: 'transparent', padding: 0, borderRadius: 0, boxShadow: 'none' }} />
            </Box>
          </Grid>
          {/* Flex grow agar elemen lain tetap di kanan */}
          <Grid item xs />
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <SearchSection theme="light" />
      <NotificationSection />
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  drawerToggle: PropTypes.func
};

export default Header;