import React, { useState } from "react";
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
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

const chartDataMap = {
  "APCcLb": [
    { locoNumber: "CC205 13", pressure: -6.38 },
    { locoNumber: "CC205 21", pressure: -7.5 },
    { locoNumber: "CC205 22", pressure: -6.8 },
    { locoNumber: "CC205 13", pressure: -8.4 },
    { locoNumber: "CC205 21", pressure: -7.2 },
  ],
  "APImRb": [
    { locoNumber: "CC205 13", pressure: -5.1 },
    { locoNumber: "CC205 21", pressure: -6.9 },
    { locoNumber: "CC205 22", pressure: -8.2 },
    { locoNumber: "CC205 13", pressure: -7.7 },
    { locoNumber: "CC205 21", pressure: -6.5 },
  ],
  "OPTuRPS": [
    { locoNumber: "CC205 13", pressure: -10.2 },
    { locoNumber: "CC205 21", pressure: -9.6 },
    { locoNumber: "CC205 22", pressure: -8.8 },
    { locoNumber: "CC205 13", pressure: -9.4 },
    { locoNumber: "CC205 21", pressure: -8.9 },
  ],
  "WPEgILP": [
    { locoNumber: "CC205 13", pressure: -7.7 },
    { locoNumber: "CC205 21", pressure: -8.1 },
    { locoNumber: "CC205 22", pressure: -7.3 },
    { locoNumber: "CC205 13", pressure: -6.9 },
    { locoNumber: "CC205 21", pressure: -8.5 },
  ],
  "WPEgOtP": [
    { locoNumber: "CC205 13", pressure: -5.9 },
    { locoNumber: "CC205 21", pressure: -7.0 },
    { locoNumber: "CC205 22", pressure: -7.8 },
    { locoNumber: "CC205 13", pressure: -8.2 },
    { locoNumber: "CC205 21", pressure: -6.6 },
  ],
  "EEngRPM": [
    { locoNumber: "CC205 13", pressure: -9.1 },
    { locoNumber: "CC205 21", pressure: -8.7 },
    { locoNumber: "CC205 22", pressure: -8.3 },
    { locoNumber: "CC205 13", pressure: -9.0 },
    { locoNumber: "CC205 21", pressure: -7.9 },
  ],
  "TPU RPM": [
    { locoNumber: "CC205 13", pressure: -6.2 },
    { locoNumber: "CC205 21", pressure: -7.6 },
    { locoNumber: "CC205 22", pressure: -7.9 },
    { locoNumber: "CC205 13", pressure: -8.1 },
    { locoNumber: "CC205 21", pressure: -7.7 },
  ],
  "EgOilTF": [
    { locoNumber: "CC205 13", pressure: -8.4 },
    { locoNumber: "CC205 21", pressure: -8.8 },
    { locoNumber: "CC205 22", pressure: -9.2 },
    { locoNumber: "CC205 13", pressure: -8.6 },
    { locoNumber: "CC205 21", pressure: -9.0 },
  ],
  "EngTmpF": [
    { locoNumber: "CC205 13", pressure: -7.1 },
    { locoNumber: "CC205 21", pressure: -7.9 },
    { locoNumber: "CC205 22", pressure: -8.3 },
    { locoNumber: "CC205 13", pressure: -8.7 },
    { locoNumber: "CC205 21", pressure: -8.0 },
  ],
  "AWT": [
    { locoNumber: "CC205 13", pressure: -8.2 },
    { locoNumber: "CC205 21", pressure: -8.4 },
    { locoNumber: "CC205 22", pressure: -8.6 },
    { locoNumber: "CC205 13", pressure: -8.8 },
    { locoNumber: "CC205 21", pressure: -9.0 },
  ],
  "ATImRbF": [
    { locoNumber: "CC205 13", pressure: -6.5 },
    { locoNumber: "CC205 21", pressure: -7.2 },
    { locoNumber: "CC205 22", pressure: -7.8 },
    { locoNumber: "CC205 13", pressure: -8.3 },
    { locoNumber: "CC205 21", pressure: -8.9 },
  ],
  "CA V": [
    { locoNumber: "CC205 13", pressure: -7.8 },
    { locoNumber: "CC205 21", pressure: -8.2 },
    { locoNumber: "CC205 22", pressure: -8.5 },
    { locoNumber: "CC205 13", pressure: -8.7 },
    { locoNumber: "CC205 21", pressure: -8.1 },
  ]
};

const tabs = [
  "APCcLb",
  "APImRb",
  "OPTuRPS",
  "WPEgILP",
  "WPEgOtP",
  "EEngRPM",
  "TPU RPM",
  "EgOilTF",
  "EngTmpF",
  "AWT",
  "ATImRbF",
  "CA V"
];
const chartTitles = {
  "APCcLb": "PERFORMANCE MONITORING - CRANKCASE PRESSURE ( (-4) - (-12) Vacuum )",
  "APImRb": "PERFORMANCE MONITORING - AIR BOX PRESSURE ( 248,21 - 289,58 Kpa ) / ( 36 - 42 Psi )",
  "OPTuRPS": "PERFORMANCE MONITORING - TURBO LUBE OIL PRESSURE ( 517,10 - 655 Kpa ) / ( 75 - 95 Psi )",
  "WPEgILP": "PERFORMANCE MONITORING - COOLANT PRESSURE ENGINE IN ( 379,21 - 517,10 Kpa ) / ( 55 - 75 Psi )",
  "WPEgOtP": "PERFORMANCE MONITORING - COOLANT PRESSURE ENGINE OUT ( 172,36 - 310,26 Kpa ) / ( 25 - 45 Psi )",
  "EEngRPM": "PERFORMANCE MONITORING - ENGINE SPEED ( 900 - 908 Rpm )",
  "TPU RPM": "PERFORMANCE MONITORING - TURBOCHARGER SPEED ( 16000 - 23000 Rpm )",
  "EgOilTF": "PERFORMANCE MONITORING - LUBE OIL TEMPERATURE ( 79,44 - 96,11 'C ) / ( 175 - 205 'F )",
  "EngTmpF": "PERFORMANCE MONITORING - COOLANT TEMPERATURE ( 76,66 - 90,55 'C ) / ( 170 - 195 'F )",
  "AWT": "PERFORMANCE MONITORING - AFTERCOOLER WATER TEMPERATURE ( 51,66 - 65,55 'C ) / ( 125 - 150 'F )",
  "ATImRbF": "PERFORMANCE MONITORING - AIR BOX TEMPERATURE ( 60 - 73,88 'C ) / ( 140 - 165 'F )",
  "CA V": "PERFORMANCE MONITORING - COMPANION ALTERNATOR VOLTAGE ( 228 - 242 Volt )"
};

export default function PerformanceHistory() {
  // Chart data state for import
  const [importedChartDataMap, setImportedChartDataMap] = useState(null);

  // Import handler
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();
    if (ext === 'csv') {
      reader.onload = (evt) => {
        const csv = evt.target.result;
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Set imported data for current tab only
            setImportedChartDataMap((prev) => ({
              ...(prev || chartDataMap),
              [tabs[activeTab]]: results.data
            }));
          },
        });
      };
      reader.readAsText(file);
    } else if (ext === 'xlsx' || ext === 'xls') {
      reader.onload = (evt) => {
        const dataArr = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(dataArr, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        setImportedChartDataMap((prev) => ({
          ...(prev || chartDataMap),
          [tabs[activeTab]]: json
        }));
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('File type not supported. Please upload a CSV, XLSX, or XLS file.');
    }
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [includeToday, setIncludeToday] = useState(false);
  const [locoNumber, setLocoNumber] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const currentTab = tabs[activeTab];
  const chartData = (importedChartDataMap ? importedChartDataMap : chartDataMap)[currentTab];

  return (
    <Box p={4}>
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
      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, newVal) => setActiveTab(newVal)}
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 2 }}
      >
        {tabs.map((tab, index) => (
          <Tab label={tab} key={index} sx={{ textTransform: 'none' }} />
        ))}
      </Tabs>

      <Card sx={{ px: 4, py: 3, mt: 1, boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Box display="flex" flexWrap="wrap" gap={4} mb={2} alignItems="center">
            {/* Filter by Date Trigger */}
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
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClosePopover}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              PaperProps={{
                sx: {
                  p: 2,
                  backgroundColor: "#ffa726", // orange background
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
                        backgroundColor: "#fff",
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
                        backgroundColor: "#fff",
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

            {/* Locomotive Number Dropdown */}
            <Select
              value={locoNumber}
              displayEmpty
              onChange={(e) => setLocoNumber(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Locomotive Number</MenuItem>
              <MenuItem value="CC205 13">CC205 13</MenuItem>
              <MenuItem value="CC205 21 22">CC205 21 22</MenuItem>
            </Select>
          </Box>

          {/* Chart Title */}
          <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
            {chartTitles[currentTab]}
          </Typography>

          {/* Chart Area - scrollable */}
          <Box sx={{ width: '100%', overflowX: 'auto', paddingRight: 10 }}>
            <Box sx={{ minWidth: 3000, pr: 10 }}>
              <ResponsiveContainer width={3000} height={600}>
                <LineChart data={chartData} margin={{ top: 20, right: 200, left: 0, bottom: 120 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="locoNumber" angle={-45} textAnchor="end" height={80} interval={0} />
                  <YAxis domain={[-14, 0]} />
                  <Tooltip
                    formatter={(value) => [`${value}`, "Pressure"]}
                    labelFormatter={(label) => `Nomor Lokomotif: ${label}`}
                  />
                  <ReferenceLine y={-4} stroke="#f48fb1" label={{ value: "Max (-4)", position: "right", fill: "#f48fb1", fontWeight: "bold" }} />
                  <ReferenceLine y={-8} stroke="#4caf50" label={{ value: "Ideal Average (-8)", position: "right", fill: "#4caf50", fontWeight: "bold" }} />
                  <ReferenceLine y={-12} stroke="#f44336" label={{ value: "Min (-12)", position: "right", fill: "#f44336", fontWeight: "bold" }} />
                  <Line type="monotone" dataKey="pressure" stroke="#6A1B9A" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
