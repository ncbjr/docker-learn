const express = require('express');
const database = require('../config/database');
const redis = require('../config/redis');

const router = express.Router();

// Health check completo
router.get('/', async (req, res) => {
  const startTime = Date.now();
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    container: 'avancado-api',
    services: {},
    system: {
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      node_version: process.version,
      platform: process.platform
    }
  };

  try {
    // Testar MySQL
    const dbStart = Date.now();
    await database.query('SELECT 1 as test');
    health.services.mysql = {
      status: 'healthy',
      response_time_ms: Date.now() - dbStart
    };
  } catch (error) {
    health.services.mysql = {
      status: 'unhealthy',
      error: error.message
    };
    health.status = 'degraded';
  }

  try {
    // Testar Redis
    const redisStart = Date.now();
    await redis.get('health_check');
    health.services.redis = {
      status: 'healthy',
      response_time_ms: Date.now() - redisStart
    };
  } catch (error) {
    health.services.redis = {
      status: 'unhealthy',
      error: error.message
    };
    health.status = 'degraded';
  }

  health.response_time_ms = Date.now() - startTime;

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Health check simples (para load balancers)
router.get('/simple', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Métricas detalhadas
router.get('/metrics', async (req, res) => {
  try {
    const [users] = await Promise.all([
      database.query('SELECT COUNT(*) as count FROM users'),
    ]);

    const metrics = {
      timestamp: new Date().toISOString(),
      database: {
        total_users: users[0]?.count || 0,
        connections: 'N/A' // Poderia implementar query para mostrar conexões ativas
      },
      cache: {
        redis_info: 'Connected'
      },
      application: {
        uptime_seconds: process.uptime(),
        memory_usage_mb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        node_version: process.version
      }
    };

    res.json(metrics);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao obter métricas',
      message: error.message
    });
  }
});

module.exports = router;
