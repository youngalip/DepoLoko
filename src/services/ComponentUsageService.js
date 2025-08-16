// services/ComponentUsageService.js
const API_BASE_URL = 'http://localhost:3001/api';

class ComponentUsageService {
  // Get component usage data with filters
  static async getComponentUsage(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          if (Array.isArray(filters[key])) {
            filters[key].forEach(value => params.append(key, value));
          } else {
            params.append(key, filters[key]);
          }
        }
      });
      
      console.log('🔄 Fetching component usage data with filters:', filters);
      
      const response = await fetch(`${API_BASE_URL}/component-usage?${params}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch component usage data');
      }
      
      return result;
    } catch (error) {
      console.error('ComponentUsageService.getComponentUsage error:', error);
      throw new Error(`Failed to fetch component usage: ${error.message}`);
    }
  }

  // Get summary/analytics data
  static async getSummaryCounters(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      console.log('🔄 Fetching summary counters with filters:', filters);
      
      const response = await fetch(`${API_BASE_URL}/component-usage/summary?${params}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch summary data');
      }
      
      return result.data || {};
    } catch (error) {
      console.error('ComponentUsageService.getSummaryCounters error:', error);
      throw new Error(`Failed to fetch summary: ${error.message}`);
    }
  }

  // Get analytics data for charts
  static async getAnalytics(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      console.log('🔄 Fetching analytics data with filters:', filters);
      
      const response = await fetch(`${API_BASE_URL}/component-usage/analytics?${params}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch analytics data');
      }
      
      return result.data || {};
    } catch (error) {
      console.error('ComponentUsageService.getAnalytics error:', error);
      throw new Error(`Failed to fetch analytics: ${error.message}`);
    }
  }

  // Import CSV file
  static async importCSV(file) {
    try {
      console.log('🔄 Starting CSV import...', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
      
      const formData = new FormData();
      formData.append('csvFile', file);
      
      const response = await fetch(`${API_BASE_URL}/component-usage/import`, {
        method: 'POST',
        body: formData,
      });
      
      console.log('📡 Import response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Import error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Import success:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Import failed');
      }
      
      return result;
      
    } catch (error) {
      console.error('💥 Import CSV Error:', error);
      
      // More specific error messages
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Make sure backend is running on port 3001.');
      } else if (error.message.includes('413')) {
        throw new Error('File too large. Maximum size is 20MB.');
      } else if (error.message.includes('400')) {
        throw new Error('Invalid file format. Please upload CSV, XLSX, or XLS file.');
      } else {
        throw new Error(`Import failed: ${error.message}`);
      }
    }
  }

  // Get dropdown options
  static async getLocomotives() {
    try {
      const response = await fetch(`${API_BASE_URL}/component-usage/locomotives`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch locomotives');
      }
      
      return result.data || [];
    } catch (error) {
      console.error('ComponentUsageService.getLocomotives error:', error);
      return []; // Return empty array on error
    }
  }

  static async getMaintenanceTypes() {
    try {
      const response = await fetch(`${API_BASE_URL}/component-usage/maintenance-types`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch maintenance types');
      }
      
      return result.data || [];
    } catch (error) {
      console.error('ComponentUsageService.getMaintenanceTypes error:', error);
      return []; // Return empty array on error
    }
  }

  static async getDepoLocations() {
    try {
      const response = await fetch(`${API_BASE_URL}/component-usage/depo-locations`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch depo locations');
      }
      
      return result.data || [];
    } catch (error) {
      console.error('ComponentUsageService.getDepoLocations error:', error);
      return []; // Return empty array on error
    }
  }

  static async getYears() {
    try {
      const response = await fetch(`${API_BASE_URL}/component-usage/years`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch years');
      }
      
      return result.data || [];
    } catch (error) {
      console.error('ComponentUsageService.getYears error:', error);
      return []; // Return empty array on error
    }
  }

  static async getMonths() {
    try {
      const response = await fetch(`${API_BASE_URL}/component-usage/months`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch months');
      }
      
      return result.data || [];
    } catch (error) {
      console.error('ComponentUsageService.getMonths error:', error);
      return []; // Return empty array on error
    }
  }

  // Helper method to build filters object
  static buildFilters({
    startDate,
    endDate,
    selectedLocomotives = [],
    selectedMaintenanceTypes = [],
    selectedDepoLocations = [],
    selectedYears = [],
    selectedMonths = [],
    selectedPeriods = [],
    selectedPartTypes = [],
    selectedPartUsings = [],
    page = 1,
    limit = 50
  }) {
    const filters = { page, limit };

    // Date filters
    if (startDate) {
      filters.startDate = startDate.toISOString().split('T')[0];
    }
    if (endDate) {
      filters.endDate = endDate.toISOString().split('T')[0];
    }

    // Array filters - only add if not empty
    if (selectedLocomotives.length > 0) {
      filters.locomotive = selectedLocomotives[0]; // API handles single value for now
    }
    if (selectedMaintenanceTypes.length > 0) {
      filters.maintenanceType = selectedMaintenanceTypes[0];
    }
    if (selectedDepoLocations.length > 0) {
      filters.depoLocation = selectedDepoLocations[0];
    }
    if (selectedYears.length > 0) {
      filters.year = selectedYears[0];
    }
    if (selectedMonths.length > 0) {
      filters.month = selectedMonths[0];
    }
    if (selectedPeriods.length > 0) {
      filters.period = selectedPeriods[0];
    }
    if (selectedPartTypes.length > 0) {
      filters.partType = selectedPartTypes[0];
    }
    if (selectedPartUsings.length > 0) {
      filters.partUsing = selectedPartUsings[0];
    }

    return filters;
  }
}

export default ComponentUsageService;