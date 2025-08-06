const db = require('../db');

class Locomotive {
  static async findAll() {
    const query = `
      SELECT id, locomotive_number, locomotive_series 
      FROM locomotives 
      ORDER BY locomotive_number
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT id, locomotive_number, locomotive_series 
      FROM locomotives 
      WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // NEW: Find by locomotive number
  static async findByNumber(locomotiveNumber) {
    const query = `
      SELECT id, locomotive_number, locomotive_series 
      FROM locomotives 
      WHERE locomotive_number = $1
    `;
    const result = await db.query(query, [locomotiveNumber]);
    return result.rows[0];
  }

  // NEW: Create new locomotive
  static async create(locomotiveData) {
    const query = `
      INSERT INTO locomotives (locomotive_number, locomotive_series)
      VALUES ($1, $2)
      RETURNING id, locomotive_number, locomotive_series
    `;
    const values = [locomotiveData.locomotive_number, locomotiveData.locomotive_series];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // NEW: Get or create locomotive (for CSV import)
  static async getOrCreate(locomotiveNumber) {
    // Try to find existing locomotive
    let locomotive = await this.findByNumber(locomotiveNumber);
    
    if (!locomotive) {
      // Extract series from number (CC201-01 → CC201)
      const series = locomotiveNumber.match(/^([A-Z]+[0-9]+)/)?.[1] || 'Unknown';
      
      // Create new locomotive
      locomotive = await this.create({
        locomotive_number: locomotiveNumber,
        locomotive_series: series
      });
      
      console.log(`✅ Created new locomotive: ${locomotiveNumber} (Series: ${series})`);
    }
    
    return locomotive;
  }
}

module.exports = Locomotive;