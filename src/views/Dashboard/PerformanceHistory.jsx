import React, { useEffect, useState } from "react";
import { getPerformanceChart, importPerformanceCSV, getLocomotives } from '../../services/performanceService';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Popover,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

// Column configuration
const columnConfig = {
  "apcclb": {
    label: "APCcLb",
    title: "PERFORMANCE MONITORING - CRANKCASE PRESSURE ( (-4) - (-12) Vacuum )",
    unit: "bar"
  },
  "apimrb": {
    label: "APImRb", 
    title: "PERFORMANCE MONITORING - AIR BOX PRESSURE ( 248,21 - 289,58 Kpa ) / ( 36 - 42 Psi )",
    unit: "Kpa"
  },
  "opturps": {
    label: "OPTuRPS",
    title: "PERFORMANCE MONITORING - TURBO LUBE OIL PRESSURE ( 517,10 - 655 Kpa ) / ( 75 - 95 Psi )",
    unit: "Kpa"
  },
  "wpegilp": {
    label: "WPEgILP",
    title: "PERFORMANCE MONITORING - COOLANT PRESSURE ENGINE IN ( 379,21 - 517,10 Kpa ) / ( 55 - 75 Psi )",
    unit: "Kpa"
  },
  "wpegotp": {
    label: "WPEgOtP",
    title: "PERFORMANCE MONITORING - COOLANT PRESSURE ENGINE OUT ( 172,36 - 310,26 Kpa ) / ( 25 - 45 Psi )",
    unit: "Kpa"
  },
  "eengrpm": {
    label: "EEngRPM",
    title: "PERFORMANCE MONITORING - ENGINE SPEED ( 900 - 908 Rpm )",
    unit: "RPM"
  },
  "tpu_rpm": {
    label: "TPU RPM",
    title: "PERFORMANCE MONITORING - TURBOCHARGER SPEED ( 16000 - 23000 Rpm )",
    unit: "RPM"
  },
  "egoiltf": {
    label: "EgOilTF",
    title: "PERFORMANCE MONITORING - LUBE OIL TEMPERATURE ( 79,44 - 96,11 'C ) / ( 175 - 205 'F )",
    unit: "°C"
  },
  "engtmpf": {
    label: "EngTmpF",
    title: "PERFORMANCE MONITORING - COOLANT TEMPERATURE ( 76,66 - 90,55 'C ) / ( 170 - 195 'F )",
    unit: "°C"
  },
  "awt": {
    label: "AWT",
    title: "PERFORMANCE MONITORING - AFTERCOOLER WATER TEMPERATURE ( 51,66 - 65,55 'C ) / ( 125 - 150 'F )",
    unit: "°C"
  },
  "atimrbf": {
    label: "ATImRbF",
    title: "PERFORMANCE MONITORING - AIR BOX TEMPERATURE ( 60 - 73,88 'C ) / ( 140 - 165 'F )",
    unit: "°C"
  },
  "ca_v": {
    label: "CA V",
    title: "PERFORMANCE MONITORING - COMPANION ALTERNATOR VOLTAGE ( 228 - 242 Volt )",
    unit: "Volt"
  }
};

// Reference values untuk setiap kolom
const referenceValues = {
  "apcclb": { min: 8.0, ideal: 8.4, max: 9.0 }, // ⚠️ ADJUSTED to match actual data
  "apimrb": { min: 248.21, ideal: 268.9, max: 289.58 },
  "opturps": { min: 517.10, ideal: 586.05, max: 655 },
  "wpegilp": { min: 379.21, ideal: 448.15, max: 517.10 },
  "wpegotp": { min: 172.36, ideal: 241.31, max: 310.26 },
  "eengrpm": { min: 900, ideal: 904, max: 908 },
  "tpu_rpm": { min: 16000, ideal: 19500, max: 23000 },
  "egoiltf": { min: 79.44, ideal: 87.78, max: 96.11 },
  "engtmpf": { min: 76.66, ideal: 83.61, max: 90.55 },
  "awt": { min: 51.66, ideal: 58.61, max: 65.55 },
  "atimrbf": { min: 60, ideal: 66.94, max: 73.88 },
  "ca_v": { min: 228, ideal: 235, max: 242 }
};

export default function PerformanceHistory() {
  const [locomotives, setLocomotives] = useState([]);
  const [loadingChart, setLoadingChart] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState(new Date('2024-01-01'));
  const [endDate, setEndDate] = useState(new Date('2024-12-31'));
  const [includeToday, setIncludeToday] = useState(false);
  
  const [selectedLocomotives, setSelectedLocomotives] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const availableColumns = Object.keys(columnConfig);
  const currentTab = availableColumns[activeTab] || availableColumns[0] || "";

  // Fetch locomotives dan auto-select
  useEffect(() => {
    const fetchLocomotives = async () => {
      try {
        const res = await getLocomotives();
        if (res.data.success) {
          setLocomotives(res.data.data);
          // Auto-select first 5 locomotives untuk performa
          const firstFiveLocos = res.data.data.slice(0, 5).map(loco => loco.locomotive_number);
          setSelectedLocomotives(firstFiveLocos);
        }
      } catch (err) {
        // Handle error silently
      }
    };
    
    fetchLocomotives();
  }, []);

  // ⚠️ KEYBOARD shortcuts untuk Select All
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl+A or Cmd+A untuk select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        handleSelectAllLocomotives(e);
      }
      // Ctrl+D or Cmd+D untuk clear all
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        handleClearAllLocomotives(e);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [locomotives]);
  useEffect(() => {
    if (locomotives.length > 0 && selectedLocomotives.length > 0 && currentTab) {
      console.log('🔄 Auto-fetching data for:', {
        locomotives: selectedLocomotives.length,
        tab: currentTab
      });
      fetchChartData();
    }
  }, [locomotives, currentTab]); // ⚠️ REMOVED selectedLocomotives dependency to prevent auto-fetch on selection change

  // ⚠️ NEW: Manual fetch trigger ketika selection berubah
  const handleFetchWithCurrentSelection = () => {
    if (selectedLocomotives.length > 0) {
      fetchChartData();
    }
  };

  const fetchChartData = async () => {
    setLoadingChart(true);
    setError(null);
    
    try {
      const params = {
        column: currentTab || 'apcclb',
        locomotive_ids: selectedLocomotives.length > 0 
          ? selectedLocomotives.map(locoName => {
              const selectedLoco = locomotives.find(l => l.locomotive_number === locoName);
              return selectedLoco ? selectedLoco.id : null;
            }).filter(Boolean).join(',')
          : locomotives.slice(0, 5).map(l => l.id).join(','),
        start_date: startDate ? format(startDate, 'yyyy-MM-dd') : '2024-01-01',
        end_date: endDate ? format(endDate, 'yyyy-MM-dd') : '2024-12-31'
      };
      
      const res = await getPerformanceChart(params);
      
      if (res.data.success) {
        const processedData = [];
        
        console.log('🔍 Backend data structure:', res.data.data);
        console.log('🔍 Data type:', typeof res.data.data);
        
        if (res.data.data && typeof res.data.data === 'object') {
          Object.entries(res.data.data).forEach(([locoKey, locoObject]) => {
            console.log(`🚂 Processing Locomotive ${locoKey}:`, locoObject);
            
            // ⚠️ FIX: Backend structure is { "locomotive_CC201-01": { data: [...] } }
            if (locoObject && locoObject.data && Array.isArray(locoObject.data)) {
              locoObject.data.forEach((item, index) => {
                
                // ⚠️ FIX: Item structure is { timestamp, value }
                if (item && item.value !== undefined && item.value !== null) {
                  const dataPoint = {
                    locomotive_number: locoObject.locomotive_number,
                    value: parseFloat(item.value), // ⚠️ FIX: Use item.value instead of item[currentTab]
                    recorded_at: item.timestamp, // ⚠️ FIX: Use item.timestamp instead of item.recorded_at
                    date: format(new Date(item.timestamp), 'MMM dd HH:mm'),
                    locomotive_id: locoObject.locomotive_id
                  };
                  
                  console.log(`📊 Data point ${index}:`, dataPoint);
                  processedData.push(dataPoint);
                }
              });
            }
          });
        }
        
        if (processedData.length === 0) {
          setError("Tidak ada data untuk ditampilkan. Cek parameter filter atau data di database.");
        } else {
          processedData.sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));
          setChartData(processedData);
        }
        
      } else {
        setError(res.data.message || "Gagal mengambil data performa");
      }
    } catch (err) {
      console.error("💥 Error fetching chart data:", err);
      setError("Gagal mengambil data performa: " + (err.response?.data?.message || err.message));
    } finally {
      setLoadingChart(false);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      alert('File type not supported. Please upload a CSV file.');
      return;
    }
    const formData = new FormData();
    formData.append('csv_file', file);
    try {
      const res = await importPerformanceCSV(formData);
      if (res.data.success) {
        alert('Import CSV berhasil!');
        fetchChartData();
      } else {
        alert('Import CSV gagal: ' + (res.data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Import CSV gagal: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleSelectAllLocomotives = (e) => {
    e.stopPropagation(); // ⚠️ PREVENT dropdown close
    const allLocoNumbers = locomotives.map(l => l.locomotive_number);
    setSelectedLocomotives(allLocoNumbers);
    console.log('✅ Selected all locomotives:', allLocoNumbers.length);
  };

  const handleClearAllLocomotives = (e) => {
    e.stopPropagation(); // ⚠️ PREVENT dropdown close  
    setSelectedLocomotives([]);
    console.log('🗑️ Cleared all locomotives');
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: '#1e293b',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          Performance Monitoring
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            component="label"
            variant="contained"
            startIcon={<UploadFileIcon />}
            sx={{ 
              backgroundColor: '#3b82f6', 
              '&:hover': { backgroundColor: '#2563eb' },
              textTransform: 'none',
              borderRadius: 2,
              px: 3
            }}
          >
            Import CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleImport}
            />
          </Button>
          
          <Button
            variant="contained"
            onClick={fetchChartData}
            disabled={loadingChart || selectedLocomotives.length === 0}
            sx={{ 
              backgroundColor: '#10b981', 
              '&:hover': { backgroundColor: '#059669' },
              textTransform: 'none',
              borderRadius: 2,
              px: 3
            }}
          >
            {loadingChart ? "Loading..." : "Refresh Data"}
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Box sx={{ 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca',
          borderRadius: 2,
          p: 3,
          mb: 3,
          color: '#dc2626'
        }}>
          <Typography variant="body2" fontWeight={500}>
            ⚠️ {error}
          </Typography>
        </Box>
      )}

      {/* Performance Tabs */}
      <Card sx={{ 
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', 
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        mb: 3
      }}>
        <Tabs
          value={activeTab}
          onChange={(e, newVal) => setActiveTab(newVal)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ 
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
              minHeight: 60,
              '&.Mui-selected': {
                color: '#3b82f6',
                fontWeight: 600
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#3b82f6',
              height: 3,
              borderRadius: 2
            }
          }}
        >
          {availableColumns.map((columnKey, idx) => (
            <Tab 
              label={columnConfig[columnKey].label} 
              key={columnKey}
            />
          ))}
        </Tabs>
      </Card>

      {/* Main Chart Card */}
      <Card sx={{ 
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 0 }}>
          {/* Filter Controls */}
          <Box sx={{ 
            p: 4, 
            backgroundColor: '#f8fafc', 
            borderBottom: '1px solid #e2e8f0' 
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontWeight: 600, 
                color: '#1e293b' 
              }}
            >
              Filters & Settings
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3, 
              alignItems: 'center' 
            }}>
              {/* Date Filter */}
              <Box sx={{ minWidth: 280 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#64748b' }}>
                  Date Range
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={
                    startDate && endDate
                      ? `${format(startDate, "dd MMM yyyy")} - ${format(endDate, "dd MMM yyyy")}`
                      : ""
                  }
                  onClick={handleOpenPopover}
                  InputProps={{ 
                    readOnly: true,
                    startAdornment: (
                      <Box sx={{ mr: 1, color: '#64748b' }}>📅</Box>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#fff',
                      '&:hover': {
                        borderColor: '#3b82f6',
                      },
                      '&.Mui-focused': {
                        borderColor: '#3b82f6',
                      }
                    }
                  }}
                />
              </Box>

              {/* Locomotive Selector */}
              <Box sx={{ minWidth: 320 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#64748b' }}>
                  Locomotives ({locomotives.length} available)
                </Typography>
                <Select
                  fullWidth
                  value={selectedLocomotives}
                  multiple
                  onChange={(e) => {
                    console.log('🔄 Select onChange triggered:', e.target.value);
                    setSelectedLocomotives(e.target.value);
                  }}
                  renderValue={(selected) => {
                    if (selected.length === 0) return 'Select locomotives';
                    if (selected.length === locomotives.length) return `All locomotives selected (${locomotives.length})`;
                    return `${selected.length} locomotives selected`;
                  }}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d1d5db',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6',
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: { 
                        maxHeight: 400,
                        borderRadius: 2,
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      }
                    }
                  }}
                >
                  {/* ⚠️ FIXED: Clear All Button */}
                  <MenuItem 
                    onClick={handleClearAllLocomotives}
                    sx={{ 
                      borderBottom: '1px solid #e2e8f0',
                      backgroundColor: '#fef2f2',
                      '&:hover': { backgroundColor: '#fee2e2' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#ef4444', fontWeight: 500 }}>
                      🗑️ Clear All Selection
                    </Box>
                  </MenuItem>
                  
                  {/* ⚠️ FIXED: Select All Button */}
                  <MenuItem 
                    onClick={handleSelectAllLocomotives}
                    sx={{ 
                      fontWeight: 600, 
                      color: '#3b82f6',
                      borderBottom: '1px solid #e2e8f0',
                      backgroundColor: '#eff6ff',
                      '&:hover': { backgroundColor: '#dbeafe' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      ✅ Select All ({locomotives.length} locomotives)
                    </Box>
                  </MenuItem>
                  
                  {/* ⚠️ Individual Locomotives */}
                  {locomotives.map(loco => (
                    <MenuItem key={loco.id} value={loco.locomotive_number}>
                      <Checkbox 
                        checked={selectedLocomotives.indexOf(loco.locomotive_number) > -1}
                        sx={{
                          color: '#3b82f6',
                          '&.Mui-checked': {
                            color: '#3b82f6',
                          },
                        }}
                      />
                      <Typography sx={{ ml: 1, fontSize: '0.875rem' }}>
                        {loco.locomotive_number}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* Quick Action Buttons */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 1,
                minWidth: 160
              }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleSelectAllLocomotives}
                  disabled={selectedLocomotives.length === locomotives.length}
                  sx={{ 
                    textTransform: 'none',
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    '&:hover': {
                      backgroundColor: '#eff6ff',
                      borderColor: '#2563eb'
                    }
                  }}
                >
                  ✅ Select All ({locomotives.length})
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearAllLocomotives}
                  disabled={selectedLocomotives.length === 0}
                  sx={{ 
                    textTransform: 'none',
                    borderColor: '#ef4444',
                    color: '#ef4444',
                    '&:hover': {
                      backgroundColor: '#fef2f2',
                      borderColor: '#dc2626'
                    }
                  }}
                >
                  🗑️ Clear All
                </Button>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1,
                minWidth: 200 
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  backgroundColor: '#fff',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  border: '1px solid #e2e8f0'
                }}>
                  <Typography variant="body2" color="#64748b">Data Points:</Typography>
                  <Typography variant="body2" fontWeight={600}>{chartData.length}</Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  backgroundColor: selectedLocomotives.length === locomotives.length ? '#dcfce7' : '#fff',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  border: `1px solid ${selectedLocomotives.length === locomotives.length ? '#22c55e' : '#e2e8f0'}`
                }}>
                  <Typography variant="body2" color="#64748b">
                    {selectedLocomotives.length === locomotives.length ? '✅ All Selected:' : 'Selected:'}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight={600}
                    color={selectedLocomotives.length === locomotives.length ? '#22c55e' : 'inherit'}
                  >
                    {selectedLocomotives.length}/{locomotives.length}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Date Picker Popover */}
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{
              sx: {
                p: 3,
                borderRadius: 3,
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                border: '1px solid #e2e8f0',
                minWidth: 320,
              },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Select Date Range
            </Typography>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeToday}
                  onChange={(e) => setIncludeToday(e.target.checked)}
                  sx={{
                    color: '#3b82f6',
                    '&.Mui-checked': { color: '#3b82f6' },
                  }}
                />
              }
              label="Include today"
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                Start Date
              </Typography>
              <DatePicker
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="dd MMM yyyy"
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    },
                  },
                }}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                End Date
              </Typography>
              <DatePicker
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="dd MMM yyyy"
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    },
                  },
                }}
              />
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              backgroundColor: '#f1f5f9',
              borderRadius: 2,
              mt: 2
            }}>
              <Typography variant="body2" fontWeight={500}>
                Selected Range:
              </Typography>
              <Typography variant="body2" color="#64748b">
                {startDate && endDate
                  ? `${format(startDate, "dd MMM yyyy")} - ${format(endDate, "dd MMM yyyy")}`
                  : "No range selected"}
              </Typography>
            </Box>
          </Popover>

          {/* Chart Area */}
          <Box sx={{ p: 4 }}>
            {/* Chart Header */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#1e293b',
                  mb: 1 
                }}
              >
                {columnConfig[currentTab]?.label || currentTab.toUpperCase()}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#64748b',
                  maxWidth: 800,
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                {columnConfig[currentTab]?.title || ''}
              </Typography>
            </Box>

            {/* Loading State */}
            {loadingChart && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: 400,
                flexDirection: 'column',
                gap: 2
              }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  border: '4px solid #e2e8f0',
                  borderTop: '4px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  }
                }} />
                <Typography color="#64748b">Loading performance data...</Typography>
              </Box>
            )}

            {/* Chart */}
            {!loadingChart && chartData.length > 0 && (
              <Box sx={{ 
                backgroundColor: '#fff',
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                p: 2
              }}>
                <ResponsiveContainer width="100%" height={500}>
                  <LineChart 
                    data={chartData} 
                    margin={{ top: 20, right: 60, left: 60, bottom: 80 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#e2e8f0" 
                      strokeOpacity={0.6}
                    />
                    
                    <XAxis 
                      dataKey="date"
                      angle={-45} 
                      textAnchor="end" 
                      height={80} 
                      interval="preserveStartEnd"
                      fontSize={11}
                      stroke="#64748b"
                      axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                      tickLine={{ stroke: '#cbd5e1' }}
                    />
                    
                    <YAxis 
                      domain={['dataMin - 0.5', 'dataMax + 0.5']}
                      tickFormatter={(value) => Number(value).toFixed(1)}
                      fontSize={11}
                      stroke="#64748b"
                      axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                      tickLine={{ stroke: '#cbd5e1' }}
                      label={{ 
                        value: columnConfig[currentTab]?.unit || 'Value', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle', fontSize: '12px', fill: '#64748b' }
                      }}
                    />
                    
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${Number(value).toFixed(2)} ${columnConfig[currentTab]?.unit || ''}`, 
                        props.payload.locomotive_number || 'Value'
                      ]}
                      labelFormatter={(label) => `Time: ${label}`}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        fontSize: '13px'
                      }}
                      labelStyle={{ color: '#1e293b', fontWeight: 600 }}
                    />
                    
                    {/* Reference Lines */}
                    {referenceValues[currentTab] && (
                      <>
                        <ReferenceLine 
                          y={referenceValues[currentTab].max} 
                          stroke="#ef4444" 
                          strokeDasharray="8 4"
                          strokeWidth={2}
                          label={{ 
                            value: `Max (${referenceValues[currentTab].max})`, 
                            position: "topRight",
                            style: { 
                              fill: '#ef4444', 
                              fontWeight: '600',
                              fontSize: '11px',
                              backgroundColor: '#fff',
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }
                          }}
                        />
                        
                        <ReferenceLine 
                          y={referenceValues[currentTab].ideal} 
                          stroke="#10b981" 
                          strokeDasharray="8 4"
                          strokeWidth={2}
                          label={{ 
                            value: `Ideal Average (${referenceValues[currentTab].ideal})`, 
                            position: "topRight",
                            style: { 
                              fill: '#10b981', 
                              fontWeight: '600',
                              fontSize: '11px',
                              backgroundColor: '#fff',
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }
                          }}
                        />
                        
                        <ReferenceLine 
                          y={referenceValues[currentTab].min} 
                          stroke="#ef4444" 
                          strokeDasharray="8 4"
                          strokeWidth={2}
                          label={{ 
                            value: `Min (${referenceValues[currentTab].min})`, 
                            position: "topRight",
                            style: { 
                              fill: '#ef4444', 
                              fontWeight: '600',
                              fontSize: '11px',
                              backgroundColor: '#fff',
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }
                          }}
                        />
                      </>
                    )}
                    
                    {/* Data Line */}
                    <Line 
                      type="monotone" 
                      dataKey="value"
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      dot={{ 
                        fill: '#8b5cf6', 
                        strokeWidth: 0, 
                        r: 3,
                        fillOpacity: 0.8
                      }}
                      activeDot={{ 
                        r: 5, 
                        fill: '#8b5cf6',
                        stroke: '#fff',
                        strokeWidth: 2
                      }}
                      connectNulls={false}
                      name={columnConfig[currentTab]?.label}
                    />
                    
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            )}

            {/* Empty State */}
            {!loadingChart && chartData.length === 0 && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 400,
                backgroundColor: '#f8fafc',
                borderRadius: 2,
                border: '2px dashed #cbd5e1'
              }}>
                <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                  📊 No Data Available
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center', maxWidth: 400 }}>
                  No performance data found for the selected locomotives and date range. 
                  Try adjusting your filters or importing new data.
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={fetchChartData}
                  sx={{ mt: 2, textTransform: 'none' }}
                >
                  🔄 Retry
                </Button>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}