// controllers/performanceController.js - Updated with CSV import
const Performance = require('../models/Performance');
const Locomotive = require('../models/Locomotive');

class PerformanceController {
  static parseTimestamp(timestamp) {
    try {
      // Handle DD/MM/YYYY HH:MM format
      const [datePart, timePart] = timestamp.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hour, minute] = timePart.split(':');
      
      // Create proper Date object
      const date = new Date(
        parseInt(year), 
        parseInt(month) - 1, // Month is 0-based
        parseInt(day), 
        parseInt(hour), 
        parseInt(minute || '0')
      );
      
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date components`);
      }
      
      return date;
    } catch (error) {
      throw new Error(`Cannot parse timestamp "${timestamp}": ${error.message}`);
    }
  }

  static async getChartData(req, res) {
    try {
      const { column, locomotive_ids, start_date, end_date } = req.query;

      // Validation
      if (!column || !locomotive_ids || !start_date || !end_date) {
        return res.status(400).json({
          success: false,
          message: 'Missing required parameters: column, locomotive_ids, start_date, end_date'
        });
      }

      // Parse locomotive_ids from string to array of integers
      const locomotiveIds = locomotive_ids.split(',').map(id => parseInt(id.trim()));

      // Validate column exists
      const availableColumns = Performance.getAvailableColumns();
      if (!availableColumns[column]) {
        return res.status(400).json({
          success: false,
          message: `Invalid column: ${column}`
        });
      }

      // Get chart data
      const data = await Performance.getChartData(column, locomotiveIds, start_date, end_date);

      // Group data by locomotive
      const groupedData = {};
      data.forEach(row => {
        const key = `locomotive_${row.locomotive_number}`;
        if (!groupedData[key]) {
          groupedData[key] = {
            locomotive_id: row.locomotive_id,
            locomotive_number: row.locomotive_number,
            locomotive_series: row.locomotive_series,
            data: []
          };
        }
        groupedData[key].data.push({
          timestamp: row.recorded_at,
          value: parseFloat(row.value)
        });
      });

      res.json({
        success: true,
        column: column,
        column_info: availableColumns[column],
        data: groupedData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getAvailableColumns(req, res) {
    try {
      const columns = Performance.getAvailableColumns();
      
      res.json({
        success: true,
        data: columns
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // NEW: CSV Import functionality
  static async importCSV(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No CSV file uploaded'
        });
      }

      const csvText = req.file.buffer.toString('utf8');
      const result = await PerformanceController.processCSVData(csvText);

      res.json({
        success: true,
        message: 'CSV imported successfully',
        stats: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // CSV Processing Logic
  static async processCSVData(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    
    // Auto-detect separator
    let separator = ',';
    if (lines[0].includes(';') && lines[0].split(';').length > lines[0].split(',').length) {
      separator = ';';
    } else if (lines[0].includes('\t')) {
      separator = '\t';
    }
    
    const headers = lines[0].split(separator).map(h => h.trim().replace(/"/g, '').replace(/\r/g, ''));
    
    // Column mapping CSV → Database
    const COLUMN_MAPPING = {
      'Locomotive Number': 'locomotive_number',
      'Time Stamp': 'recorded_at',
      'CA V': 'ca_v',
      'EEngRPM': 'eengrpm',
      'EgOilTF': 'egoiltf',
      'EngTmpF': 'engtmpf',
      'APCcLb': 'apcclb',
      'APImRbP': 'apimrb',
      'ATImRbF': 'atimrbf',
      'AWTF': 'awt',
      'OPTuRPS': 'opturps',
      'TPU RPM': 'tpu_rpm',
      'WPEgILP': 'wpegilp',
      'WPEgOtP': 'wpegotp'
    };
  
    const PERFORMANCE_COLUMNS = ['ca_v', 'eengrpm', 'egoiltf', 'engtmpf', 'apcclb', 'apimrb', 'atimrbf', 'awt', 'opturps', 'tpu_rpm', 'wpegilp', 'wpegotp'];
  
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
  
    // Process ALL data rows (not just first 3)
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(separator).map(v => v.trim().replace(/"/g, '').replace(/\r/g, ''));
        const row = {};
        
        // Map CSV values to object
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
  
        // Extract required fields
        const locomotiveNumber = row['Locomotive Number'];
        const timestamp = row['Time Stamp'];
  
        if (!locomotiveNumber || !timestamp) {
          throw new Error(`Missing locomotive number or timestamp`);
        }
  
        // Get or create locomotive
        const locomotive = await Locomotive.getOrCreate(locomotiveNumber);
  
        // Prepare performance data
        const performanceData = {
          locomotive_id: locomotive.id,
          recorded_at: PerformanceController.parseTimestamp(timestamp)
        };
  
        // Map performance columns
        PERFORMANCE_COLUMNS.forEach(dbColumn => {
          const csvColumn = Object.keys(COLUMN_MAPPING).find(key => COLUMN_MAPPING[key] === dbColumn);
          if (csvColumn && row[csvColumn]) {
            const value = parseFloat(row[csvColumn]);
            performanceData[dbColumn] = isNaN(value) ? null : value;
          } else {
            performanceData[dbColumn] = null;
          }
        });
  
        // Insert to database
        await Performance.insertRecord(performanceData);
        successCount++;
  
        console.log(`✅ Imported row ${i}: ${locomotiveNumber} at ${timestamp}`);
  
      } catch (error) {
        errorCount++;
        errors.push(`Row ${i + 1}: ${error.message}`);
        console.error(`❌ Error row ${i + 1}:`, error.message);
      }
    }
  
    console.log(`📊 Import completed: ${successCount} success, ${errorCount} errors`);
  
    return {
      total_rows: lines.length - 1,
      success_count: successCount,
      error_count: errorCount,
      errors: errors.slice(0, 10)
    };
  }  
}

module.exports = PerformanceController;