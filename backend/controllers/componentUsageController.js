// controllers/componentUsageController.js - Simple Version
const ComponentUsage = require('../models/ComponentUsage');

class ComponentUsageController {
  // GET /api/component-usage - Basic get data
  static async getComponentUsage(req, res) {
    try {
      const { page = 1, limit = 50 } = req.query;
      
      const filters = {
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

  // GET distinct values for dropdowns
  static async getLocomotives(req, res) {
    try {
      const locomotives = await ComponentUsage.getDistinctLocomotives();
      res.json({ success: true, data: locomotives });
    } catch (error) {
      console.error('Error fetching locomotives:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getMaintenanceTypes(req, res) {
    try {
      const maintenanceTypes = await ComponentUsage.getDistinctMaintenanceTypes();
      res.json({ success: true, data: maintenanceTypes });
    } catch (error) {
      console.error('Error fetching maintenance types:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST - Create new record (simple version)
  static async createComponentUsage(req, res) {
    try {
      const componentData = req.body;
      const result = await ComponentUsage.create(componentData);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Component usage created successfully'
      });
    } catch (error) {
      console.error('Error creating component usage:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /api/component-usage/import - Import CSV (Full Implementation)
  static async importCSV(req, res) {
    try {
      console.log('📤 Import CSV endpoint hit');
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded. Please select a CSV, XLSX, or XLS file.',
          error_code: 'NO_FILE'
        });
      }

      console.log('📁 File received:', {
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });

      // Process CSV content
      const csvText = req.file.buffer.toString('utf8');
      const result = await ComponentUsageController.processCSVData(csvText);

      res.json({
        success: true,
        message: 'CSV imported successfully',
        stats: result
      });

    } catch (error) {
      console.error('Error in importCSV:', error);
      res.status(500).json({
        success: false,
        message: 'Import failed: ' + error.message,
        error_code: 'IMPORT_ERROR'
      });
    }
  }

  // CSV Processing Logic - Enhanced Separator Detection
  static async processCSVData(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    
    // Enhanced separator detection
    let separator = ',';
    const firstLine = lines[0];
    
    // Count occurrences of each potential separator
    const separatorCounts = {
      ';': (firstLine.match(/;/g) || []).length,
      ',': (firstLine.match(/,/g) || []).length,
      '\t': (firstLine.match(/\t/g) || []).length
    };
    
    // Choose separator with highest count
    if (separatorCounts[';'] > separatorCounts[','] && separatorCounts[';'] > separatorCounts['\t']) {
      separator = ';';
      console.log('🔍 Detected separator: semicolon (;)');
    } else if (separatorCounts['\t'] > separatorCounts[',']) {
      separator = '\t';
      console.log('🔍 Detected separator: tab (\\t)');
    } else {
      separator = ',';
      console.log('🔍 Detected separator: comma (,)');
    }
    
    const headers = lines[0].split(separator).map(h => h.trim().replace(/"/g, '').replace(/\r/g, ''));
    
    console.log('📊 CSV Headers detected:', headers);
    console.log('📊 Headers count:', headers.length);
    
    // Column mapping dengan prioritas LOCOMOTIVE
    const COLUMN_MAPPING = {
      'LOCOMOTIVE': 'locomotive',
      'LOCOMOTIVE NO': 'locomotive', 
      'LOCOMOTIVE NUMBER': 'locomotive',
      'SERI LOKOMOTIF': 'locomotive_fallback',
      'INVOICE DATE': 'invoice_date',
      'INVOICE': 'invoice',
      'SKB': 'skb',
      'PERIOD': 'period',
      'DEPO LOCATION': 'depo',
      'DEPO': 'depo',
      'PART NO': 'part_no',
      'DESCRIPTION': 'description',
      'QTY': 'qty',
      'SO DATE': 'so_date',
      'MONTH': 'month',
      'YEAR': 'year',
      'MAINTENANCE TYPE': 'maintenance',
      'PART USING': 'part_using',
      'PART TYPE': 'part_type'
    };

    // Find columns dengan prioritas
    const columnIndexes = {};
    const locomotivePriority = ['LOCOMOTIVE', 'LOCOMOTIVE NO', 'LOCOMOTIVE NUMBER', 'SERI LOKOMOTIF'];
    let locomotiveColumnFound = false;

    // Process non-locomotive columns
    Object.keys(COLUMN_MAPPING).forEach(csvColumn => {
      if (locomotivePriority.includes(csvColumn.toUpperCase()) || csvColumn === 'locomotive_fallback') return;
      
      const index = headers.findIndex(header => 
        header.toLowerCase().trim() === csvColumn.toLowerCase().trim()
      );
      if (index !== -1) {
        columnIndexes[COLUMN_MAPPING[csvColumn]] = index;
        console.log(`✅ Mapped "${csvColumn}" to index ${index} (${headers[index]})`);
      }
    });

    // Process locomotive dengan prioritas
    for (const locomotiveCol of locomotivePriority) {
      const index = headers.findIndex(header => 
        header.toLowerCase().trim() === locomotiveCol.toLowerCase().trim()
      );
      if (index !== -1 && !locomotiveColumnFound) {
        columnIndexes['locomotive'] = index;
        locomotiveColumnFound = true;
        console.log(`📍 Using '${locomotiveCol}' (index ${index}) for locomotive field`);
        break;
      }
    }

    console.log('🗺️ Final column mapping:', columnIndexes);

    // Validate required columns
    const requiredColumns = ['part_no', 'description', 'qty'];
    const missingColumns = requiredColumns.filter(col => columnIndexes[col] === undefined);
    
    if (missingColumns.length > 0) {
      console.error('❌ Missing columns:', missingColumns);
      console.error('🔍 Available headers:', headers);
      console.error('🔍 Mapping attempts:', Object.keys(COLUMN_MAPPING).map(col => ({
        csvColumn: col,
        foundAt: headers.findIndex(h => h.toLowerCase().trim() === col.toLowerCase().trim())
      })));
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}. Available: ${headers.join(', ')}`);
    }

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    // Process data rows
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(separator).map(v => v.trim().replace(/"/g, '').replace(/\r/g, ''));
        
        // Debug first few rows
        if (i <= 3) {
          console.log(`🔍 Row ${i} values (${values.length}):`, values.slice(0, 5));
        }
        
        // Extract required fields
        const partNo = values[columnIndexes['part_no']] || '';
        const description = values[columnIndexes['description']] || '';
        const qtyRaw = values[columnIndexes['qty']] || '';

        // Basic validation
        if (!partNo.trim()) {
          throw new Error(`Missing part_no`);
        }
        if (!description.trim()) {
          throw new Error(`Missing description`);
        }

        // Parse quantity
        let qty = 0;
        if (qtyRaw && qtyRaw !== '' && qtyRaw !== '-') {
          const parsedQty = parseInt(qtyRaw);
          if (!isNaN(parsedQty) && parsedQty > 0) {
            qty = parsedQty;
          } else {
            throw new Error(`Invalid quantity: "${qtyRaw}"`);
          }
        } else {
          throw new Error(`Missing quantity`);
        }

        // Parse year
        let year = null;
        if (columnIndexes['year'] !== undefined && values[columnIndexes['year']]) {
          const yearRaw = values[columnIndexes['year']].toString().trim();
          if (yearRaw && yearRaw !== '-') {
            const parsedYear = parseInt(yearRaw);
            if (!isNaN(parsedYear) && parsedYear > 1900 && parsedYear < 2100) {
              year = parsedYear;
            }
          }
        }

        // Prepare data
        const componentData = {
          invoice_date: columnIndexes['invoice_date'] ? ComponentUsageController.parseDate(values[columnIndexes['invoice_date']]) : null,
          invoice: values[columnIndexes['invoice']] || '',
          skb: values[columnIndexes['skb']] || '',
          period: values[columnIndexes['period']] || '',
          depo: values[columnIndexes['depo']] || '',
          part_no: partNo.trim(),
          description: description.trim(),
          qty: qty,
          so_date: columnIndexes['so_date'] ? ComponentUsageController.parseDate(values[columnIndexes['so_date']]) : null,
          month: values[columnIndexes['month']] || '',
          year: year,
          maintenance: values[columnIndexes['maintenance']] || '',
          locomotive: values[columnIndexes['locomotive']] || '',
          part_using: values[columnIndexes['part_using']] || '',
          part_type: values[columnIndexes['part_type']] || ''
        };

        // Debug first record
        if (i === 1) {
          console.log('🔍 First record to save:', componentData);
        }

        // Save to database
        await ComponentUsage.create(componentData);
        successCount++;

        if (i % 5 === 0) {
          console.log(`✅ Processed ${i} rows, current: ${partNo} - ${description}`);
        }

      } catch (error) {
        errorCount++;
        errors.push(`Row ${i + 1}: ${error.message}`);
        if (errorCount <= 5) {
          console.error(`❌ Error row ${i + 1}:`, error.message);
        }
      }
    }

    console.log(`📊 Import completed: ${successCount} success, ${errorCount} errors`);

    return {
      total_rows: lines.length - 1,
      success_count: successCount,
      error_count: errorCount,
      errors: errors.slice(0, 10), // Show first 10 errors
      column_analysis: {
        total_columns: headers.length,
        mapped_columns: Object.keys(columnIndexes).length,
        available_columns: headers,
        used_locomotive_column: locomotiveColumnFound ? 'LOCOMOTIVE' : 'Not found',
        separator_used: separator
      }
    };
  }

  // Simple date parser
  static parseDate(dateString) {
    if (!dateString || dateString === '-' || dateString === '') return null;
    
    dateString = dateString.trim();
    
    try {
      // Format: DD-MMM-YY (04-Jan-16)
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

      // Try native Date parsing
      const nativeDate = new Date(dateString);
      if (!isNaN(nativeDate.getTime())) {
        return nativeDate.toISOString().split('T')[0];
      }

    } catch (error) {
      console.log(`Date parse error for "${dateString}":`, error.message);
    }
    
    return null;
  }
}

module.exports = ComponentUsageController;