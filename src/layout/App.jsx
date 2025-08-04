import React from 'react';

// material-ui
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// third-party
import { useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers'; // ✅ Tambah ini
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // ✅ Tambah ini

// project import
import theme from 'themes';
import Routes from 'routes/index';
import NavigationScroll from './NavigationScroll';
import { NotificationProvider } from 'contexts/NotificationContext';

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <NotificationProvider>
      <NavigationScroll>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme(customization)}>
            <LocalizationProvider dateAdapter={AdapterDateFns}> {/* ✅ Bungkus di sini */}
              <CssBaseline />
              <Routes />
            </LocalizationProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </NavigationScroll>
    </NotificationProvider>
  );
};

export default App;
