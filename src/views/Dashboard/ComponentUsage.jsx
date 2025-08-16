import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box, Grid, Card, CardContent, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Checkbox, List, ListItem, ListItemIcon,
  ListItemText, TextField, Divider, CircularProgress, Alert, Button, Snackbar
} from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, XAxis, YAxis, CartesianGrid, Bar, Line, Label
} from "recharts";
import UploadFileIcon from '@mui/icons-material/UploadFile';

// === API Service ===
const API_BASE_URL = 'http://localhost:3001/api';

const apiService = {
  async getComponentUsage(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          if (Array.isArray(filters[key])) {
            filters[key].forEach(value => params.append(key, value));
          } else {
            params.append(key, filters[key]);
          }
        }
      });
      
      const response = await fetch(`${API_BASE_URL}/component-usage?${params}`);
      if (!response.ok) throw new Error('Failed to fetch component usage');
      return response.json();
    } catch (error) {
      console.error('API Error - getComponentUsage:', error);
      throw error;
    }
  },

  async getLocomotives() {
    try {
      const response = await fetch(`${API_BASE_URL}/component-usage/locomotives`);
      if (!response.ok) throw new Error('Failed to fetch locomotives');
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error('API Error - getLocomotives:', error);
      return [];
    }
  },

  async getMaintenanceTypes() {
    try {
      const response = await fetch(`${API_BASE_URL}/component-usage/maintenance-types`);
      if (!response.ok) throw new Error('Failed to fetch maintenance types');
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error('API Error - getMaintenanceTypes:', error);
      return [];
    }
  },

  async importCSV(file) {
    try {
      const formData = new FormData();
      formData.append('csvFile', file);
      
      const response = await fetch(`${API_BASE_URL}/component-usage/import`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to import CSV');
      return response.json();
    } catch (error) {
      console.error('Import Error:', error);
      throw error;
    }
  }
};

// === Utility Functions ===
const countBy = (array, key) => {
  return array.reduce((acc, item) => {
    const value = item[key];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
};

// === Headers for table (same as original) ===
const headers = [
  'Component', 'Part No', 'Description', 'Qty', 'Locomotive', 'Period', 'Maintenance Type',
  'Depo Location', 'Month', 'Year', 'SO Date', 'Invoice', 'Invoice Date', 'SKB', 'Part Type', 'Part Using'
];

// === Color Sets for Charts (same as original) ===
const colorSets = {
  period: ["#1976d2", "#f06292", "#81c784", "#ffb74d", "#ba68c8"],
  maintenance: ["#42a5f5", "#ce93d8", "#f48fb1"],
  depo: ["#4dd0e1", "#ffd54f", "#aed581", "#90a4ae"],
  year: ["#e57373", "#f06292", "#ba68c8", "#64b5f6", "#4db6ac", "#81c784", "#dce775", "#fff176", "#ffb74d", "#a1887f"],
};

// === Chart Data Generator (same as original) ===
const generatePieData = (data, key) => {
  const count = countBy(data, key);
  return Object.entries(count).map(([name, value]) => ({ name, value }));
};

const generateParetoData = (data, key) => {
  const count = countBy(data, key);
  const entries = Object.entries(count)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  let cumulative = 0;
  const total = entries.reduce((sum, d) => sum + d.count, 0);
  return entries.map((d) => {
    cumulative += d.count;
    return { ...d, cumulative: parseFloat(((cumulative / total) * 100).toFixed(2)) };
  });
};

const CustomParetoTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const record = payload.find(p => p.dataKey === "count");
    const cumulative = payload.find(p => p.dataKey === "cumulative");
    return (
      <Paper elevation={3} sx={{ p: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold">{label}</Typography>
        <Typography variant="body2" sx={{ color: "#1976d2" }}>
          - Record Count: <strong>{record?.value}</strong>
        </Typography>
        <Typography variant="body2" sx={{ color: "#d32f2f" }}>
          - Cumulative: <strong>{cumulative?.value}%</strong>
        </Typography>
      </Paper>
    );
  }
  return null;
};

const renderParetoChart = (data, title, lineName, onBarClick) => (
  <Paper elevation={2} sx={{ p: 2, borderRadius: 2, boxShadow: 2 }}>
    <Typography variant="h6" align="center" gutterBottom>
      Pareto Chart – {title}
    </Typography>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        onClick={(e) => {
          if (onBarClick && e?.activeLabel) onBarClick(e.activeLabel);
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
        <YAxis yAxisId="left" label={<Label value="Count" angle={-90} position="insideLeft" />} />
        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tickFormatter={(value) => `${value}%` } label={<Label value="Cumulative %" angle={90} position="insideRight" />} />
        <RechartsTooltip content={<CustomParetoTooltip />} />
        <Legend />
        <Bar yAxisId="left" dataKey="count" fill="#1976d2" name="Record Count" />
        <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#d32f2f" dot={{ r: 4 }} name={lineName} />
      </BarChart>
    </ResponsiveContainer>
  </Paper>
);

const ComponentUsage = () => {
  // === State Management (same structure as original) ===
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [importing, setImporting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Filter States (same as original)
  const [componentSearch, setComponentSearch] = useState('');
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [partNoOpen, setPartNoOpen] = useState(false);
  const [selectedPartNos, setSelectedPartNos] = useState([]);
  const [partNoSearch, setPartNoSearch] = useState('');
  const partNoRef = useRef(null);

  const [mtcTypeOpen, setMtcTypeOpen] = useState(false);
  const [selectedMtcTypes, setSelectedMtcTypes] = useState([]);
  const [mtcTypeSearch, setMtcTypeSearch] = useState('');
  const mtcTypeRef = useRef(null);

  const [soDateOpen, setSoDateOpen] = useState(false);
  const [selectedSoDates, setSelectedSoDates] = useState([]);
  const [soDateSearch, setSoDateSearch] = useState('');
  const soDateRef = useRef(null);

  const [locomotiveOpen, setLocomotiveOpen] = useState(false);
  const [selectedLocomotives, setSelectedLocomotives] = useState([]);
  const [locomotiveSearch, setLocomotiveSearch] = useState('');
  const locomotiveRef = useRef(null);

  const [depoLocOpen, setDepoLocOpen] = useState(false);
  const [selectedDepoLocs, setSelectedDepoLocs] = useState([]);
  const [depoLocSearch, setDepoLocSearch] = useState('');
  const depoLocRef = useRef(null);

  const [yearOpen, setYearOpen] = useState(false);
  const [selectedYears, setSelectedYears] = useState([]);
  const [yearSearch, setYearSearch] = useState('');
  const yearRef = useRef(null);

  const [monthOpen, setMonthOpen] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [monthSearch, setMonthSearch] = useState('');
  const monthRef = useRef(null);

  const [partUsingOpen, setPartUsingOpen] = useState(false);
  const [selectedPartUsings, setSelectedPartUsings] = useState([]);
  const [partUsingSearch, setPartUsingSearch] = useState('');
  const partUsingRef = useRef(null);

  const [partTypeOpen, setPartTypeOpen] = useState(false);
  const [selectedPartTypes, setSelectedPartTypes] = useState([]);
  const [partTypeSearch, setPartTypeSearch] = useState('');
  const partTypeRef = useRef(null);

  const [periodOpen, setPeriodOpen] = useState(false);
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const [periodSearch, setPeriodSearch] = useState('');
  const periodRef = useRef(null);

  const [selectedChartFilter, setSelectedChartFilter] = useState(null);

  // Dropdown options from API
  const [locomotives, setLocomotives] = useState([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);

  // === Data Fetching ===
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {};
      if (selectedLocomotives.length > 0) filters.locomotive = selectedLocomotives[0];
      if (selectedMtcTypes.length > 0) filters.maintenanceType = selectedMtcTypes[0];
      if (selectedDepoLocs.length > 0) filters.depoLocation = selectedDepoLocs[0];
      if (selectedYears.length > 0) filters.year = selectedYears[0];
      if (selectedMonths.length > 0) filters.month = selectedMonths[0];
      
      const response = await apiService.getComponentUsage(filters);
      
      if (response.success) {
        setData(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLocomotives, selectedMtcTypes, selectedDepoLocs, selectedYears, selectedMonths]);

  const fetchDropdownOptions = useCallback(async () => {
    try {
      const [locomotivesRes, maintenanceRes] = await Promise.all([
        apiService.getLocomotives(),
        apiService.getMaintenanceTypes()
      ]);
      
      setLocomotives(locomotivesRes);
      setMaintenanceTypes(maintenanceRes);
    } catch (err) {
      console.error('Error fetching dropdown options:', err);
      setLocomotives([]);
      setMaintenanceTypes([]);
    }
  }, []);

  // === Effects ===
  useEffect(() => {
    fetchData();
    fetchDropdownOptions();
  }, [fetchData, fetchDropdownOptions]);

  useEffect(() => {
    fetchData();
  }, [selectedLocomotives, selectedMtcTypes, selectedDepoLocs, selectedYears, selectedMonths]);

  // === Generate derived data (same logic as original) ===
  const components = [...new Set(data.map((item) => item.description?.toUpperCase()))];
  const partNos = [...new Set(data.map((item) => item.part_no))];
  const soDates = [...new Set(data.map((item) => item.so_date))];
  const depoLocs = [...new Set(data.map((item) => item.depo))];
  const years = [...new Set(data.map((item) => item.year))];
  const months = [...new Set(data.map((item) => item.month))];
  const partUsings = [...new Set(data.map((item) => item.part_using))];
  const partTypes = [...new Set(data.map((item) => item.part_type))];
  const periods = [...new Set(data.map((item) => item.period))];

  // === Filter Logic (same as original) ===
  const handleToggle = (stateSetter, selected, value) => {
    stateSetter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };
  
  const filteredComponents = components.filter((component) => component.toLowerCase().includes(componentSearch.toLowerCase()));
  const filteredPartNos = partNos.filter((no) => no?.toString().toLowerCase().includes(partNoSearch.toLowerCase()));

  const filteredData = data.filter((item) => {
    const name = item.description?.toUpperCase();
    if (selectedComponents.length > 0 && !selectedComponents.includes(name)) return false;
    if (selectedPartNos.length > 0 && !selectedPartNos.includes(item.part_no)) return false;
    if (selectedSoDates.length > 0 && !selectedSoDates.includes(item.so_date)) return false;
    if (selectedPartUsings.length > 0 && !selectedPartUsings.includes(item.part_using)) return false;
    if (selectedPartTypes.length > 0 && !selectedPartTypes.includes(item.part_type)) return false;
    if (selectedPeriods.length > 0 && !selectedPeriods.includes(item.period)) return false;
    return true;
  });

  // === Import Handler ===
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('File type not supported. Please upload CSV, XLSX, or XLS file.');
      return;
    }
    
    try {
      setImporting(true);
      setError(null);
      
      const response = await apiService.importCSV(file);
      
      if (response.success) {
        setSuccessMessage(`Import successful! ${response.stats.success_count} records imported, ${response.stats.error_count} errors.`);
        await fetchData();
      } else {
        throw new Error(response.message || 'Import failed');
      }
    } catch (err) {
      console.error('Import error:', err);
      setError(`Import failed: ${err.message}`);
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  // === Chart Event Handlers (same as original) ===
  const handleBarClickDescription = useCallback((description) => {
    const filtered = data.filter((item) => item.description?.toUpperCase() === description.toUpperCase());
    setSelectedChartFilter(filtered);
  }, [data]);

  const handleBarClickLocomotive = useCallback((locomotive) => {
    setSelectedLocomotives([locomotive]);
    setSelectedChartFilter(data.filter((item) => item.locomotive === locomotive));
  }, [data]);

  // === Get Count Helper (same as original) ===
  const getCount = (label, value) => {
    switch (label) {
      case 'COMPONENT': return data.filter(d => d.description?.toUpperCase() === value).length;
      case 'PART NO': return data.filter(d => d.part_no === value).length;
      case 'MTC. TYPE': return data.filter(d => d.maintenance === value).length;
      case 'SO DATE': return data.filter(d => d.so_date === value).length;
      case 'LOCOMOTIVE': return data.filter(d => d.locomotive === value).length;
      case 'DEPO LOC.': return data.filter(d => d.depo === value).length;
      case 'YEARS': return data.filter(d => d.year === value).length;
      case 'MONTH': return data.filter(d => d.month === value).length;
      case 'PART USING': return data.filter(d => d.part_using === value).length;
      case 'PART TYPE': return data.filter(d => d.part_type === value).length;
      case 'PERIOD': return data.filter(d => d.period === value).length;
      default: return 0;
    }
  };

  // === Filter Dropdown Helper (same UI as original but with MUI) ===
  const renderFilter = (
    label, ref, isOpen, toggleOpen, searchValue, onSearchChange, items, selectedItems, onToggle
  ) => (
    <Box ref={ref} sx={{ position: 'relative', p: 2, borderRadius: 2, backgroundColor: '#f9f9f9', boxShadow: 1, minWidth: 220, mb: 2 }}>
      <Typography variant="subtitle1" color="primary" align="center" sx={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => toggleOpen((prev) => !prev)}>
        {label}
      </Typography>
      {isOpen && (
        <Box sx={{ position: 'absolute', top: '100%', left: 0, zIndex: 10, width: '100%', mt: 1 }}>
          <Paper variant="outlined" sx={{ p: 1, maxHeight: 320, overflow: 'auto', borderRadius: 1, backgroundColor: '#fff' }}>
            <TextField placeholder="Type to search" variant="outlined" size="small" fullWidth value={searchValue} onChange={(e) => onSearchChange(e.target.value)} sx={{ mb: 1 }} />
            <List dense>
              {items.map((item) => {
                const count = getCount(label, item);
                return (
                  <ListItem key={item} button onClick={() => {
                    onToggle(item);
                    if (label === 'COMPONENT' || label === 'DESCRIPTION') {
                      setSelectedChartFilter(data.filter((d) => d.description?.toUpperCase() === item.toUpperCase()));
                    } else if (label === 'LOCOMOTIVE') {
                      setSelectedLocomotives([item]);
                      setSelectedChartFilter(data.filter((d) => d.locomotive === item));
                    } else if (label === 'PERIOD') {
                      setSelectedPeriods([item]);
                      setSelectedChartFilter(data.filter((d) => d.period === item));
                    } else if (label === 'MAINTENANCE TYPE' || label === 'MTC. TYPE') {
                      setSelectedMtcTypes([item]);
                      setSelectedChartFilter(data.filter((d) => d.maintenance === item));
                    } else if (label === 'DEPO LOCATION' || label === 'DEPO LOC.') {
                      setSelectedDepoLocs([item]);
                      setSelectedChartFilter(data.filter((d) => d.depo === item));
                    } else if (label === 'YEAR' || label === 'YEARS') {
                      setSelectedYears([item]);
                      setSelectedChartFilter(data.filter((d) => d.year === item));
                    } else {
                      setSelectedChartFilter(null);
                    }
                  }} sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
                    <ListItemIcon>
                      <Checkbox checked={selectedItems.includes(item)} />
                    </ListItemIcon>
                    <ListItemText primary={<Box display="flex" justifyContent="space-between"><Typography noWrap>{item}</Typography><Typography fontWeight="bold">{count}</Typography></Box>} />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Box>
      )}
    </Box>
  );

  // === Pie Chart Render (same UI as original with click handlers) ===
  const renderPieChart = (data, colors, title) => (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, minHeight: 350, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <Typography variant="h6" align="center" gutterBottom>{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={90}
            label
            onClick={(_, index) => {
              let selectedName = null;
              if (index !== undefined && data[index]) {
                selectedName = data[index].name;
              }
              if (selectedName) {
                if (title === 'PERIOD') {
                  setSelectedPeriods([selectedName]);
                } else if (title === 'MAINTENANCE TYPE') {
                  setSelectedMtcTypes([selectedName]);
                } else if (title === 'DEPO LOCATION') {
                  setSelectedDepoLocs([selectedName]);
                } else if (title === 'YEAR') {
                  setSelectedYears([selectedName]);
                }
              }
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <RechartsTooltip />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );

  // === Pie Chart Config (same as original) ===
  const pieCharts = [
    { title: "PERIOD", data: generatePieData(filteredData, "period"), colors: colorSets.period },
    { title: "MAINTENANCE TYPE", data: generatePieData(filteredData, "maintenance"), colors: colorSets.maintenance },
    { title: "DEPO LOCATION", data: generatePieData(filteredData, "depo"), colors: colorSets.depo },
    { title: "YEAR", data: generatePieData(filteredData, "year"), colors: colorSets.year },
  ];

  // === Loading and Error States ===
  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading component usage data...</Typography>
      </Box>
    );
  }

  // === Main Render (exact same UI as original) ===
  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      {/* Success/Error Snackbars */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error">{error}</Alert>
      </Snackbar>
      
      <Snackbar open={!!successMessage} autoHideDuration={4000} onClose={() => setSuccessMessage(null)}>
        <Alert onClose={() => setSuccessMessage(null)} severity="success">{successMessage}</Alert>
      </Snackbar>

      {/* Header */}
      <Typography variant="h4" fontWeight={700} sx={{ mb: 2, color: '#2563eb', letterSpacing: 1 }}>
        Component Usage
      </Typography>

      {/* Charts Section */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          {renderParetoChart(generateParetoData(filteredData, "description"), "DESCRIPTION", "DESCRIPTION", handleBarClickDescription)}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderParetoChart(generateParetoData(filteredData, "locomotive"), "LOCOMOTIVE", "LOCOMOTIVE", handleBarClickLocomotive)}
        </Grid>
        {pieCharts.map((chart, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            {renderPieChart(chart.data, chart.colors, chart.title)}
          </Grid>
        ))}
      </Grid>

      {/* Import Button Area */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button
          component="label"
          variant="contained"
          startIcon={importing ? <CircularProgress size={20} color="inherit" /> : <UploadFileIcon />}
          disabled={importing}
          sx={{ minWidth: 120, backgroundColor: '#2563eb', color: '#fff', boxShadow: 1, textTransform: 'none', mr: 2 }}
        >
          {importing ? 'Importing...' : 'Import'}
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            hidden
            onChange={handleImport}
            disabled={importing}
          />
        </Button>
        {data.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            {data.length} records loaded
          </Typography>
        )}
      </Box>

      {/* Filter + Table Section */}
      <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ color: '#2563eb', mb: 2 }}>
            Filter Data & Data Table
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {/* Filter section */}
          <Box mb={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('COMPONENT', dropdownRef, dropdownOpen, setDropdownOpen, componentSearch, setComponentSearch, filteredComponents, selectedComponents, (value) => handleToggle(setSelectedComponents, selectedComponents, value))}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('PART NO', partNoRef, partNoOpen, setPartNoOpen, partNoSearch, setPartNoSearch, filteredPartNos, selectedPartNos, (value) => handleToggle(setSelectedPartNos, selectedPartNos, value))}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('MTC. TYPE', mtcTypeRef, mtcTypeOpen, setMtcTypeOpen, mtcTypeSearch, setMtcTypeSearch, maintenanceTypes, selectedMtcTypes, (value) => handleToggle(setSelectedMtcTypes, selectedMtcTypes, value))}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('SO DATE', soDateRef, soDateOpen, setSoDateOpen, soDateSearch, setSoDateSearch, soDates.filter((date) => date?.toString().toLowerCase().includes(soDateSearch.toLowerCase())), selectedSoDates, (value) => handleToggle(setSelectedSoDates, selectedSoDates, value))}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('LOCOMOTIVE', locomotiveRef, locomotiveOpen, setLocomotiveOpen, locomotiveSearch, setLocomotiveSearch, locomotives.filter((loc) => loc?.toString().toLowerCase().includes(locomotiveSearch.toLowerCase())), selectedLocomotives, (value) => handleToggle(setSelectedLocomotives, selectedLocomotives, value))}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('DEPO LOC.', depoLocRef, depoLocOpen, setDepoLocOpen, depoLocSearch, setDepoLocSearch, depoLocs.filter((depo) => depo?.toString().toLowerCase().includes(depoLocSearch.toLowerCase())), selectedDepoLocs, (value) => handleToggle(setSelectedDepoLocs, selectedDepoLocs, value))}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('YEARS', yearRef, yearOpen, setYearOpen, yearSearch, setYearSearch, years.filter((year) => year?.toString().toLowerCase().includes(yearSearch.toLowerCase())), selectedYears, (value) => handleToggle(setSelectedYears, selectedYears, value))}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('MONTH', monthRef, monthOpen, setMonthOpen, monthSearch, setMonthSearch, months.filter((month) => month?.toString().toLowerCase().includes(monthSearch.toLowerCase())), selectedMonths, (value) => handleToggle(setSelectedMonths, selectedMonths, value))}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('PART USING', partUsingRef, partUsingOpen, setPartUsingOpen, partUsingSearch, setPartUsingSearch, partUsings.filter((item) => item?.toString().toLowerCase().includes(partUsingSearch.toLowerCase())), selectedPartUsings, (value) => handleToggle(setSelectedPartUsings, selectedPartUsings, value))}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('PART TYPE', partTypeRef, partTypeOpen, setPartTypeOpen, partTypeSearch, setPartTypeSearch, partTypes.filter((item) => item?.toString().toLowerCase().includes(partTypeSearch.toLowerCase())), selectedPartTypes, (value) => handleToggle(setSelectedPartTypes, selectedPartTypes, value))}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('PERIOD', periodRef, periodOpen, setPeriodOpen, periodSearch, setPeriodSearch, periods.filter((item) => item?.toString().toLowerCase().includes(periodSearch.toLowerCase())), selectedPeriods, (value) => handleToggle(setSelectedPeriods, selectedPeriods, value))}</Grid>
            </Grid>
          </Box>
          
          {/* Table section */}
          <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableCell key={header} sx={{ fontWeight: 'bold', backgroundColor: '#2563eb', color: '#fff' }}>
                      {header.toUpperCase()}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(selectedChartFilter ?? filteredData).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.description ?? '-'}</TableCell>
                    <TableCell>{row.part_no ?? '-'}</TableCell>
                    <TableCell>{row.description ?? '-'}</TableCell>
                    <TableCell>{row.qty ?? '-'}</TableCell>
                    <TableCell>{row.locomotive ?? '-'}</TableCell>
                    <TableCell>{row.period ?? '-'}</TableCell>
                    <TableCell>{row.maintenance ?? '-'}</TableCell>
                    <TableCell>{row.depo ?? '-'}</TableCell>
                    <TableCell>{row.month ?? '-'}</TableCell>
                    <TableCell>{row.year ?? '-'}</TableCell>
                    <TableCell>{row.so_date ?? '-'}</TableCell>
                    <TableCell>{row.invoice ?? '-'}</TableCell>
                    <TableCell>{row.invoice_date ?? '-'}</TableCell>
                    <TableCell>{row.skb ?? '-'}</TableCell>
                    <TableCell>{row.part_type ?? '-'}</TableCell>
                    <TableCell>{row.part_using ?? '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ComponentUsage;