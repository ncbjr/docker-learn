const { createClient } = require('redis');

class RedisClient {
  constructor() {
    this.client = null;
    this.config = {
      host: process.env.REDIS_HOST || 'redis',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      db: process.env.REDIS_DB || 0
    };
  }

  async connect() {
    if (!this.client) {
      this.client = createClient({
        socket: {
          host: this.config.host,
          port: this.config.port
        },
        password: this.config.password,
        database: this.config.db
      });

      this.client.on('error', (err) => {
        console.error('❌ Erro Redis:', err);
      });

      this.client.on('connect', () => {
        console.log('🔗 Conectado ao Redis');
      });

      await this.client.connect();
    }
    return this.client;
  }

  async testConnection() {
    const client = await this.connect();
    const pong = await client.ping();
    if (pong === 'PONG') {
      console.log('🏓 Ping Redis bem-sucedido');
    }
  }

  async get(key) {
    const client = await this.connect();
    return await client.get(key);
  }

  async set(key, value, ttl = 3600) {
    const client = await this.connect();
    return await client.setEx(key, ttl, JSON.stringify(value));
  }

  async del(key) {
    const client = await this.connect();
    return await client.del(key);
  }

  async exists(key) {
    const client = await this.connect();
    return await client.exists(key);
  }

  async incr(key) {
    const client = await this.connect();
    return await client.incr(key);
  }

  async expire(key, seconds) {
    const client = await this.connect();
    return await client.expire(key, seconds);
  }

  async close() {
    if (this.client) {
      await this.client.quit();
      console.log('🔒 Conexão Redis fechada');
    }
  }
}

module.exports = new RedisClient();
