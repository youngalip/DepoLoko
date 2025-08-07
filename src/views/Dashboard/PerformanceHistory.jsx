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
  "apcclb": { min: 8.0, ideal: 8.4, max: 9.0 },
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

  useEffect(() => {
    if (locomotives.length > 0 && selectedLocomotives.length > 0 && currentTab) {
      console.log('🔄 Auto-fetching data for:', {
        locomotives: selectedLocomotives.length,
        tab: currentTab
      });
      fetchChartData();
    }
  }, [locomotives, currentTab]);

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
        
        if (res.data.data && typeof res.data.data === 'object') {
          Object.entries(res.data.data).forEach(([locoKey, locoObject]) => {
            if (locoObject && locoObject.data && Array.isArray(locoObject.data)) {
              locoObject.data.forEach((item, index) => {
                if (item && item.value !== undefined && item.value !== null) {
                  const dataPoint = {
                    locomotive_number: locoObject.locomotive_number,
                    value: parseFloat(item.value),
                    recorded_at: item.timestamp,
                    date: format(new Date(item.timestamp), 'MMM dd HH:mm'),
                    locomotive_id: locoObject.locomotive_id
                  };
                  
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

  return (
    <Box p={4}>
      {/* Import Button Area - SESUAI ORIGINAL */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button
          component="label"
          variant="contained"
          startIcon={<UploadFileIcon />}
          sx={{ 
            minWidth: 120, 
            backgroundColor: '#2563eb', 
            color: '#fff', 
            boxShadow: 1, 
            textTransform: 'none', 
            mr: 2 
          }}
        >
          Import
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={handleImport}
          />
        </Button>
      </Box>

      {/* Tabs - SESUAI ORIGINAL */}
      <Tabs
        value={activeTab}
        onChange={(e, newVal) => setActiveTab(newVal)}
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 2 }}
      >
        {availableColumns.map((columnKey, idx) => (
          <Tab 
            label={columnConfig[columnKey].label} 
            key={columnKey} 
            sx={{ textTransform: 'none' }} 
          />
        ))}
      </Tabs>

      {/* Main Card - SESUAI ORIGINAL */}
      <Card sx={{ px: 4, py: 3, mt: 1, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          {/* Filter Section - LAYOUT HORIZONTAL KOMPAK SESUAI ORIGINAL */}
          <Box display="flex" flexWrap="wrap" gap={4} mb={2} alignItems="center">
            {/* Filter by Date Trigger - SESUAI ORIGINAL */}
            <TextField
              label="Filter by Date"
              variant="outlined"
              value={
                startDate && endDate
                  ? `${format(startDate, "dd MMM yyyy")} - ${format(endDate, "dd MMM yyyy")}`
                  : ""
              }
              onClick={handleOpenPopover}
              InputProps={{ readOnly: true }}
              sx={{ minWidth: 250 }}
            />

            {/* POPOVER ORANGE - SESUAI ORIGINAL! */}
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClosePopover}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              PaperProps={{
                sx: {
                  p: 2,
                  backgroundColor: "#ffa726", // ⚠️ ORANGE BACKGROUND SESUAI ORIGINAL!
                  borderRadius: 2,
                  boxShadow: 3,
                  width: 300,
                },
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeToday}
                    onChange={(e) => setIncludeToday(e.target.checked)}
                  />
                }
                label="Include today"
              />
              <Box mb={2}>
                <Typography variant="subtitle2">Start Date</Typography>
                <DatePicker
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  format="dd MMM yyyy"
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        backgroundColor: "#fff", // ⚠️ WHITE BACKGROUND SESUAI ORIGINAL
                        borderRadius: 1,
                        width: "100%",
                      },
                    },
                  }}
                />
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2">End Date</Typography>
                <DatePicker
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  format="dd MMM yyyy"
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        backgroundColor: "#fff", // ⚠️ WHITE BACKGROUND SESUAI ORIGINAL
                        borderRadius: 1,
                        width: "100%",
                      },
                    },
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: "#fff", textAlign: "center" }}>
                Range:{" "}
                {startDate ? format(startDate, "dd MMM yyyy") : "-"} -{" "}
                {endDate ? format(endDate, "dd MMM yyyy") : "-"}
              </Typography>
            </Popover>

            {/* Locomotive Number Dropdown - SESUAI ORIGINAL */}
            <Select
              value={selectedLocomotives}
              multiple
              displayEmpty
              onChange={(e) => setSelectedLocomotives(e.target.value)}
              renderValue={(selected) => {
                if (selected.length === 0) return 'Locomotive Number';
                if (selected.length === 1) return selected[0];
                return `${selected.length} locomotives selected`;
              }}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">
                <em>Select Locomotives</em>
              </MenuItem>
              {locomotives.map(loco => (
                <MenuItem key={loco.id} value={loco.locomotive_number}>
                  <Checkbox checked={selectedLocomotives.indexOf(loco.locomotive_number) > -1} />
                  {loco.locomotive_number}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Chart Title - SESUAI ORIGINAL */}
          <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
            {columnConfig[currentTab]?.title || ''}
          </Typography>

          {/* Chart Area - HORIZONTAL SCROLLABLE SESUAI ORIGINAL */}
          <Box sx={{ width: '100%', overflowX: 'auto', paddingRight: 10 }}>
            <Box sx={{ minWidth: 3000, pr: 10 }}>
              {!loadingChart && chartData.length > 0 ? (
                <ResponsiveContainer width={3000} height={600}>
                  <LineChart 
                    data={chartData} 
                    margin={{ top: 20, right: 200, left: 0, bottom: 120 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80} 
                      interval={0} 
                    />
                    <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                    <Tooltip
                      formatter={(value) => [`${value}`, "Value"]}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    
                    {/* Reference Lines - WARNA SESUAI ORIGINAL */}
                    {referenceValues[currentTab] && (
                      <>
                        <ReferenceLine 
                          y={referenceValues[currentTab].max} 
                          stroke="#f48fb1" 
                          label={{ 
                            value: `Max (${referenceValues[currentTab].max})`, 
                            position: "right", 
                            fill: "#f48fb1", 
                            fontWeight: "bold" 
                          }} 
                        />
                        <ReferenceLine 
                          y={referenceValues[currentTab].ideal} 
                          stroke="#4caf50" 
                          label={{ 
                            value: `Ideal Average (${referenceValues[currentTab].ideal})`, 
                            position: "right", 
                            fill: "#4caf50", 
                            fontWeight: "bold" 
                          }} 
                        />
                        <ReferenceLine 
                          y={referenceValues[currentTab].min} 
                          stroke="#f44336" 
                          label={{ 
                            value: `Min (${referenceValues[currentTab].min})`, 
                            position: "right", 
                            fill: "#f44336", 
                            fontWeight: "bold" 
                          }} 
                        />
                      </>
                    )}
                    
                    {/* Line Chart - WARNA SESUAI ORIGINAL */}
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#6A1B9A" 
                      strokeWidth={2} 
                      dot 
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : loadingChart ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: 600 
                }}>
                  <Typography>Loading...</Typography>
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: 600 
                }}>
                  <Typography>No data available</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}