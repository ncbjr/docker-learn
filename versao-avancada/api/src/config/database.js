const mysql = require('mysql2/promise');

class Database {
  constructor() {
    this.pool = null;
    this.config = {
      host: process.env.DB_HOST || 'database',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'api_user',
      password: process.env.DB_PASSWORD || 'api123',
      database: process.env.DB_NAME || 'escola_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true
    };
  }

  async connect() {
    if (!this.pool) {
      this.pool = mysql.createPool(this.config);
      console.log('🔗 Pool de conexões MySQL criado');
    }
    return this.pool;
  }

  async testConnection() {
    const pool = await this.connect();
    const connection = await pool.getConnection();
    
    try {
      await connection.ping();
      console.log('🏓 Ping MySQL bem-sucedido');
    } finally {
      connection.release();
    }
  }

  async query(sql, params = []) {
    const pool = await this.connect();
    const [rows] = await pool.execute(sql, params);
    return rows;
  }

  async transaction(callback) {
    const pool = await this.connect();
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      console.log('🔒 Conexões MySQL fechadas');
    }
  }
}

module.exports = new Database();
