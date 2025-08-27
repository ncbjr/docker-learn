const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../config/database');
const redis = require('../config/redis');

const router = express.Router();

// Middleware para verificar JWT
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  try {
    // Verificar se token está na blacklist
    const blacklisted = await redis.exists(`blacklist:${token}`);
    if (blacklisted) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'meu_jwt_secreto_super_seguro');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido' });
  }
};

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const users = await database.query(
      'SELECT id, nome, email, password_hash, status FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        error: 'Credenciais inválidas'
      });
    }

    const user = users[0];

    if (user.status !== 'ativo') {
      return res.status(401).json({
        error: 'Conta inativa'
      });
    }

    // Verificar senha (se existir hash)
    if (user.password_hash) {
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({
          error: 'Credenciais inválidas'
        });
      }
    } else {
      // Para demo, aceitar qualquer senha se não houver hash
      console.log('⚠️  Usuário sem senha hash - modo demo');
    }

    // Gerar JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        nome: user.nome 
      },
      process.env.JWT_SECRET || 'meu_jwt_secreto_super_seguro',
      { expiresIn: '24h' }
    );

    // Atualizar último acesso
    await database.query(
      'UPDATE users SET ultimo_acesso = NOW() WHERE id = ?',
      [user.id]
    );

    // Salvar sessão no Redis
    await redis.set(`session:${user.id}`, {
      token,
      login_time: new Date().toISOString(),
      ip: req.ip
    }, 86400); // 24 horas

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    
    // Adicionar token à blacklist
    await redis.set(`blacklist:${token}`, true, 86400);
    
    // Remover sessão
    await redis.del(`session:${req.user.id}`);

    res.json({
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Verificar token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user: req.user
  });
});

// Registrar novo usuário (para demo)
router.post('/register', async (req, res) => {
  try {
    const { nome, email, password, curso } = req.body;

    if (!nome || !email || !password || !curso) {
      return res.status(400).json({
        error: 'Todos os campos são obrigatórios'
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

    // Hash da senha
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Inserir usuário
    const result = await database.query(
      `INSERT INTO users (nome, email, password_hash, curso, status, data_cadastro, ultimo_acesso) 
       VALUES (?, ?, ?, ?, 'ativo', NOW(), NOW())`,
      [nome, email, passwordHash, curso]
    );

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user_id: result.insertId
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
