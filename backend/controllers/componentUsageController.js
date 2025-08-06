// controllers/componentUsageController.js
const ComponentUsage = require('../models/ComponentUsage');

class ComponentUsageController {
  // GET /api/component-usage - Get component usage with filters and pagination
  static async getComponentUsage(req, res) {
    try {
      const {
        startDate,
        endDate,
        locomotive,
        partNo,
        maintenanceType,
        depoLocation,
        year,
        month,
        page = 1,
        limit = 50
      } = req.query;

      const filters = {
        startDate,
        endDate,
        locomotive,
        partNo,
        maintenanceType,
        depoLocation,
        year,
        month,
        page: parseInt(page),
        limit: parseInt(limit)
      };

      const result = await ComponentUsage.getAll(filters);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });

    } catch (error) {
      console.error('Error fetching component usage:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/component-usage/summary - Get summary counters for filtering
  static async getSummaryCounters(req, res) {
    try {
      const {
        startDate,
        endDate,
        locomotive,
        partNo,
        maintenanceType,
        depoLocation,
        year,
        month
      } = req.query;

      const filters = {
        startDate,
        endDate,
        locomotive,
        partNo,
        maintenanceType,
        depoLocation,
        year,
        month
      };

      const summary = await ComponentUsage.getSummaryCounters(filters);

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

  // GET /api/component-usage/analytics - Get analytics data
  static async getAnalytics(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const filters = { startDate, endDate };
      const analytics = await ComponentUsage.getAnalytics(filters);

      res.json({
        success: true,
        data: analytics
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /api/component-usage/import - Import CSV
  static async importCSV(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No CSV file uploaded'
        });
      }

      const csvText = req.file.buffer.toString('utf8');
      const result = await ComponentUsageController.processCSVData(csvText);

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
    
    // Column mapping CSV → Database
    const COLUMN_MAPPING = {
      // Primary mappings
      'LOCOMOTIVE': 'seri_lokomotif',
      'INVOICE DATE': 'invoice_date',
      'INVOICE': 'invoice',
      'SKB': 'skb',
      'PERIOD': 'period',
      'DEPO LOCATION': 'depo_location',
      'PART NO': 'part_no',
      'DESCRIPTION': 'description',
      'QTY': 'qty',
      'SO DATE': 'so_date',
      'MONTH': 'month',
      'YEAR': 'year',
      'MAINTENANCE TYPE': 'maintenance_type',
      'SERI LOKOMOTIF': 'seri_lokomotif', // Alternative mapping
      'PART USING': 'part_using',
      'PART TYPE': 'part_type',
      
      // Alternative column names (fallbacks)
      'Locomotive': 'seri_lokomotif',
      'Invoice Date': 'invoice_date',
      'Invoice': 'invoice',
      'Skb': 'skb',
      'Period': 'period',
      'Depo Location': 'depo_location',
      'Part No': 'part_no',
      'Description': 'description',
      'Qty': 'qty',
      'SO Date': 'so_date',
      'Month': 'month',
      'Year': 'year',
      'Maintenance Type': 'maintenance_type',
      'Seri Lokomotif': 'seri_lokomotif',
      'Part Using': 'part_using',
      'Part Type': 'part_type'
    };

    // Find columns in headers
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
    const requiredColumns = ['part_no', 'description', 'qty'];
    const missingColumns = requiredColumns.filter(col => columnIndexes[col] === undefined);
    
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}. Available columns: ${headers.join(', ')}`);
    }

    console.log(`📊 Component Usage CSV Analysis:`);
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
        
        // Extract required fields using column indexes with enhanced validation
        const partNo = values[columnIndexes['part_no']] || '';
        const description = values[columnIndexes['description']] || '';
        const qtyRaw = values[columnIndexes['qty']] || '';

        // Enhanced validation with specific error messages
        if (!partNo.trim()) {
          throw new Error(`Missing required data: part_no is empty`);
        }
        if (!description.trim()) {
          throw new Error(`Missing required data: description is empty`);
        }

        // Enhanced qty parsing with NaN handling
        let qty = 0;
        if (qtyRaw && qtyRaw !== '' && qtyRaw !== '--' && qtyRaw !== 'NaN' && qtyRaw.toLowerCase() !== 'null') {
          const parsedQty = parseInt(qtyRaw);
          if (!isNaN(parsedQty) && parsedQty > 0) {
            qty = parsedQty;
          } else {
            // Try parsing as float then convert to int
            const floatQty = parseFloat(qtyRaw);
            if (!isNaN(floatQty) && floatQty > 0) {
              qty = Math.round(floatQty);
            } else {
              throw new Error(`Invalid quantity value: "${qtyRaw}" - must be a positive number`);
            }
          }
        } else {
          throw new Error(`Missing or invalid quantity: "${qtyRaw}"`);
        }

        // Extract other fields with null handling
        const invoiceDate = columnIndexes['invoice_date'] !== undefined ? 
          values[columnIndexes['invoice_date']] : null;
        const soDate = columnIndexes['so_date'] !== undefined ? 
          values[columnIndexes['so_date']] : null;
        
        // Enhanced year parsing
        let year = null;
        if (columnIndexes['year'] !== undefined && values[columnIndexes['year']]) {
          const yearRaw = values[columnIndexes['year']].toString().trim();
          if (yearRaw && yearRaw !== '--' && yearRaw !== 'NaN') {
            const parsedYear = parseInt(yearRaw);
            if (!isNaN(parsedYear) && parsedYear > 1900 && parsedYear < 2100) {
              year = parsedYear;
            }
          }
        }

        // Prepare component usage data
        const componentData = {
          invoiceDate: invoiceDate ? ComponentUsageController.parseDate(invoiceDate) : null,
          invoice: values[columnIndexes['invoice']] || '',
          skb: values[columnIndexes['skb']] || '',
          period: values[columnIndexes['period']] || '',
          depoLocation: values[columnIndexes['depo_location']] || '',
          partNo: partNo.trim(),
          description: description.trim(),
          qty: qty,
          soDate: soDate ? ComponentUsageController.parseDate(soDate) : null,
          month: values[columnIndexes['month']] || '',
          year: year,
          maintenanceType: values[columnIndexes['maintenance_type']] || '',
          seriLokomotif: values[columnIndexes['seri_lokomotif']] || '',
          partUsing: values[columnIndexes['part_using']] || '',
          partType: values[columnIndexes['part_type']] || ''
        };

        // Insert to database
        await ComponentUsage.create(componentData);
        successCount++;

        if (i % 1000 === 0) {
          console.log(`✅ Processed ${i} rows, current: ${partNo} - ${description} (Qty: ${qty})`);
        }

      } catch (error) {
        errorCount++;
        errors.push(`Row ${i + 1}: ${error.message}`);
        if (errorCount <= 20) {
          console.error(`❌ Error row ${i + 1}:`, error.message);
        }
      }
    }

    console.log(`📊 Component Usage Import completed: ${successCount} success, ${errorCount} errors`);

    return {
      total_rows: lines.length - 1,
      success_count: successCount,
      error_count: errorCount,
      errors: errors.slice(0, 15), // Show first 15 errors
      column_analysis: {
        total_columns: headers.length,
        mapped_columns: Object.keys(columnIndexes).length,
        available_columns: headers,
        mapped_fields: columnIndexes
      }
    };
  }

  // Helper method to parse different date formats (Enhanced with Indonesian format)
  static parseDate(dateString) {
    if (!dateString || dateString === '--' || dateString === '' || dateString === 'NaN' || dateString.toLowerCase() === 'null' || dateString === '-') return null;
    
    dateString = dateString.trim();
    
    // Skip obviously invalid date values
    if (dateString.length < 3 || /^\d+[A-Z]+$/.test(dateString) || /^[A-Z]+\d*$/.test(dateString)) {
      return null;
    }
    
    try {
      // Format 1: DD AGUS YY / DD MMM YY (Indonesian format: "01 AGUS 25")
      const ddMMMYYIndo = dateString.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{2})$/);
      if (ddMMMYYIndo) {
        const [, day, monthStr, year] = ddMMMYYIndo;
        const monthMap = {
          // English months
          'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
          'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11,
          // Indonesian months
          'januari': 0, 'februari': 1, 'maret': 2, 'april': 3, 'mei': 4, 'juni': 5,
          'juli': 6, 'agustus': 7, 'agus': 7, 'september': 8, 'oktober': 9, 'november': 10, 'desember': 11,
          // Short Indonesian
          'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'mei': 4, 'jun': 5,
          'jul': 6, 'agu': 7, 'sep': 8, 'okt': 9, 'nov': 10, 'des': 11
        };
        const month = monthMap[monthStr.toLowerCase()];
        const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
        
        if (month !== undefined) {
          const date = new Date(fullYear, month, parseInt(day));
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
        }
      }

      // Format 2: DD-MMM-YY (14-Jan-16) - Enhanced
      const ddMMMYY = dateString.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/);
      if (ddMMMYY) {
        const [, day, monthStr, year] = ddMMMYY;
        const monthMap = {
          'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
          'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
        };
        const month = monthMap[monthStr.toLowerCase()];
        const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
        
        if (month !== undefined) {
          const date = new Date(fullYear, month, parseInt(day));
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
        }
      }

      // Format 3: DD/MM/YYYY
      const ddmmyyyy = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (ddmmyyyy) {
        const [, day, month, year] = ddmmyyyy;
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      }

      // Format 4: DD/MM/YY (convert 2-digit year)
      const ddmmyy = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
      if (ddmmyy) {
        const [, day, month, year] = ddmmyy;
        const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
        const date = new Date(fullYear, month - 1, day);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      }

      // Format 5: YYYY-MM-DD (ISO)
      const isoDate = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (isoDate) {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      }

      // Format 6: MM/DD/YYYY (US format)
      const mmddyyyy = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (mmddyyyy) {
        const [, month, day, year] = mmddyyyy;
        // Only use if day value makes sense for US format
        if (parseInt(day) > 12 || parseInt(month) <= 12) {
          const date = new Date(year, month - 1, day);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
        }
      }

      // Format 7: DD-MMM-YYYY (14-Jan-2016)
      const ddMMMYYYY = dateString.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
      if (ddMMMYYYY) {
        const [, day, monthStr, year] = ddMMMYYYY;
        const monthMap = {
          'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
          'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
        };
        const month = monthMap[monthStr.toLowerCase()];
        
        if (month !== undefined) {
          const date = new Date(parseInt(year), month, parseInt(day));
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
        }
      }

      // Format 8: Try native Date parsing as last resort (with validation)
      const nativeDate = new Date(dateString);
      if (!isNaN(nativeDate.getTime()) && nativeDate.getFullYear() > 1900 && nativeDate.getFullYear() < 2100) {
        return nativeDate.toISOString().split('T')[0];
      }

    } catch (error) {
      // Silently handle date parsing errors - no need to log every invalid date
    }
    
    return null;
  }

  // GET /api/component-usage/locomotives - Get distinct locomotives
  static async getLocomotives(req, res) {
    try {
      const locomotives = await ComponentUsage.getDistinctLocomotives();

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

  // GET /api/component-usage/maintenance-types - Get distinct maintenance types
  static async getMaintenanceTypes(req, res) {
    try {
      const maintenanceTypes = await ComponentUsage.getDistinctMaintenanceTypes();

      res.json({
        success: true,
        data: maintenanceTypes
      });

    } catch (error) {
      console.error('Error fetching maintenance types:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/component-usage/depo-locations - Get distinct depo locations
  static async getDepoLocations(req, res) {
    try {
      const depoLocations = await ComponentUsage.getDistinctDepoLocations();

      res.json({
        success: true,
        data: depoLocations
      });

    } catch (error) {
      console.error('Error fetching depo locations:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/component-usage/years - Get distinct years
  static async getYears(req, res) {
    try {
      const years = await ComponentUsage.getDistinctYears();

      res.json({
        success: true,
        data: years
      });

    } catch (error) {
      console.error('Error fetching years:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/component-usage/months - Get distinct months
  static async getMonths(req, res) {
    try {
      const months = await ComponentUsage.getDistinctMonths();

      res.json({
        success: true,
        data: months
      });

    } catch (error) {
      console.error('Error fetching months:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ComponentUsageController;