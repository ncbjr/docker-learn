const express = require('express');
const database = require('../config/database');
const redis = require('../config/redis');

const router = express.Router();

// Listar todos os cursos
router.get('/', async (req, res) => {
  try {
    // Tentar cache primeiro
    const cacheKey = 'courses:all';
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return res.json({
        ...JSON.parse(cached),
        from_cache: true
      });
    }

    const courses = await database.query(`
      SELECT 
        c.*,
        COUNT(u.id) as alunos_matriculados_atual
      FROM courses c
      LEFT JOIN users u ON u.curso = c.nome AND u.status = 'ativo'
      GROUP BY c.id
      ORDER BY c.nome
    `);

    const response = {
      total: courses.length,
      courses,
      timestamp: new Date().toISOString(),
      from_cache: false
    };

    // Cache por 15 minutos
    await redis.set(cacheKey, response, 900);

    res.json(response);
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    res.status(500).json({
      error: 'Erro ao buscar cursos',
      message: error.message
    });
  }
});

// Buscar curso por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const courses = await database.query(`
      SELECT 
        c.*,
        COUNT(u.id) as alunos_matriculados_atual
      FROM courses c
      LEFT JOIN users u ON u.curso = c.nome AND u.status = 'ativo'
      WHERE c.id = ?
      GROUP BY c.id
    `, [id]);

    if (courses.length === 0) {
      return res.status(404).json({
        error: 'Curso não encontrado'
      });
    }

    // Buscar alunos do curso
    const students = await database.query(`
      SELECT id, nome, email, data_cadastro, ultimo_acesso
      FROM users 
      WHERE curso = ? AND status = 'ativo'
      ORDER BY nome
    `, [courses[0].nome]);

    res.json({
      course: courses[0],
      students,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao buscar curso:', error);
    res.status(500).json({
      error: 'Erro ao buscar curso',
      message: error.message
    });
  }
});

// Estatísticas dos cursos
router.get('/stats/summary', async (req, res) => {
  try {
    const cacheKey = 'courses:stats';
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return res.json({
        ...JSON.parse(cached),
        from_cache: true
      });
    }

    const [totalCourses] = await database.query('SELECT COUNT(*) as total FROM courses');
    const [totalStudents] = await database.query("SELECT COUNT(*) as total FROM users WHERE status = 'ativo'");
    const [totalCapacity] = await database.query('SELECT SUM(vagas) as total FROM courses');

    const courseStats = await database.query(`
      SELECT 
        c.nome,
        c.vagas,
        COUNT(u.id) as matriculados,
        ROUND((COUNT(u.id) / c.vagas) * 100, 1) as ocupacao_percent
      FROM courses c
      LEFT JOIN users u ON u.curso = c.nome AND u.status = 'ativo'
      GROUP BY c.id, c.nome, c.vagas
      ORDER BY ocupacao_percent DESC
    `);

    const response = {
      summary: {
        total_courses: totalCourses.total,
        total_students: totalStudents.total,
        total_capacity: totalCapacity.total,
        occupancy_rate: Math.round((totalStudents.total / totalCapacity.total) * 100)
      },
      courses: courseStats,
      timestamp: new Date().toISOString(),
      from_cache: false
    };

    // Cache por 10 minutos
    await redis.set(cacheKey, response, 600);

    res.json(response);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      error: 'Erro ao buscar estatísticas',
      message: error.message
    });
  }
});

module.exports = router;
