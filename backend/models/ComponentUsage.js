// models/ComponentUsage.js
const pool = require('../db');

class ComponentUsage {
  // Get component usage with filters and pagination
  static async getAll(filters = {}) {
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
    } = filters;

    // Build WHERE conditions
    let whereConditions = 'WHERE 1=1';
    const values = [];
    let paramCount = 0;

    if (startDate && endDate) {
      whereConditions += ` AND so_date BETWEEN $${++paramCount} AND $${++paramCount}`;
      values.push(startDate, endDate);
    }

    if (locomotive) {
      whereConditions += ` AND seri_lokomotif ILIKE $${++paramCount}`;
      values.push(`%${locomotive}%`);
    }
    
    if (partNo) {
      whereConditions += ` AND part_no ILIKE $${++paramCount}`;
      values.push(`%${partNo}%`);
    }
    
    if (maintenanceType) {
      whereConditions += ` AND maintenance_type = $${++paramCount}`;
      values.push(maintenanceType);
    }

    if (depoLocation) {
      whereConditions += ` AND depo_location = $${++paramCount}`;
      values.push(depoLocation);
    }

    if (year) {
      whereConditions += ` AND year = $${++paramCount}`;
      values.push(parseInt(year));
    }

    if (month) {
      whereConditions += ` AND month = $${++paramCount}`;
      values.push(month);
    }

    // Count query
    const countQuery = `
      SELECT COUNT(*) as total
      FROM component_usage
      ${whereConditions}
    `;

    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total);

    // Main query with pagination
    const query = `
      SELECT *
      FROM component_usage
      ${whereConditions}
      ORDER BY so_date DESC, id DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    const queryValues = [...values, limit, (page - 1) * limit];
    const result = await pool.query(query, queryValues);

    return {
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    };
  }

  // Get summary counters for filters
  static async getSummaryCounters(filters = {}) {
    const { startDate, endDate, locomotive, partNo, maintenanceType, depoLocation, year, month } = filters;

    let baseWhere = 'WHERE 1=1';
    const values = [];
    let paramCount = 0;

    if (startDate && endDate) {
      baseWhere += ` AND so_date BETWEEN $${++paramCount} AND $${++paramCount}`;
      values.push(startDate, endDate);
    }

    if (locomotive) {
      baseWhere += ` AND seri_lokomotif ILIKE $${++paramCount}`;
      values.push(`%${locomotive}%`);
    }

    if (partNo) {
      baseWhere += ` AND part_no ILIKE $${++paramCount}`;
      values.push(`%${partNo}%`);
    }

    if (maintenanceType) {
      baseWhere += ` AND maintenance_type = $${++paramCount}`;
      values.push(maintenanceType);
    }

    if (depoLocation) {
      baseWhere += ` AND depo_location = $${++paramCount}`;
      values.push(depoLocation);
    }

    if (year) {
      baseWhere += ` AND year = $${++paramCount}`;
      values.push(parseInt(year));
    }

    if (month) {
      baseWhere += ` AND month = $${++paramCount}`;
      values.push(month);
    }

    const queries = {
      locomotives: `
        SELECT 
          seri_lokomotif,
          COUNT(*) as counter
        FROM component_usage
        ${baseWhere}
        GROUP BY seri_lokomotif
        ORDER BY counter DESC
      `,
      partNumbers: `
        SELECT 
          part_no,
          description,
          COUNT(*) as counter
        FROM component_usage
        ${baseWhere}
        GROUP BY part_no, description
        ORDER BY counter DESC
      `,
      maintenanceTypes: `
        SELECT 
          maintenance_type,
          COUNT(*) as counter
        FROM component_usage
        ${baseWhere}
        GROUP BY maintenance_type
        ORDER BY counter DESC
      `,
      depoLocations: `
        SELECT 
          depo_location,
          COUNT(*) as counter
        FROM component_usage
        ${baseWhere}
        GROUP BY depo_location
        ORDER BY counter DESC
      `,
      years: `
        SELECT 
          year,
          COUNT(*) as counter
        FROM component_usage
        ${baseWhere}
        GROUP BY year
        ORDER BY year DESC
      `
    };

    const results = {};
    for (const [key, query] of Object.entries(queries)) {
      const result = await pool.query(query, values);
      results[key] = result.rows;
    }

    return results;
  }

  // Insert new component usage record
  static async create(componentData) {
    const {
      invoiceDate,
      invoice,
      skb,
      period,
      depoLocation,
      partNo,
      description,
      qty,
      soDate,
      month,
      year,
      maintenanceType,
      seriLokomotif,
      partUsing,
      partType
    } = componentData;

    const query = `
      INSERT INTO component_usage (
        invoice_date, invoice, skb, period, depo_location, part_no, 
        description, qty, so_date, month, year, maintenance_type, 
        seri_lokomotif, part_using, part_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const values = [
      invoiceDate, invoice, skb, period, depoLocation, partNo,
      description, qty, soDate, month, year, maintenanceType,
      seriLokomotif, partUsing, partType
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get distinct values for dropdown filters
  static async getDistinctLocomotives() {
    const query = `
      SELECT DISTINCT seri_lokomotif
      FROM component_usage
      WHERE seri_lokomotif IS NOT NULL AND seri_lokomotif != ''
      ORDER BY seri_lokomotif
    `;
    const result = await pool.query(query);
    return result.rows.map(row => row.seri_lokomotif);
  }

  static async getDistinctMaintenanceTypes() {
    const query = `
      SELECT DISTINCT maintenance_type
      FROM component_usage
      WHERE maintenance_type IS NOT NULL AND maintenance_type != ''
      ORDER BY maintenance_type
    `;
    const result = await pool.query(query);
    return result.rows.map(row => row.maintenance_type);
  }

  static async getDistinctDepoLocations() {
    const query = `
      SELECT DISTINCT depo_location
      FROM component_usage
      WHERE depo_location IS NOT NULL AND depo_location != ''
      ORDER BY depo_location
    `;
    const result = await pool.query(query);
    return result.rows.map(row => row.depo_location);
  }

  static async getDistinctYears() {
    const query = `
      SELECT DISTINCT year
      FROM component_usage
      WHERE year IS NOT NULL
      ORDER BY year DESC
    `;
    const result = await pool.query(query);
    return result.rows.map(row => row.year);
  }

  static async getDistinctMonths() {
    const query = `
      SELECT DISTINCT month
      FROM component_usage
      WHERE month IS NOT NULL AND month != ''
      ORDER BY 
        CASE month 
          WHEN 'January' THEN 1 WHEN 'February' THEN 2 WHEN 'March' THEN 3
          WHEN 'April' THEN 4 WHEN 'May' THEN 5 WHEN 'June' THEN 6
          WHEN 'July' THEN 7 WHEN 'August' THEN 8 WHEN 'September' THEN 9
          WHEN 'October' THEN 10 WHEN 'November' THEN 11 WHEN 'December' THEN 12
          ELSE 13
        END
    `;
    const result = await pool.query(query);
    return result.rows.map(row => row.month);
  }

  // Get component usage by ID
  static async getById(id) {
    const query = `SELECT * FROM component_usage WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Update component usage record
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 0;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && key !== 'id') {
        fields.push(`${key} = $${++paramCount}`);
        values.push(updateData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `
      UPDATE component_usage 
      SET ${fields.join(', ')}
      WHERE id = $${++paramCount}
      RETURNING *
    `;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete component usage record
  static async delete(id) {
    const query = 'DELETE FROM component_usage WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Get analytics data for charts
  static async getAnalytics(filters = {}) {
    const { startDate, endDate } = filters;
    
    let whereConditions = 'WHERE 1=1';
    const values = [];
    let paramCount = 0;

    if (startDate && endDate) {
      whereConditions += ` AND so_date BETWEEN $${++paramCount} AND $${++paramCount}`;
      values.push(startDate, endDate);
    }

    const queries = {
      // Top components by usage
      topComponents: `
        SELECT 
          description,
          SUM(qty) as total_qty,
          COUNT(*) as usage_count
        FROM component_usage
        ${whereConditions}
        GROUP BY description
        ORDER BY total_qty DESC
        LIMIT 10
      `,
      // Usage by locomotive
      byLocomotive: `
        SELECT 
          seri_lokomotif,
          SUM(qty) as total_qty,
          COUNT(*) as usage_count
        FROM component_usage
        ${whereConditions}
        GROUP BY seri_lokomotif
        ORDER BY total_qty DESC
        LIMIT 10
      `,
      // Monthly trend
      monthlyTrend: `
        SELECT 
          year,
          month,
          SUM(qty) as total_qty,
          COUNT(*) as usage_count
        FROM component_usage
        ${whereConditions}
        GROUP BY year, month
        ORDER BY year, 
          CASE month 
            WHEN 'January' THEN 1 WHEN 'February' THEN 2 WHEN 'March' THEN 3
            WHEN 'April' THEN 4 WHEN 'May' THEN 5 WHEN 'June' THEN 6
            WHEN 'July' THEN 7 WHEN 'August' THEN 8 WHEN 'September' THEN 9
            WHEN 'October' THEN 10 WHEN 'November' THEN 11 WHEN 'December' THEN 12
            ELSE 13
          END
      `
    };

    const results = {};
    for (const [key, query] of Object.entries(queries)) {
      const result = await pool.query(query, values);
      results[key] = result.rows;
    }

    return results;
  }
}

module.exports = ComponentUsage;