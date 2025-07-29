import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { useMediaQuery, Divider, Drawer, Grid, Box, Typography } from '@mui/material';

// third party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project import
import MenuList from './MenuList';
import { drawerWidth } from 'config.js';

// assets
import logo from 'assets/images/logo-kai.png';

// custom style
const Nav = styled((props) => <nav {...props} />)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    width: drawerWidth,
    flexShrink: 0
  }
}));

// ==============================|| SIDEBAR ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const drawer = (
    <>
      <Box sx={{ display: { md: 'none', xs: 'block' } }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          elevation={5}
          alignItems="center"
          spacing={0}
          sx={{
            ...theme.mixins.toolbar,
            lineHeight: 0,
            background: 'linear-gradient(135deg, #5de0e6, #2563eb)', // hitam solid
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
          }}
        >
          <Grid item>
            <Box sx={{ 
                  height: { xs:56, sm: 50},
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  py: 1, 
                }}>
              <img src={logo} alt="Logo" style={{ height: 65, background: 'transparent', padding: 0, borderRadius: 0, boxShadow: 'none' }} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <PerfectScrollbar style={{ 
                            height: 'calc(100vh - 64px)', // default untuk mobile
                            [theme.breakpoints.up('sm')]: {
                              height: 'calc(100vh - 72px)' // untuk layar sm ke atas
                            },
                            padding: '10px' 
                            }}>
        <MenuList />
        
      </PerfectScrollbar>
    </>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Nav>
      <Drawer
        container={container}
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            borderRight: 'none',
            boxShadow: '0 0.15rem 1.75rem 0 rgba(33, 40, 50, 0.15)',
            top: { md: 64, sm: 64 }
          }
        }}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </Nav>
  );
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func,
  window: PropTypes.object
};

export default Sidebar;
