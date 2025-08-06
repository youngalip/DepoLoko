// models/FaultHistory.js
const pool = require('../db');

class FaultHistory {
  // Get fault history with filters and pagination
  static async getAll(filters = {}) {
    const { 
      startDate, 
      endDate, 
      locomotiveId, 
      faultType, 
      faultCode,
      page = 1, 
      limit = 50 
    } = filters;
  
    // Build WHERE conditions
    let whereConditions = 'WHERE fh.date_occurred BETWEEN $1 AND $2';
    const values = [startDate, endDate];
    let paramCount = 2;
  
    if (locomotiveId) {
      whereConditions += ` AND fh.locomotive_id = $${++paramCount}`;
      values.push(locomotiveId);
    }
    
    if (faultType) {
      whereConditions += ` AND fh.fault_type = $${++paramCount}`;
      values.push(faultType);
    }
    
    if (faultCode) {
      whereConditions += ` AND fh.fault_code = $${++paramCount}`;
      values.push(faultCode);
    }
  
    // Count query - use same WHERE conditions and values
    const countQuery = `
      SELECT COUNT(*) as total
      FROM fault_history fh
      JOIN locomotives l ON fh.locomotive_id = l.id
      ${whereConditions}
    `;
  
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total);
  
    // Main query - use same WHERE conditions, then add pagination
    const query = `
      SELECT 
        fh.*,
        l.locomotive_number,
        l.locomotive_series
      FROM fault_history fh
      JOIN locomotives l ON fh.locomotive_id = l.id
      ${whereConditions}
      ORDER BY fh.date_occurred DESC, fh.id DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;
  
    // Add pagination parameters to values array
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
    const { startDate, endDate, locomotiveId, faultType, faultCode } = filters;

    let baseWhere = 'WHERE date_occurred BETWEEN $1 AND $2';
    const values = [startDate, endDate];
    let paramCount = 2;

    if (locomotiveId) {
      baseWhere += ` AND locomotive_id = $${++paramCount}`;
      values.push(locomotiveId);
    }
    if (faultType) {
      baseWhere += ` AND fault_type = $${++paramCount}`;
      values.push(faultType);
    }
    if (faultCode) {
      baseWhere += ` AND fault_code = $${++paramCount}`;
      values.push(faultCode);
    }

    const queries = {
      locomotives: `
        SELECT 
          l.id,
          l.locomotive_number,
          l.locomotive_series,
          COUNT(*) as counter
        FROM fault_history fh
        JOIN locomotives l ON fh.locomotive_id = l.id
        ${baseWhere}
        GROUP BY l.id, l.locomotive_number, l.locomotive_series
        ORDER BY counter DESC
      `,
      faultTypes: `
        SELECT 
          fault_type,
          COUNT(*) as counter
        FROM fault_history fh
        ${baseWhere}
        GROUP BY fault_type
        ORDER BY counter DESC
      `,
      faultCodes: `
        SELECT 
          fault_code,
          fault_description,
          COUNT(*) as counter
        FROM fault_history fh
        ${baseWhere}
        GROUP BY fault_code, fault_description
        ORDER BY counter DESC
      `
    };

    const results = {};
    for (const [key, query] of Object.entries(queries)) {
      const result = await pool.query(query, values);
      results[key] = result.rows;
    }

    return results;
  }

  // Calculate next counter for locomotive + fault_code combination
  static async getNextCounter(locomotiveId, faultCode) {
    const query = `
      SELECT COALESCE(MAX(counter), 0) + 1 as next_counter
      FROM fault_history 
      WHERE locomotive_id = $1 AND fault_code = $2
    `;
    const result = await pool.query(query, [locomotiveId, faultCode]);
    return result.rows[0].next_counter;
  }

  // Insert new fault record
  static async create(faultData) {
    const {
      locomotiveId,
      dateOccurred,
      faultType,
      faultCode,
      faultDescription,
      priorityLevel,
      priorityDescription,
      delta
    } = faultData;

    // Get next counter for this locomotive + fault_code combination
    const counter = await this.getNextCounter(locomotiveId, faultCode);

    const query = `
      INSERT INTO fault_history (
        locomotive_id, date_occurred, fault_type, fault_code, 
        fault_description, priority_level, priority_description, 
        counter, delta
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      locomotiveId, dateOccurred, faultType, faultCode,
      faultDescription, priorityLevel, priorityDescription,
      counter, delta
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get distinct fault types
  static async getDistinctFaultTypes() {
    const query = `
      SELECT DISTINCT fault_type
      FROM fault_history
      WHERE fault_type IS NOT NULL AND fault_type != ''
      ORDER BY fault_type
    `;
    const result = await pool.query(query);
    return result.rows.map(row => row.fault_type);
  }

  // Get distinct fault codes with descriptions
  static async getDistinctFaultCodes() {
    const query = `
      SELECT DISTINCT fault_code, fault_description
      FROM fault_history
      WHERE fault_code IS NOT NULL
      ORDER BY fault_code
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Get fault history by ID
  static async getById(id) {
    const query = `
      SELECT 
        fh.*,
        l.locomotive_number,
        l.locomotive_series
      FROM fault_history fh
      JOIN locomotives l ON fh.locomotive_id = l.id
      WHERE fh.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Update fault history record
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 0;

    // Dynamic update query building
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${++paramCount}`);
        values.push(updateData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    // Add updated_at
    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    const query = `
      UPDATE fault_history 
      SET ${fields.join(', ')}
      WHERE id = $${++paramCount}
      RETURNING *
    `;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete fault history record
  static async delete(id) {
    const query = 'DELETE FROM fault_history WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Get fault statistics for a specific locomotive
  static async getLocomotiveStats(locomotiveId, startDate, endDate) {
    const query = `
      SELECT 
        COUNT(*) as total_faults,
        COUNT(DISTINCT fault_type) as unique_fault_types,
        COUNT(DISTINCT fault_code) as unique_fault_codes,
        AVG(priority_level) as avg_priority,
        fault_type,
        COUNT(*) as fault_count
      FROM fault_history
      WHERE locomotive_id = $1 
        AND date_occurred BETWEEN $2 AND $3
      GROUP BY fault_type
      ORDER BY fault_count DESC
    `;
    
    const result = await pool.query(query, [locomotiveId, startDate, endDate]);
    return result.rows;
  }

  // Get trending fault codes
  static async getTrendingFaultCodes(days = 30, limit = 10) {
    const query = `
      SELECT 
        fault_code,
        fault_description,
        COUNT(*) as occurrence_count,
        COUNT(DISTINCT locomotive_id) as affected_locomotives
      FROM fault_history
      WHERE date_occurred >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY fault_code, fault_description
      ORDER BY occurrence_count DESC
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}

module.exports = FaultHistory;