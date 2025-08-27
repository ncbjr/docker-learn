const express = require('express');
const database = require('../config/database');
const redis = require('../config/redis');

const router = express.Router();

// Listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Tentar buscar do cache primeiro
    const cacheKey = `users:page:${page}:limit:${limit}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return res.json({
        ...JSON.parse(cached),
        from_cache: true
      });
    }

    // Buscar do banco
    const users = await database.query(
      `SELECT id, nome, email, curso, status, data_cadastro, ultimo_acesso 
       FROM users 
       ORDER BY data_cadastro DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [totalResult] = await database.query('SELECT COUNT(*) as total FROM users');
    const total = totalResult.total;

    const response = {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        has_next: page < Math.ceil(total / limit),
        has_prev: page > 1
      },
      timestamp: new Date().toISOString(),
      from_cache: false
    };

    // Salvar no cache por 5 minutos
    await redis.set(cacheKey, response, 300);

    res.json(response);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      error: 'Erro ao buscar usuários',
      message: error.message
    });
  }
});

// Buscar usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Tentar cache primeiro
    const cacheKey = `user:${id}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return res.json({
        ...JSON.parse(cached),
        from_cache: true
      });
    }

    const users = await database.query(
      'SELECT id, nome, email, curso, status, data_cadastro, ultimo_acesso FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    const user = users[0];

    // Cache por 10 minutos
    await redis.set(cacheKey, { user }, 600);

    res.json({ user, from_cache: false });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      error: 'Erro ao buscar usuário',
      message: error.message
    });
  }
});

// Criar novo usuário
router.post('/', async (req, res) => {
  try {
    const { nome, email, curso } = req.body;

    // Validação básica
    if (!nome || !email || !curso) {
      return res.status(400).json({
        error: 'Campos obrigatórios: nome, email, curso'
      });
    }

    // Verificar se email já existe
    const existingUsers = await database.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error: 'Email já está em uso'
      });
    }

    // Inserir usuário
    const result = await database.query(
      `INSERT INTO users (nome, email, curso, status, data_cadastro, ultimo_acesso) 
       VALUES (?, ?, ?, 'ativo', NOW(), NOW())`,
      [nome, email, curso]
    );

    // Limpar cache relacionado
    const cachePattern = 'users:page:*';
    // Note: Em produção, você implementaria uma limpeza mais sofisticada do cache

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user_id: result.insertId,
      user: {
        id: result.insertId,
        nome,
        email,
        curso,
        status: 'ativo'
      }
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      error: 'Erro ao criar usuário',
      message: error.message
    });
  }
});

// Atualizar usuário
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, curso, status } = req.body;

    // Verificar se usuário existe
    const existingUsers = await database.query(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    // Atualizar usuário
    await database.query(
      `UPDATE users 
       SET nome = COALESCE(?, nome),
           email = COALESCE(?, email),
           curso = COALESCE(?, curso),
           status = COALESCE(?, status),
           ultimo_acesso = NOW()
       WHERE id = ?`,
      [nome, email, curso, status, id]
    );

    // Limpar cache
    await redis.del(`user:${id}`);

    res.json({
      message: 'Usuário atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      error: 'Erro ao atualizar usuário',
      message: error.message
    });
  }
});

// Deletar usuário
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await database.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    // Limpar cache
    await redis.del(`user:${id}`);

    res.json({
      message: 'Usuário deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({
      error: 'Erro ao deletar usuário',
      message: error.message
    });
  }
});

module.exports = router;
