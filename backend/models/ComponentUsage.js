// models/ComponentUsage.js - Simple Version
const pool = require('../db');

class ComponentUsage {
  // Get all component usage data with simple filtering
  static async getAll(filters = {}) {
    try {
      const { page = 1, limit = 50 } = filters;
      
      // Simple query first
      const query = `
        SELECT * FROM component_usage 
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
      `;
      
      const offset = (page - 1) * limit;
      const result = await pool.query(query, [limit, offset]);
      
      // Get total count
      const countResult = await pool.query('SELECT COUNT(*) as total FROM component_usage');
      const total = parseInt(countResult.rows[0].total);
      
      return {
        data: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      };
      
    } catch (error) {
      console.error('Error in ComponentUsage.getAll:', error);
      throw error;
    }
  }

  // Simple create method
  static async create(componentData) {
    try {
      const {
        invoice_date, invoice, skb, period, depo, part_no,
        description, qty, so_date, month, year, maintenance,
        locomotive, part_using, part_type
      } = componentData;

      const query = `
        INSERT INTO component_usage (
          invoice_date, invoice, skb, period, depo, part_no, 
          description, qty, so_date, month, year, maintenance, 
          locomotive, part_using, part_type
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `;

      const values = [
        invoice_date, invoice, skb, period, depo, part_no,
        description, qty, so_date, month, year, maintenance,
        locomotive, part_using, part_type
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
      
    } catch (error) {
      console.error('Error in ComponentUsage.create:', error);
      throw error;
    }
  }

  // Get distinct values for dropdowns
  static async getDistinctLocomotives() {
    try {
      const query = `
        SELECT DISTINCT locomotive 
        FROM component_usage 
        WHERE locomotive IS NOT NULL AND locomotive != ''
        ORDER BY locomotive
      `;
      const result = await pool.query(query);
      return result.rows.map(row => row.locomotive);
    } catch (error) {
      console.error('Error in getDistinctLocomotives:', error);
      throw error;
    }
  }

  static async getDistinctMaintenanceTypes() {
    try {
      const query = `
        SELECT DISTINCT maintenance 
        FROM component_usage 
        WHERE maintenance IS NOT NULL AND maintenance != ''
        ORDER BY maintenance
      `;
      const result = await pool.query(query);
      return result.rows.map(row => row.maintenance);
    } catch (error) {
      console.error('Error in getDistinctMaintenanceTypes:', error);
      throw error;
    }
  }
}

module.exports = ComponentUsage;