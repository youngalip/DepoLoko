import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, IconButton } from '@mui/material';

// project import
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import { drawerWidth } from 'config.js';

// assets
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import logo from 'assets/images/logo-kai.png';

// ==============================|| HEADER ||============================== //

const Header = ({ drawerToggle }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: { xs: '48px', sm: '64px', md: '72px' },
        width: '100%',
        zIndex: 1201,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        px: { xs: 0.5, sm: 1.5, md: 2 },
        minWidth: 0
      }}
    >
      <Grid container alignItems="center">
        {/* Tombol menu */}
        <Grid item>
          <IconButton
            edge="start"
            sx={{ mr: 2 }}
            color="inherit"
            aria-label="open drawer"
            onClick={drawerToggle}
            size="large"
          >
            <MenuTwoToneIcon sx={{ fontSize: '2rem' }} />
          </IconButton>
        </Grid>

        {/* Logo */}
        <Grid item>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src={logo}
              alt="Logo"
              style={{
                height: window.innerWidth < 600 ? 50 : window.innerWidth < 900 ? 58 : 78,
                background: 'transparent',
                padding: 0,
                borderRadius: 0,
                boxShadow: 'none',
                maxWidth: '90vw',
                objectFit: 'contain'
              }}
            />
          </Box>
        </Grid>

        {/* Spacer */}
        <Grid item xs />

        {/* Komponen kanan (selalu tampil, baik mobile maupun desktop) */}
        <Grid
          item
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.25, sm: 1 },
            minWidth: 0
          }}
        >
          <Box sx={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: { xs: 0.25, sm: 1 } }}>
            <SearchSection theme="light" iconSize={window.innerWidth < 600 ? 'small' : 'medium'} />
            <NotificationSection iconSize={window.innerWidth < 600 ? 'small' : 'medium'} />
            <ProfileSection iconSize={window.innerWidth < 600 ? 'small' : 'medium'} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

Header.propTypes = {
  drawerToggle: PropTypes.func
};

export default Header;
