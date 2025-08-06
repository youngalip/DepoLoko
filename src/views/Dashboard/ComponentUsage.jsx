import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box, Grid, Card, CardContent, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Checkbox, List, ListItem, ListItemIcon,
  ListItemText, TextField, Divider
} from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, XAxis, YAxis, CartesianGrid, Bar, Line, Label
} from "recharts";
import countBy from "lodash/countBy";

// === Dummy Data ===
const headers = [
  'Component', 'Part No', 'Description', 'Qty', 'Locomotive', 'Period', 'Maintenance Type',
  'Depo Location', 'Month', 'Year', 'SO Date', 'Invoice', 'Invoice Date', 'SKB', 'Part Type', 'Part Using'
];

const dummyData = [
  { partNo: '40168223', description: 'SPRING-SINGLE COIL', qty: 1, locomotive: 'CC 205 13 ...', period: 'CONDITION BASED', maintenance: 'UNSCHEDULE', depo: 'DEPO TNK', month: 'November', year: '2016', soDate: 'Nov 26, 2016', invoice: '93161...', invoiceDate: '-', skb: 'KET-02259', partType: 'PROTECTIVE PART', partUsing: 'PROTECTIVE PART', },
  { partNo: '40173748', description: 'BR PIPE CNTRL PRTN', qty: 1, locomotive: 'CC 205 13 28', period: 'CORRECTIVE', maintenance: 'SUPERVISI', depo: 'DEPO THN', month: 'July', year: '2016', soDate: 'Jul 11, 2016', invoice: '-', invoiceDate: '-', skb: '-', partType: 'PROTECTIVE PART', partUsing: 'PROTECTIVE PART', },
  { partNo: '8287827', description: 'BOLT HEX HEAD 1/2-20', qty: 4, locomotive: 'CC 205 13 27', period: 'P3', maintenance: 'SCHEDULE', depo: 'DEPO TNK', month: 'October', year: '2016', soDate: 'Oct 8, 2016', invoice: '-', invoiceDate: '2016-06-13', skb: '(KET-TDPPN-90002)', partType: 'PROTECTIVE PART', partUsing: 'PROTECTIVE PART', },
  { partNo: '180122', description: 'BOLT...HEX HEAD 3/8-16', qty: 1, locomotive: 'CC 205 11 03', period: 'P36', maintenance: 'SCHEDULE', depo: 'DEPO TNK', month: 'December', year: '2020', soDate: 'Dec 1, 2020', invoice: '-', invoiceDate: '-', skb: '-', partType: 'PROTECTIVE PART', partUsing: 'PROTECTIVE PART', },
  { partNo: '40139944', description: 'WASHER-DISC SPRING', qty: 10, locomotive: 'CC 205 13 43', period: 'P36', maintenance: 'SCHEDULE', depo: 'DEPO TNK', month: 'July', year: '2017', soDate: 'Jul 13, 2017', invoice: '93276133', invoiceDate: '-', skb: '(KET-TDPPN-90002)', partType: 'PROTECTIVE PART', partUsing: 'PROTECTIVE PART', },
  { partNo: '40120514', description: 'EUI ASM', qty: 2, locomotive: 'CC 205 13 02', period: 'CONDITION BASED', maintenance: 'UNSCHEDULE', depo: 'DEPO TNK', month: 'October', year: '2018', soDate: 'Oct 8, 2018', invoice: '93482415', invoiceDate: '-', skb: '(KET-TDPPN-00005)', partType: 'PROTECTIVE PART', partUsing: 'PROTECTIVE PART', },
  { partNo: '40125552', description: 'KNUCKLE-CPLR TYPE E', qty: 1, locomotive: 'CC 205 13 29', period: 'P3', maintenance: 'SCHEDULE', depo: 'DEPO TNK', month: 'March', year: '2016', soDate: 'Mar 8, 2016', invoice: '-', invoiceDate: '-', skb: '-', partType: 'PROTECTIVE PART', partUsing: 'PROTECTIVE PART', },
  { partNo: '40029131', description: 'DIODE...SILICON - RECTIFIER BANK', qty: 1, locomotive: 'CC 205 13 09', period: 'P3', maintenance: 'SCHEDULE', depo: 'DEPO TNK', month: 'January', year: '2016', soDate: 'Jan 19, 2016', invoice: '-', invoiceDate: '-', skb: '-', partType: 'PROTECTIVE PART', partUsing: 'PROTECTIVE PART', },
  { partNo: '5552495', description: 'Washer', qty: 1, locomotive: 'CC 205 13 43', period: 'P24', maintenance: 'SCHEDULE', depo: 'DEPO TNK', month: 'August', year: '2021', soDate: 'Aug 7, 2021', invoice: '-', invoiceDate: '-', skb: '-', partType: 'PROTECTIVE PART', partUsing: 'PROTECTIVE PART', },
];

// === Color Sets for Charts ===
const colorSets = {
  period: ["#1976d2", "#f06292", "#81c784", "#ffb74d", "#ba68c8"],
  maintenance: ["#42a5f5", "#ce93d8", "#f48fb1"],
  depo: ["#4dd0e1", "#ffd54f", "#aed581", "#90a4ae"],
  year: ["#e57373", "#f06292", "#ba68c8", "#64b5f6", "#4db6ac", "#81c784", "#dce775", "#fff176", "#ffb74d", "#a1887f"],
};

// === Chart Data Generator ===
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
          - Record Count: <b>{record?.value}</b>
        </Typography>
        <Typography variant="body2" sx={{ color: "#d32f2f" }}>
          - Cumulative: <b>{cumulative?.value}%</b>
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
            // Ambil nama dari data[index] karena event PieChart tidak selalu mengirim payload slice
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

import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button } from '@mui/material';

const ComponentUsage = () => {
  // === Filter States ===
  // Import handler (dummy, bisa dihubungkan ke backend jika sudah ada endpoint)
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('File type not supported. Please upload a CSV, XLSX, or XLS file.');
      return;
    }
    alert(`File yang dipilih: ${file.name}`);
    // TODO: Integrasi ke backend jika sudah ada endpoint
  };
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

  // === Unique Value Arrays ===
  const components = [...new Set(dummyData.map((item) => item.description?.toUpperCase()))];
  const partNos = [...new Set(dummyData.map((item) => item.partNo))];
  const soDates = [...new Set(dummyData.map((item) => item.soDate))];
  const locomotives = [...new Set(dummyData.map((item) => item.locomotive))];
  const depoLocs = [...new Set(dummyData.map((item) => item.depo))];
  const years = [...new Set(dummyData.map((item) => item.year))];
  const months = [...new Set(dummyData.map((item) => item.month))];
  const partUsings = [...new Set(dummyData.map((item) => item.partUsing))];
  const partTypes = [...new Set(dummyData.map((item) => item.partType))];
  const periods = [...new Set(dummyData.map((item) => item.period))];

  // === Filtered Arrays ===
  const filteredMtcTypes = [
    { type: 'SCHEDULE', count: 20253 },
    { type: 'UNSCHEDULE', count: 2463 },
    { type: 'SUPERVISI', count: 1963 },
    { type: 'null', count: 48 },
  ].filter((item) => item.type.toLowerCase().includes(mtcTypeSearch.toLowerCase()));
  const filteredSoDates = soDates.filter((date) => date?.toString().toLowerCase().includes(soDateSearch.toLowerCase()));
  const filteredLocomotives = locomotives.filter((loc) => loc?.toString().toLowerCase().includes(locomotiveSearch.toLowerCase()));
  const filteredDepoLocs = depoLocs.filter((depo) => depo?.toString().toLowerCase().includes(depoLocSearch.toLowerCase()));
  const filteredYears = years.filter((year) => year?.toString().toLowerCase().includes(yearSearch.toLowerCase()));
  const filteredMonths = months.filter((month) => month?.toString().toLowerCase().includes(monthSearch.toLowerCase()));
  const filteredPartUsings = partUsings.filter((item) => item?.toString().toLowerCase().includes(partUsingSearch.toLowerCase()));
  const filteredPartTypes = partTypes.filter((item) => item?.toString().toLowerCase().includes(partTypeSearch.toLowerCase()));
  const filteredPeriods = periods.filter((item) => item?.toString().toLowerCase().includes(periodSearch.toLowerCase()));

  // === Filter Logic ===
  const handleToggle = (stateSetter, selected, value) => {
    stateSetter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };
  const filteredComponents = components.filter((component) => component.toLowerCase().includes(componentSearch.toLowerCase()));
  const filteredPartNos = partNos.filter((no) => no?.toString().toLowerCase().includes(partNoSearch.toLowerCase()));

  const filteredData = dummyData.filter((item) => {
    const name = item.description?.toUpperCase();
    if (selectedComponents.length > 0 && !selectedComponents.includes(name)) return false;
    if (selectedPartNos.length > 0 && !selectedPartNos.includes(item.partNo)) return false;
    if (selectedMtcTypes.length > 0 && !selectedMtcTypes.includes(item.maintenance)) return false;
    if (selectedSoDates.length > 0 && !selectedSoDates.includes(item.soDate)) return false;
    if (selectedLocomotives.length > 0 && !selectedLocomotives.includes(item.locomotive)) return false;
    if (selectedDepoLocs.length > 0 && !selectedDepoLocs.includes(item.depo)) return false;
    if (selectedYears.length > 0 && !selectedYears.includes(item.year)) return false;
    if (selectedMonths.length > 0 && !selectedMonths.includes(item.month)) return false;
    if (selectedPartUsings.length > 0 && !selectedPartUsings.includes(item.partUsing)) return false;
    if (selectedPartTypes.length > 0 && !selectedPartTypes.includes(item.partType)) return false;
    if (selectedPeriods.length > 0 && !selectedPeriods.includes(item.period)) return false;
    return true;
  });

  const getCount = (label, value) => {
    switch (label) {
      case 'COMPONENT': return dummyData.filter(d => d.description?.toUpperCase() === value).length;
      case 'PART NO': return dummyData.filter(d => d.partNo === value).length;
      case 'MTC. TYPE': return dummyData.filter(d => d.maintenance === value).length;
      case 'SO DATE': return dummyData.filter(d => d.soDate === value).length;
      case 'LOCOMOTIVE': return dummyData.filter(d => d.locomotive === value).length;
      case 'DEPO LOC.': return dummyData.filter(d => d.depo === value).length;
      case 'YEARS': return dummyData.filter(d => d.year === value).length;
      case 'MONTH': return dummyData.filter(d => d.month === value).length;
      case 'PART USING': return dummyData.filter(d => d.partUsing === value).length;
      case 'PART TYPE': return dummyData.filter(d => d.partType === value).length;
      case 'PERIOD': return dummyData.filter(d => d.period === value).length;
      default: return 0;
    }
  };

  const handleBarClickDescription = useCallback((description) => {
    const filtered = dummyData.filter((item) => item.description?.toUpperCase() === description.toUpperCase());
    setSelectedChartFilter(filtered);
  }, []);
  const handleBarClickLocomotive = useCallback((locomotive) => {
    setSelectedLocomotives([locomotive]);
    setSelectedChartFilter(dummyData.filter((item) => item.locomotive === locomotive));
  }, []);

  // === Filter Dropdown Helper ===
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
                    // Integrate filter with chart for relevant fields
                    if (label === 'COMPONENT' || label === 'DESCRIPTION') {
                      setSelectedChartFilter(dummyData.filter((d) => d.description?.toUpperCase() === item.toUpperCase()));
                    } else if (label === 'LOCOMOTIVE') {
                      setSelectedLocomotives([item]);
                      setSelectedChartFilter(dummyData.filter((d) => d.locomotive === item));
                    } else if (label === 'PERIOD') {
                      setSelectedPeriods([item]);
                      setSelectedChartFilter(dummyData.filter((d) => d.period === item));
                    } else if (label === 'MAINTENANCE TYPE' || label === 'MTC. TYPE') {
                      setSelectedMtcTypes([item]);
                      setSelectedChartFilter(dummyData.filter((d) => d.maintenance === item));
                    } else if (label === 'DEPO LOCATION' || label === 'DEPO LOC.') {
                      setSelectedDepoLocs([item]);
                      setSelectedChartFilter(dummyData.filter((d) => d.depo === item));
                    } else if (label === 'YEAR' || label === 'YEARS') {
                      setSelectedYears([item]);
                      setSelectedChartFilter(dummyData.filter((d) => d.year === item));
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

  // === Pie Chart Config ===
  const pieCharts = [
    { title: "PERIOD", data: generatePieData(filteredData, "period"), colors: colorSets.period },
    { title: "MAINTENANCE TYPE", data: generatePieData(filteredData, "maintenance"), colors: colorSets.maintenance },
    { title: "DEPO LOCATION", data: generatePieData(filteredData, "depo"), colors: colorSets.depo },
    { title: "YEAR", data: generatePieData(filteredData, "year"), colors: colorSets.year },
  ];

  // === Layout ===
  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
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
          startIcon={<UploadFileIcon />}
          sx={{ minWidth: 120, backgroundColor: '#2563eb', color: '#fff', boxShadow: 1, textTransform: 'none', mr: 2 }}
        >
          Import
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            hidden
            onChange={handleImport}
          />
        </Button>
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
              <Grid item xs={12} sm={6} md={3}>{renderFilter('MTC. TYPE', mtcTypeRef, mtcTypeOpen, setMtcTypeOpen, mtcTypeSearch, setMtcTypeSearch, filteredMtcTypes.map(i=>i.type), selectedMtcTypes, (value) => handleToggle(setSelectedMtcTypes, selectedMtcTypes, value))}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('SO DATE', soDateRef, soDateOpen, setSoDateOpen, soDateSearch, setSoDateSearch, filteredSoDates, selectedSoDates, (value) => handleToggle(setSelectedSoDates, selectedSoDates, value))}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('LOCOMOTIVE', locomotiveRef, locomotiveOpen, setLocomotiveOpen, locomotiveSearch, setLocomotiveSearch, filteredLocomotives, selectedLocomotives, (value) => handleToggle(setSelectedLocomotives, selectedLocomotives, value))}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('DEPO LOC.', depoLocRef, depoLocOpen, setDepoLocOpen, depoLocSearch, setDepoLocSearch, filteredDepoLocs, selectedDepoLocs, (value) => handleToggle(setSelectedDepoLocs, selectedDepoLocs, value))}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('YEARS', yearRef, yearOpen, setYearOpen, yearSearch, setYearSearch, filteredYears, selectedYears, (value) => handleToggle(setSelectedYears, selectedYears, value))}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('MONTH', monthRef, monthOpen, setMonthOpen, monthSearch, setMonthSearch, filteredMonths, selectedMonths, (value) => handleToggle(setSelectedMonths, selectedMonths, value))}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('PART USING', partUsingRef, partUsingOpen, setPartUsingOpen, partUsingSearch, setPartUsingSearch, filteredPartUsings, selectedPartUsings, (value) => handleToggle(setSelectedPartUsings, selectedPartUsings, value))}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('PART TYPE', partTypeRef, partTypeOpen, setPartTypeOpen, partTypeSearch, setPartTypeSearch, filteredPartTypes, selectedPartTypes, (value) => handleToggle(setSelectedPartTypes, selectedPartTypes, value))}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderFilter('PERIOD', periodRef, periodOpen, setPeriodOpen, periodSearch, setPeriodSearch, filteredPeriods, selectedPeriods, (value) => handleToggle(setSelectedPeriods, selectedPeriods, value))}</Grid>
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
                    <TableCell>{row.partNo ?? '-'}</TableCell>
                    <TableCell>{row.description ?? '-'}</TableCell>
                    <TableCell>{row.qty ?? '-'}</TableCell>
                    <TableCell>{row.locomotive ?? '-'}</TableCell>
                    <TableCell>{row.period ?? '-'}</TableCell>
                    <TableCell>{row.maintenance ?? '-'}</TableCell>
                    <TableCell>{row.depo ?? '-'}</TableCell>
                    <TableCell>{row.month ?? '-'}</TableCell>
                    <TableCell>{row.year ?? '-'}</TableCell>
                    <TableCell>{row.soDate ?? '-'}</TableCell>
                    <TableCell>{row.invoice ?? '-'}</TableCell>
                    <TableCell>{row.invoiceDate ?? '-'}</TableCell>
                    <TableCell>{row.skb ?? '-'}</TableCell>
                    <TableCell>{row.partType ?? '-'}</TableCell>
                    <TableCell>{row.partUsing ?? '-'}</TableCell>
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