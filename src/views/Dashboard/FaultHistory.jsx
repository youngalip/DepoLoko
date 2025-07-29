import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
  Button,
  Menu,
  MenuItem,
  FormGroup,
  FormControl,
  InputLabel,
  OutlinedInput,
  ListItemText,
  Select,
  Autocomplete,
  TextField,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { number } from 'yup';

const dummyData = [
  {
    number: 1,
    loco: 'CC205 21 32',
    type: 'Fire Fault',
    code: '310',
    description: 'LDARS communication was lost - Lead',
    priorityLevel: '-',
    priorityDesc: '-',
    counter: 3,
    delta: '-'
  },
  {
    number: 2,
    loco: 'CC205 13 23',
    type: 'Lcc Fault',
    code: '1917',
    description: 'FAILED FEEDBACK - RADAR',
    priorityLevel: '3',
    priorityDesc: 'Unit Likely to Fail Soon',
    counter: 3,
    delta: '-1'
  },
  {
    number: 3,
    loco: 'CC205 21 15',
    type: 'Lcc Fault',
    code: '4509',
    description: 'EMDEC - SENSOR READING TOO LOW WATER PRESSURE - ENGINE OUT',
    priorityLevel: '3',
    priorityDesc: 'Unit Likely to Fail Soon',
    counter: 1,
    delta: '0'
  },
  {
    number: 4,
    loco: 'CC205 13 08',
    type: 'Lcc Fault',
    code: '226',
    description: 'NO START - STARTER MOTOR ABUTMENT CONDITION, CHECK START FUSE',
    priorityLevel: '-',
    priorityDesc: '-',
    counter: 1,
    delta: '-'
  },
  {
    number: 5,
    loco: 'CC205 13 06',
    type: 'Lcc Fault',
    code: '765',
    description: 'TCC #1 TORQUE REDUCTION - WHEEL DIAMETER MISMATCH',
    priorityLevel: '-',
    priorityDesc: '-',
    counter: 1,
    delta: '-'
  },
  {
    number: 6,
    loco: 'CC205 21 05',
    type: 'Fire Fault',
    code: '333',
    description: 'No communication to Fuel System - Check controlling Circuit Breaker',
    priorityLevel: '-',
    priorityDesc: '-',
    counter: 1,
    delta: '-'
  },
  {
    number: 7,
    loco: 'CC205 21 16',
    type: 'Fire Fault',
    code: '310',
    description: 'LDARS communication was lost - Lead',
    priorityLevel: '-',
    priorityDesc: '-',
    counter: 1,
    delta: '-'
  },
  {
    number: 8,
    loco: 'CC205 21 05',
    type: 'Lcc Fault',
    code: '4184',
    description: 'NO LOAD - POWER/DB CONFLICT CHECK JUMPER CABLE',
    priorityLevel: '-',
    priorityDesc: '-',
    counter: 1,
    delta: '-'
  },
  {
    number: 9,
    loco: 'CC205 13 13',
    type: 'Fire Fault',
    code: '333',
    description: 'No communication to Fuel System - Check controlling Circuit Breaker',
    priorityLevel: '-',
    priorityDesc: '-',
    counter: 1,
    delta: '-'
  },
  {
    number: 10,
    loco: 'CC205 21 36',
    type: 'Fire Fault',
    code: '245',
    description: 'LDARS health status Not OK',
    priorityLevel: '-',
    priorityDesc: '-',
    counter: 1,
    delta: '-'
  },
  {
    number: 11,
    loco: 'CC205 21 28',
    type: 'Fire Fault',
    code: '245',
    description: 'LDARS health status Not OK',
    priorityLevel: '-',
    priorityDesc: '-',
    counter: 1,
    delta: '-'
  },
    {
    number: 12,
    loco: 'CC205 21 21',
    type: 'Fire Fault',
    code: '245',
    description: 'LDARS health status Not OK',
    priorityLevel: '-',
    priorityDesc: '-',
    counter: 2,
    delta: '-'
  },
  {
    number: 13,
    loco: 'CC205 21 18',
    type: 'Fire Fault',
    code: '333',
    description: 'No communication to Fuel System - Check controlling Circuit Breaker',
    priorityLevel: '-',
    priorityDesc: '-',
    counter: 2,
    delta: '-'
  },
  {
    number: 14,
    loco: 'CC205 21 36',
    type: 'Fire Fault',
    code: '246',
    description: 'LDARS communication was lost',
    priorityLevel: '-',
    priorityDesc: '-',
    counter: 1,
    delta: '-'
  },
  {
    number: 15,
    loco: 'CC205 21 01',
    type: 'Fire Fault',
    code: '310',
    description: 'LDARS communication was lost - Lead',
    priorityLevel: '-',
    priorityDesc: '-',
    counter: 1,
    delta: '-'
  },
  {
    number: 16,
    loco: 'CC205 13 11',
    type: 'Fire Fault',
    code: '333',
    description: 'No communication to Fuel System - Check controlling Circuit Breaker',
    priorityLevel: '-',
    priorityDesc: '-',
    counter: 1,
    delta: '-'
  },
  {
    number: 17,
    loco: 'CC205 21 27',
    type: 'Lcc Fault',
    code: '4008',
    description: 'NO MODULE IN SLOT #7 - INSTALL CORRECT MODULE',
    priorityLevel: '-',
    priorityDesc: '-',
    counter: 1,
    delta: '-'
  },
  {
    number: 18,
    loco: 'CC205 11 06',
    type: 'Fire Fault',
    code: '331',
    description: 'Check Control Computer Breaker',
    priorityLevel: '3',
    priorityDesc: 'Unit Likely to Fail Soon',
    counter: 1,
    delta: '-'
  },
  {
    number: 19,
    loco: 'CC205 21 15',
    type: 'Lcc Fault',
    code: '4509',
    description: 'EMDEC - SENSOR READING TOO LOW WATER PRESSURE - ENGINE OUT',
    priorityLevel: '3',
    priorityDesc: 'Unit Likely to Fail Soon',
    counter: 1,
    delta: '0'
  },
  {
    number: 20,
    loco: 'CC205 13 08',
    type: 'Lcc Fault',
    code: '226',
    description: 'NO START - STARTER MOTOR ABUTMENT CONDITION, CHECK START FUSE',
    priorityLevel: '-',
    priorityDesc: '-',
    counter: 1,
    delta: '-'
  },
  {
  number: 21,
  loco: 'CC205 13 06',
  type: 'Lcc Fault',
  code: '765',
  description: 'TCC #1 TORQUE REDUCTION - WHEEL DIAMETER MISMATCH',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 22,
  loco: 'CC205 21 05',
  type: 'Fire Fault',
  code: '333',
  description: 'No communication to Fuel System - Check controlling Circuit Breaker',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 23,
  loco: 'CC205 21 16',
  type: 'Fire Fault',
  code: '310',
  description: 'LDARS communication was lost - Lead',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 24,
  loco: 'CC205 21 05',
  type: 'Lcc Fault',
  code: '4184',
  description: 'NO LOAD - POWER/DB CONFLICT CHECK JUMPER CABLE',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 25,
  loco: 'CC205 13 05',
  type: 'Lcc Fault',
  code: '4184',
  description: 'NO LOAD - POWER/DB CONFLICT CHECK JUMPER CABLE',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 26,
  loco: 'CC205 13 13',
  type: 'Fire Fault',
  code: '333',
  description: 'No communication to Fuel System - Check controlling Circuit Breaker',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 27,
  loco: 'CC205 21 36',
  type: 'Fire Fault',
  code: '245',
  description: 'LDARS health status Not OK',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 28,
  loco: 'CC205 21 22',
  type: 'Lcc Fault',
  code: '4506',
  description: 'EMDEC - BAD CIRCUIT OR COMPONENT WATER JACKET PRESSURE LB',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 29,
  loco: 'CC205 21 36',
  type: 'Fire Fault',
  code: '310',
  description: 'LDARS communication was lost - Lead',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 30,
  loco: 'CC205 13 13',
  type: 'Lcc Fault',
  code: '4248',
  description: 'REDUCED LOAD TRACTION MOTOR BLOWER LOCKOUT',
  priorityLevel: '3',
  priorityDesc: 'Unit Likely to Fail Soon',
  counter: 1,
  delta: '-'
},
{
  number: 31,
  loco: 'CC205 13 29',
  type: 'Lcc Fault',
  code: '3604',
  description: 'TCC #2 RESET - DC LINK OVERVOLTAGE',
  priorityLevel: '3',
  priorityDesc: 'Unit Likely to Fail Soon',
  counter: 1,
  delta: '-'
},
{
  number: 32,
  loco: 'CC205 21 13',
  type: 'Lcc Fault',
  code: '2066',
  description: 'B2 FAILED TO PICK UP',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 33,
  loco: 'CC205 21 14',
  type: 'Fire Fault',
  code: '310',
  description: 'LDARS communication was lost - Lead',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 34,
  loco: 'CC205 21 19',
  type: 'Lcc Fault',
  code: '4194',
  description: '#6 LOCKED WHEEL DETECTION DISABLED MANUALLY DISABLED THROUGH DISPLAY',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 35,
  loco: 'CC205 13 29',
  type: 'Lcc Fault',
  code: '3603',
  description: 'TCC #1 RESET - DC LINK OVERVOLTAGE',
  priorityLevel: '3',
  priorityDesc: 'Unit Likely to Fail Soon',
  counter: 1,
  delta: '-'
},
{
  number: 36,
  loco: 'CC205 21 26',
  type: 'Lcc Fault',
  code: '6041',
  description: 'EMDEC - SENSOR ABNORMAL RESPONSE WATER PRESSURE - ENGINE OUT',
  priorityLevel: '3',
  priorityDesc: 'Unit Likely to Fail Soon',
  counter: 1,
  delta: '-'
},
{
  number: 37,
  loco: 'CC205 13 14',
  type: 'Fire Fault',
  code: '333',
  description: 'No communication to Fuel System - Check controlling Circuit Breaker',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 38,
  loco: 'CC205 21 14',
  type: 'Lcc Fault',
  code: '6041',
  description: 'EMDEC - SENSOR ABNORMAL RESPONSE WATER PRESSURE - ENGINE OUT',
  priorityLevel: '3',
  priorityDesc: 'Unit Likely to Fail Soon',
  counter: 1,
  delta: '-1'
},
{
  number: 39,
  loco: 'CC205 13 23',
  type: 'Predictive Fault',
  code: '2312',
  description: 'FRL Radar vs GPS',
  priorityLevel: '3',
  priorityDesc: 'Unit Likely to Fail Soon',
  counter: 1,
  delta: '0'
},
{
  number: 40,
  loco: 'CC205 13 32',
  type: 'Predictive Fault',
  code: '2312',
  description: 'FRL Radar vs GPS',
  priorityLevel: '3',
  priorityDesc: 'Unit Likely to Fail Soon',
  counter: 1,
  delta: '-'
},
{
  number: 41,
  loco: 'CC205 21 28',
  type: 'Fire Fault',
  code: '246',
  description: 'LDARS communication was lost',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 42,
  loco: 'CC205 21 04',
  type: 'Fire Fault',
  code: '310',
  description: 'LDARS communication was lost - Lead',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 43,
  loco: 'CC205 21 17',
  type: 'Fire Fault',
  code: '310',
  description: 'LDARS communication was lost - Lead',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 44,
  loco: 'CC205 13 43',
  type: 'Predictive Fault',
  code: '2218',
  description: 'Airbox Temp Greater than Oil Temp',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 45,
  loco: 'CC205 13 42',
  type: 'Fire Fault',
  code: '331',
  description: 'Check Control Computer Breaker',
  priorityLevel: '3',
  priorityDesc: 'Unit Likely to Fail Soon',
  counter: 1,
  delta: '-'
},
{
  number: 46,
  loco: 'CC205 11 03',
  type: 'Lcc Fault',
  code: '226',
  description: 'NO START - STARTER MOTOR ABUTMENT CONDITION, CHECK START FUSE',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 47,
  loco: 'CC205 21 11',
  type: 'Lcc Fault',
  code: '6041',
  description: 'EMDEC - SENSOR ABNORMAL RESPONSE WATER PRESSURE - ENGINE OUT',
  priorityLevel: '3',
  priorityDesc: 'Unit Likely to Fail Soon',
  counter: 1,
  delta: '-'
},
{
  number: 48,
  loco: 'CC205 21 08',
  type: 'Fire Fault',
  code: '246',
  description: 'LDARS communication was lost',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 49,
  loco: 'CC205 13 42',
  type: 'Fire Fault',
  code: '344',
  description: 'No communication between LCC and CLC',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 50,
  loco: 'CC205 13 42',
  type: 'Fire Fault',
  code: '311',
  description: 'No communication with LIG',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 51,
  loco: 'CC205 21 26',
  type: 'Lcc Fault',
  code: '4509',
  description: 'EMDEC - SENSOR READING TOO LOW WATER PRESSURE - ENGINE OUT',
  priorityLevel: '3',
  priorityDesc: 'Unit Likely to Fail Soon',
  counter: 1,
  delta: '-'
},
{
  number: 52,
  loco: 'CC205 21 07',
  type: 'Fire Fault',
  code: '310',
  description: 'LDARS communication was lost - Lead',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 53,
  loco: 'CC205 13 42',
  type: 'Fire Fault',
  code: '333',
  description: 'No communication to Fuel System - Check controlling Circuit Breaker',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
},
{
  number: 54,
  loco: 'CC205 13 36',
  type: 'Fire Fault',
  code: '333',
  description: 'No communication to Fuel System - Check controlling Circuit Breaker',
  priorityLevel: '-',
  priorityDesc: '-',
  counter: 1,
  delta: '-'
}
];

// === ParetoChart Komponen (langsung dari instruksi user) ===
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  ReferenceLine,
  Legend,
} from "recharts";

const rawData = [
  { label: "LDARS communication", count: 661 },
  { label: "NO LOAD - MG FIELD SU", count: 356 },
  { label: "No communication to F", count: 321 },
  { label: "LDARS health status No", count: 296 },
  { label: "Control Computer stopp", count: 190 },
  { label: "EMDEC - SENSOR READI", count: 126 },
  { label: "LDARS communication", count: 124 },
  { label: "Check Control Compute", count: 93 },
  { label: "EMDEC - SENSOR ABNO", count: 82 },
  { label: "FAILED AFTERCOOLER", count: 76 },
  { label: "Unbalanced AC current", count: 53 },
  { label: "FAILED FEEDBACK - TP", count: 53 },
  { label: "TCC #1 RESET - IGBT M", count: 46 },
  { label: "NO LOAD - POWER/DB...", count: 43 },
  { label: "FAILED FEEDBACK - RA", count: 26 },
  { label: "NO START - STARTER M", count: 26 },
  { label: "CLOGGED FUEL FILTERS", count: 21 },
  { label: "#4 LOCKED WHEEL DET", count: 20 },
  { label: "TCC #2 INTERNAL RESE", count: 18 },
  { label: "COMPUTER TURNED OF", count: 17 },
  { label: "GPS Signal Invalid", count: 17 },
  { label: "LOW TURBO SPEED DET", count: 16 },
  { label: "FRL Radar vs GPS", count: 16 },
  { label: "NO LOAD - REVERSER DI", count: 13 },
  { label: "TCC #2 RESET - DC LIN", count: 12 },
  { label: "No communication betw", count: 11 },
  { label: "FAILED FEEDBACK - END", count: 11 },
  { label: "REDUCED LOAD - BC", count: 11 },
  { label: "COMPUTER TURNED OF", count: 11 },
];

// Step 1: calculate cumulative % data
const total = rawData.reduce((sum, item) => sum + item.count, 0);

const dataWithCumulative = rawData.map((item, index) => {
  const prevSum = rawData.slice(0, index).reduce((sum, i) => sum + i.count, 0);
  const cumulative = (prevSum + item.count) / total;
  return {
    ...item,
    cumulativePercent: +(cumulative * 100).toFixed(2),
  };
});

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const bar = payload.find((p) => p.dataKey === "count");
    const line = payload.find((p) => p.dataKey === "cumulativePercent");
    return (
      <div style={{ background: "white", padding: 10, border: "1px solid #ccc" }}>
        <p><strong>{bar?.payload?.label}</strong></p>
        <p>Total Count: {bar?.value}</p>
        <p>Cumulative: {line?.value}%</p>
      </div>
    );
  }
  return null;
};

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';



function ParetoChart({ data }) {
  // Dummy data untuk contoh, ganti dengan data aktual jika perlu
  // Group by description and sum counters
  const grouped = data.reduce((acc, row) => {
    if (!acc[row.description]) {
      acc[row.description] = { label: row.description, count: 0 };
    }
    acc[row.description].count += row.counter ? Number(row.counter) : 1;
    return acc;
  }, {});
  const rawData = Object.values(grouped).sort((a, b) => b.count - a.count);
  // Hitung cumulative percent
  const total = rawData.reduce((sum, d) => sum + d.count, 0);
  let cumulative = 0;
  const chartData = rawData.map((d) => {
    cumulative += d.count;
    return {
      ...d,
      cumulativePercent: ((cumulative / total) * 100).toFixed(1),
    };
  });

  return (
    <Card sx={{ mt: 3, mb: 3, boxShadow: 2, borderRadius: 2, overflow: 'visible', maxWidth: '100%' }}>
      <CardContent sx={{ pb: 2 }}>
        <Box display="flex" flexDirection="column" alignItems="flex-start" mb={1}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            PARETO CHART
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
            * note : untuk pilihan spesifik bisa klik konten yg ada pada tabel maupun chart, atau gunakan tab 'period & filters'
          </Typography>
        </Box>
        {/* Scrollable Pareto Chart Area */}
        <Box sx={{ width: '100%', maxHeight: 700, overflowX: 'auto', overflowY: 'auto', p: 0, mt: 0, display: 'block' }}>
          <Box sx={{ minWidth: { xs: 600, sm: 900, md: 1200 }, width: '100%' }}>
            <ResponsiveContainer width="100%" height={window.innerWidth < 600 ? 320 : 500}>
              <BarChart
              data={chartData}
              margin={{ top: 30, right: 50, left: 25, bottom: 80 }}
              barCategoryGap={"10%"}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                angle={-45}
                textAnchor="end"
                height={90}
                interval={0}
                tick={{ fontSize: 13, fontWeight: 500 }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 13 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 13 }}
              />
              <Tooltip
                contentStyle={{ fontSize: 13 }}
                formatter={(value, name) => name === 'cumulativePercent' ? `${value}%` : value}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ top: 0, right: 30, fontWeight: 700, fontSize: 13 }}
              />
              <ReferenceLine
                yAxisId="right"
                y={80}
                label={{ value: '80%', position: 'right', fill: '#222', fontWeight: 700, fontSize: 13 }}
                stroke="#616161"
                strokeDasharray="5 5"
              />
              <Bar
                yAxisId="left"
                dataKey="count"
                fill="#b71c1c"
                name="Total Count"
                label={{ position: "top", fill: "black", fontSize: 12, fontWeight: 700 }}
                maxBarSize={32}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulativePercent"
                stroke="#6a1b9a"
                strokeWidth={3}
                dot={{ r: 3, stroke: '#6a1b9a', fill: '#fff', strokeWidth: 2 }}
                name="Cumulative"
                activeDot={{ r: 5 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
      </CardContent>
    </Card>
  );
}





export default function FaultHistory() {
  // ...existing state
  const [data, setData] = useState(dummyData);

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
            setData(results.data);
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
        setData(json);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('File type not supported. Please upload a CSV, XLSX, or XLS file.');
    }
  };

  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [includeToday, setIncludeToday] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedLocos, setSelectedLocos] = useState([]);
  const [selectedFaultTypes, setSelectedFaultTypes] = useState([]);
  const [selectedFaultCodes, setSelectedFaultCodes] = useState([]);
  const [selectedPriorityLevels, setSelectedPriorityLevels] = useState([]);

  const uniqueLocos = [...new Set(data.map((item) => item.loco))];
  const uniqueFaultTypes = [...new Set(data.map((item) => item.type))];
  const uniqueFaultCodes = [...new Set(data.map((item) => item.code))];
  const uniquePriorityLevels = [...new Set(data.map((item) => item.priorityLevel?.toString() || 'null'))];

  const faultCodeCounts = uniqueFaultCodes.map(code => {
    const count = data.filter(item => item.code === code).length;
    return { code, count };
  });

  const priorityLevelCounts = uniquePriorityLevels.map(level => {
    const count = data.filter(item => (item.priorityLevel?.toString() || 'null') === level).length;
    return { level, count };
  });

  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handlePresetSelect = (preset) => {
    const today = new Date();
    let start, end;

    switch (preset) {
      case 'Today':
        start = today;
        end = today;
        break;
      case 'Yesterday':
        start = subDays(today, 1);
        end = subDays(today, 1);
        break;
      case 'Last 7 Days':
        start = subDays(today, 6);
        end = includeToday ? today : subDays(today, 1);
        break;
      case 'This Month':
        start = startOfMonth(today);
        end = endOfMonth(today);
        break;
      case 'Last Month':
        const lastMonth = subDays(startOfMonth(today), 1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        break;
      default:
        break;
    }

    setStartDate(start);
    setEndDate(end);
    handleClose();
  };

  const handleLocoChange = (event) => {
    const value = event.target.value;
    setSelectedLocos(typeof value === 'string' ? value.split(',') : value);
  };

  const handleFaultTypeChange = (event) => {
    const value = event.target.value;
    setSelectedFaultTypes(typeof value === 'string' ? value.split(',') : value);
  };

  const handleFaultCodeChange = (event) => {
    const value = event.target.value;
    setSelectedFaultCodes(typeof value === 'string' ? value.split(',') : value);
  };

  const handlePriorityLevelChange = (event) => {
    const value = event.target.value;
    setSelectedPriorityLevels(typeof value === 'string' ? value.split(',') : value);
  };

  const filteredData = data.filter((row) => {
    const matchLoco = selectedLocos.length === 0 || selectedLocos.includes(row.loco);
    const matchType = selectedFaultTypes.length === 0 || selectedFaultTypes.includes(row.type);
    const matchCode = selectedFaultCodes.length === 0 || selectedFaultCodes.includes(row.code);
    const matchPriority = selectedPriorityLevels.length === 0 || selectedPriorityLevels.includes(row.priorityLevel?.toString() || 'null');
    return matchLoco && matchType && matchCode && matchPriority;
  });

  return (
    <Box p={3} position="relative">
      {/* Pareto Chart dari instruksi user */}
      <ParetoChart data={filteredData} />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', mb: 2, gap: 2 }}>
        {/* Filter by Date */}
        <FormControl sx={{ flex: 1, minWidth: 180, maxWidth: 240, height: 56, mr: 2 }}>
          <InputLabel id="date-filter-label">Filter by Date</InputLabel>
          <Select
            labelId="date-filter-label"
            value="custom"
            label="Filter by Date"
            open={showFilter}
            onClose={() => setShowFilter(false)}
            onOpen={() => setShowFilter(true)}
            renderValue={() => `${startDate ? format(startDate, 'dd MMM yyyy') : '-'} - ${endDate ? format(endDate, 'dd MMM yyyy') : '-'}`}
            MenuProps={{
              PaperProps: { sx: { p: 2, minWidth: 260 } }
            }}
          >
            <MenuItem disableRipple>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeToday}
                    onChange={(e) => setIncludeToday(e.target.checked)}
                  />
                }
                label="Include today"
                sx={{ mb: 1 }}
              />
    </MenuItem>
    <MenuItem disableRipple>
      <Box mb={1} width="100%">
        <Typography variant="subtitle2" mb={1}>Start Date</Typography>
        <DatePicker
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          format="dd MMMM yyyy"
          slotProps={{
            textField: {
              size: 'medium',
              sx: { backgroundColor: '#fff', borderRadius: 1, width: '100%' },
            },
          }}
        />
      </Box>
    </MenuItem>
    <MenuItem disableRipple>
      <Box mb={1} width="100%">
        <Typography variant="subtitle2" mb={1}>End Date</Typography>
        <DatePicker
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          format="dd MMMM yyyy"
          slotProps={{
            textField: {
              size: 'medium',
              sx: { backgroundColor: '#fff', borderRadius: 1, width: '100%' },
            },
          }}
        />
      </Box>
    </MenuItem>
    <MenuItem disableRipple>
      <Typography variant="body2" sx={{ color: '#1976d2', textAlign: 'center', fontWeight: 'bold', mt: 2 }}>
        Range: {startDate ? format(startDate, 'dd MMMM yyyy') : '-'} - {endDate ? format(endDate, 'dd MMMM yyyy') : '-'}
      </Typography>
    </MenuItem>
  </Select>
</FormControl>
  {/* Locomotive Number Filter */}
  {/* Locomotive Number */}
  <FormControl sx={{ flex: 1, minWidth: 180, maxWidth: 240, height: 56, mr: 2 }}>
    <InputLabel id="loco-filter-label">Locomotive Number</InputLabel>
    <Select
      labelId="loco-filter-label"
      multiple
      value={selectedLocos}
      onChange={handleLocoChange}
      input={<OutlinedInput label="Locomotive Number" />}
      renderValue={(selected) =>
  selected.length === 0
    ? ''
    : selected.length === 1
      ? selected[0]
      : `${selected.length} dipilih`
}
      sx={{ height: 56, display: 'flex', alignItems: 'center' }}
    >
      {uniqueLocos.map((loco) => (
        <MenuItem key={loco} value={loco}>
          <Checkbox checked={selectedLocos.indexOf(loco) > -1} />
          <ListItemText primary={loco} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  {/* Fault Type */}
  <FormControl sx={{ flex: 1, minWidth: 180, maxWidth: 240, height: 56, mr: 2 }}>
    <InputLabel id="fault-type-filter-label">Fault Type</InputLabel>
    <Select
      labelId="fault-type-filter-label"
      multiple
      value={selectedFaultTypes}
      onChange={handleFaultTypeChange}
      input={<OutlinedInput label="Fault Type" />}
      renderValue={(selected) =>
  selected.length === 0
    ? ''
    : selected.length === 1
      ? selected[0]
      : `${selected.length} dipilih`
}
      sx={{ height: 56, display: 'flex', alignItems: 'center' }}
    >
      {uniqueFaultTypes.map((type) => {
        const count = data.filter((row) => row.type === type).length;
        return (
          <MenuItem key={type} value={type}>
            <Checkbox checked={selectedFaultTypes.indexOf(type) > -1} />
            <ListItemText primary={`${type} (${count})`} />
          </MenuItem>
        );
      })}
    </Select>
  </FormControl>

  {/* Fault Code */}
  <FormControl sx={{ flex: 1, minWidth: 180, maxWidth: 240, height: 56, mr: 2 }}>
    <InputLabel id="fault-code-filter-label">Fault Code</InputLabel>
    <Select
      labelId="fault-code-filter-label"
      multiple
      value={selectedFaultCodes}
      onChange={handleFaultCodeChange}
      input={<OutlinedInput label="Fault Code" />}
      renderValue={(selected) =>
  selected.length === 0
    ? ''
    : selected.length === 1
      ? selected[0]
      : `${selected.length} dipilih`
}
      sx={{ height: 56, display: 'flex', alignItems: 'center' }}
    >
      {faultCodeCounts.map(({ code, count }) => (
        <MenuItem key={code} value={code}>
          <Checkbox checked={selectedFaultCodes.indexOf(code) > -1} />
          <ListItemText primary={`${code} (${count})`} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  {/* Priority Level */}
  <FormControl sx={{ flex: 1, minWidth: 180, maxWidth: 240, height: 56, mr: 2 }}>
    <InputLabel id="priority-level-filter-label">Priority Level</InputLabel>
    <Select
      labelId="priority-level-filter-label"
      multiple
      value={selectedPriorityLevels}
      onChange={handlePriorityLevelChange}
      input={<OutlinedInput label="Priority Level" />}
      renderValue={(selected) =>
  selected.length === 0
    ? ''
    : selected.length === 1
      ? selected[0]
      : `${selected.length} dipilih`
}
      sx={{ height: 56, display: 'flex', alignItems: 'center' }}
    >
      {priorityLevelCounts.map(({ level, count }) => (
        <MenuItem key={level} value={level}>
          <Checkbox checked={selectedPriorityLevels.indexOf(level) > -1} />
          <ListItemText primary={`${level} (${count})`} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Box>




      {/* Import Button Area */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
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

      <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#2563eb !important' }}>
              {[
                'No',
                'Locomotive Number',
                'Fault Type',
                'Fault Code',
                'Fault Description',
                'Priority Level',
                'Priority Description',
                'Counter',
                'Δ',
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    color: '#fff',
                    fontWeight: 'bold',
                    backgroundColor: '#2563eb !important',
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.number} hover>
                <TableCell>{row.number}</TableCell>
                <TableCell>{row.loco}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.code}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell align="center">{row.priorityLevel}</TableCell>
                <TableCell>{row.priorityDesc}</TableCell>
                <TableCell align="center">{row.counter}</TableCell>
                <TableCell align="center">{row.delta}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

