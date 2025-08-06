// controllers/faultHistoryController.js
const FaultHistory = require('../models/FaultHistory');
const Locomotive = require('../models/Locomotive');

class FaultHistoryController {
  // GET /api/fault-history - Get fault history with filters and pagination
  static async getFaultHistory(req, res) {
    try {
      const {
        startDate,
        endDate,
        locomotiveId,
        faultType,
        faultCode,
        page = 1,
        limit = 50
      } = req.query;

      // Validation
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Missing required parameters: startDate, endDate'
        });
      }

      const filters = {
        startDate,
        endDate,
        locomotiveId: locomotiveId ? parseInt(locomotiveId) : null,
        faultType,
        faultCode: faultCode ? parseInt(faultCode) : null,
        page: parseInt(page),
        limit: parseInt(limit)
      };

      const result = await FaultHistory.getAll(filters);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });

    } catch (error) {
      console.error('Error fetching fault history:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/fault-history/summary - Get summary counters for filtering
  static async getSummaryCounters(req, res) {
    try {
      const {
        startDate,
        endDate,
        locomotiveId,
        faultType,
        faultCode
      } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Missing required parameters: startDate, endDate'
        });
      }

      const filters = {
        startDate,
        endDate,
        locomotiveId: locomotiveId ? parseInt(locomotiveId) : null,
        faultType,
        faultCode: faultCode ? parseInt(faultCode) : null
      };

      const summary = await FaultHistory.getSummaryCounters(filters);

      res.json({
        success: true,
        data: summary
      });

    } catch (error) {
      console.error('Error fetching summary:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /api/fault-history/import - Import CSV
  static async importCSV(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No CSV file uploaded'
        });
      }

      const csvText = req.file.buffer.toString('utf8');
      const result = await FaultHistoryController.processCSVData(csvText);

      res.json({
        success: true,
        message: 'CSV imported successfully',
        stats: result
      });

    } catch (error) {
      console.error('Error importing CSV:', error);
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
    
    // Enhanced Column mapping CSV → Database (handle PT KAI template)
    const COLUMN_MAPPING = {
      // Primary mappings
      'Locomotive Number': 'locomotive_number',
      'Date Occurred': 'date_occurred',
      'Fault Type': 'fault_type',
      'Fault Code': 'fault_code',
      'Description': 'fault_description',
      'Priority Level': 'priority_level',
      'Priority Description': 'priority_description',
      
      // Alternative column names (fallbacks)
      'Locomotive': 'locomotive_number',
      'Loco Number': 'locomotive_number',
      'Unit #': 'locomotive_number', // Alternative for locomotive number
      'Fault Description': 'fault_description',
      'Type': 'fault_type', // Fallback for fault type
      'Priority': 'priority_level',
      'Priority Desc': 'priority_description',
      'Desc': 'fault_description',
      
      // Optional columns  
      'Delta': 'delta',
      'Status Change DateTime': 'status_change_datetime', // We'll ignore but map for completeness
    };

    // Find required columns in headers
    const columnIndexes = {};
    Object.keys(COLUMN_MAPPING).forEach(csvColumn => {
      const index = headers.findIndex(header => 
        header.toLowerCase().trim() === csvColumn.toLowerCase().trim()
      );
      if (index !== -1) {
        columnIndexes[COLUMN_MAPPING[csvColumn]] = index;
      }
    });

    // Validate required columns exist
    const requiredColumns = ['locomotive_number', 'date_occurred', 'fault_type', 'fault_code'];
    const missingColumns = requiredColumns.filter(col => columnIndexes[col] === undefined);
    
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}. Available columns: ${headers.join(', ')}`);
    }

    console.log(`📊 CSV Analysis:`);
    console.log(`   Total columns: ${headers.length}`);
    console.log(`   Mapped columns: ${Object.keys(columnIndexes).length}`);
    console.log(`   Column mapping:`, columnIndexes);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    // Process all data rows
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(separator).map(v => v.trim().replace(/"/g, '').replace(/\r/g, ''));
        
        // Extract required fields using column indexes
        const locomotiveNumber = values[columnIndexes['locomotive_number']] || '';
        const dateOccurred = values[columnIndexes['date_occurred']] || '';
        const faultType = values[columnIndexes['fault_type']] || '';
        const faultCode = values[columnIndexes['fault_code']] || '';

        // Validate required fields
        if (!locomotiveNumber || !dateOccurred || !faultType || !faultCode) {
          throw new Error(`Missing required data: locomotive_number="${locomotiveNumber}", date_occurred="${dateOccurred}", fault_type="${faultType}", fault_code="${faultCode}"`);
        }

        // Get or create locomotive
        const locomotive = await Locomotive.getOrCreate(locomotiveNumber);

        // Parse date
        const parsedDate = FaultHistoryController.parseDate(dateOccurred);
        if (!parsedDate) {
          throw new Error(`Invalid date format: ${dateOccurred}`);
        }

        // Extract optional fields
        const faultDescription = values[columnIndexes['fault_description']] || '';
        const priorityLevel = parseInt(values[columnIndexes['priority_level']]) || 1;
        const priorityDescription = values[columnIndexes['priority_description']] || '';
        const delta = columnIndexes['delta'] !== undefined ? 
          (values[columnIndexes['delta']] ? parseInt(values[columnIndexes['delta']]) : null) : null;

        // Prepare fault data
        const faultData = {
          locomotiveId: locomotive.id,
          dateOccurred: parsedDate,
          faultType: faultType,
          faultCode: parseInt(faultCode),
          faultDescription: faultDescription,
          priorityLevel: priorityLevel,
          priorityDescription: priorityDescription,
          delta: delta
        };

        // Insert to database (counter will be calculated automatically)
        await FaultHistory.create(faultData);
        successCount++;

        console.log(`✅ Imported row ${i}: ${locomotiveNumber} - Fault ${faultCode} on ${dateOccurred}`);

      } catch (error) {
        errorCount++;
        errors.push(`Row ${i + 1}: ${error.message}`);
        console.error(`❌ Error row ${i + 1}:`, error.message);
      }
    }

    console.log(`📊 Fault History Import completed: ${successCount} success, ${errorCount} errors`);

    return {
      total_rows: lines.length - 1,
      success_count: successCount,
      error_count: errorCount,
      errors: errors.slice(0, 10), // Show first 10 errors only
      column_analysis: {
        total_columns: headers.length,
        mapped_columns: Object.keys(columnIndexes).length,
        available_columns: headers,
        mapped_fields: columnIndexes
      }
    };
  }

  // Helper method to parse different date formats (Enhanced for PT KAI)
  static parseDate(dateString) {
    if (!dateString) return null;
    
    // Remove any extra whitespace
    dateString = dateString.trim();
    
    console.log(`🔍 Parsing date: "${dateString}"`);
    
    try {
      // Handle different date formats common in PT KAI data
      
      // Format 1: DD/MM/YYYY HH:MM (PT KAI common format)
      const ddmmyyyyHHMM = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2})$/);
      if (ddmmyyyyHHMM) {
        const [, day, month, year, hour, minute] = ddmmyyyyHHMM;
        const date = new Date(year, month - 1, day, hour, minute);
        if (!isNaN(date.getTime())) {
          console.log(`✅ Parsed DD/MM/YYYY HH:MM: ${date.toISOString().split('T')[0]}`);
          return date.toISOString().split('T')[0];
        }
      }
      
      // Format 2: DD/MM/YYYY (date only)
      const ddmmyyyy = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (ddmmyyyy) {
        const [, day, month, year] = ddmmyyyy;
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) {
          console.log(`✅ Parsed DD/MM/YYYY: ${date.toISOString().split('T')[0]}`);
          return date.toISOString().split('T')[0];
        }
      }
      
      // Format 3: YYYY-MM-DD HH:MM:SS (ISO with time)
      const isoWithTime = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
      if (isoWithTime) {
        const [, year, month, day] = isoWithTime;
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) {
          console.log(`✅ Parsed ISO with time: ${date.toISOString().split('T')[0]}`);
          return date.toISOString().split('T')[0];
        }
      }
      
      // Format 4: YYYY-MM-DD (ISO date)
      const isoDate = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (isoDate) {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          console.log(`✅ Parsed ISO date: ${date.toISOString().split('T')[0]}`);
          return date.toISOString().split('T')[0];
        }
      }
      
      // Format 5: MM/DD/YYYY HH:MM (US format with time)
      const mmddyyyyHHMM = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2})$/);
      if (mmddyyyyHHMM) {
        const [, month, day, year, hour, minute] = mmddyyyyHHMM;
        // Only try this if day > 12 (to avoid DD/MM confusion)
        if (parseInt(day) > 12) {
          const date = new Date(year, month - 1, day, hour, minute);
          if (!isNaN(date.getTime())) {
            console.log(`✅ Parsed MM/DD/YYYY HH:MM: ${date.toISOString().split('T')[0]}`);
            return date.toISOString().split('T')[0];
          }
        }
      }
      
      // Format 6: MM/DD/YYYY (US format)
      const mmddyyyy = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (mmddyyyy) {
        const [, month, day, year] = mmddyyyy;
        // Only try this if day > 12 (to avoid DD/MM confusion)
        if (parseInt(day) > 12) {
          const date = new Date(year, month - 1, day);
          if (!isNaN(date.getTime())) {
            console.log(`✅ Parsed MM/DD/YYYY: ${date.toISOString().split('T')[0]}`);
            return date.toISOString().split('T')[0];
          }
        }
      }
      
      // Format 7: DD-MM-YYYY with various separators
      const ddmmyyyyDash = dateString.match(/^(\d{1,2})[-.](\d{1,2})[-.](\d{4})$/);
      if (ddmmyyyyDash) {
        const [, day, month, year] = ddmmyyyyDash;
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) {
          console.log(`✅ Parsed DD-MM-YYYY: ${date.toISOString().split('T')[0]}`);
          return date.toISOString().split('T')[0];
        }
      }
      
      // Format 8: Try native Date parsing as last resort
      const nativeDate = new Date(dateString);
      if (!isNaN(nativeDate.getTime())) {
        console.log(`✅ Parsed native: ${nativeDate.toISOString().split('T')[0]}`);
        return nativeDate.toISOString().split('T')[0];
      }
      
    } catch (error) {
      console.error(`❌ Date parsing error for "${dateString}":`, error.message);
    }
    
    console.error(`❌ Failed to parse date: "${dateString}"`);
    return null;
  }

  // GET /api/fault-history/locomotives - Get locomotives for dropdown
  static async getLocomotives(req, res) {
    try {
      const locomotives = await Locomotive.findAll();

      res.json({
        success: true,
        data: locomotives
      });

    } catch (error) {
      console.error('Error fetching locomotives:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/fault-history/fault-types - Get distinct fault types
  static async getFaultTypes(req, res) {
    try {
      const faultTypes = await FaultHistory.getDistinctFaultTypes();

      res.json({
        success: true,
        data: faultTypes
      });

    } catch (error) {
      console.error('Error fetching fault types:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/fault-history/fault-codes - Get distinct fault codes
  static async getFaultCodes(req, res) {
    try {
      const faultCodes = await FaultHistory.getDistinctFaultCodes();

      res.json({
        success: true,
        data: faultCodes
      });

    } catch (error) {
      console.error('Error fetching fault codes:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = FaultHistoryController;