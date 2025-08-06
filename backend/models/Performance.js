const db = require('../db');

class Performance {
  static async getChartData(column, locomotiveIds, startDate, endDate) {
    const placeholders = locomotiveIds.map((_, index) => `$${index + 3}`).join(',');
    
    const query = `
      SELECT 
        lp.locomotive_id,
        l.locomotive_number,
        l.locomotive_series,
        lp.recorded_at,
        lp.${column} as value
      FROM locomotive_performance lp
      JOIN locomotives l ON lp.locomotive_id = l.id
      WHERE lp.recorded_at BETWEEN $1 AND $2
        AND lp.locomotive_id IN (${placeholders})
        AND lp.${column} IS NOT NULL
      ORDER BY lp.recorded_at ASC
    `;
    
    const params = [startDate, endDate, ...locomotiveIds];
    const result = await db.query(query, params);
    return result.rows;
  }

  static getAvailableColumns() {
    return {
      apcclb: { label: 'Air Pressure Compressor Control', unit: 'bar' },
      apimrb: { label: 'Air Pressure Main Reservoir Brake', unit: 'bar' },
      opturps: { label: 'Oil Pressure Turbo', unit: 'psi' },
      wpegilp: { label: 'Water Pressure Engine Governor Inlet', unit: 'psi' },
      wpegotp: { label: 'Water Pressure Engine Governor Outlet', unit: 'psi' },
      eengrpm: { label: 'Engine RPM', unit: 'rpm' },
      tpu_rpm: { label: 'TPU RPM', unit: 'rpm' },
      egoiltf: { label: 'Engine Oil Temperature', unit: '°F' },
      engtmpf: { label: 'Engine Temperature', unit: '°F' },
      awt: { label: 'Ambient Water Temperature', unit: '°F' },
      atimrbf: { label: 'Air Temperature Main Reservoir Brake', unit: '°F' },
      ca_v: { label: 'Control Air Voltage', unit: 'V' }
    };
  }

  // NEW: Insert single performance record
  static async insertRecord(data) {
    const query = `
      INSERT INTO locomotive_performance (
        locomotive_id, recorded_at, apcclb, apimrb, opturps, wpegilp, wpegotp,
        eengrpm, tpu_rpm, egoiltf, engtmpf, awt, atimrbf, ca_v
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      )
      RETURNING id
    `;
    
    const values = [
      data.locomotive_id,
      data.recorded_at,
      data.apcclb,
      data.apimrb,
      data.opturps,
      data.wpegilp,
      data.wpegotp,
      data.eengrpm,
      data.tpu_rpm,
      data.egoiltf,
      data.engtmpf,
      data.awt,
      data.atimrbf,
      data.ca_v
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // NEW: Bulk insert for better performance (optional, untuk optimization nanti)
  static async bulkInsert(dataArray) {
    const client = await db.connect();
    
    try {
      await client.query('BEGIN');
      
      for (const data of dataArray) {
        await this.insertRecord(data);
      }
      
      await client.query('COMMIT');
      return { success: true, count: dataArray.length };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Performance;