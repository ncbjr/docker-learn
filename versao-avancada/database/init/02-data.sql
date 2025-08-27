-- Dados iniciais para demonstração
USE escola_db;

-- Inserir cursos
INSERT INTO courses (nome, duracao_semestres, coordenador, modalidade, vagas, status) VALUES
('Engenharia de Software', 8, 'Prof. Dr. Carlos Lima', 'Presencial', 40, 'ativo'),
('Ciência da Computação', 8, 'Prof. Dra. Ana Ferreira', 'Presencial', 50, 'ativo'),
('Sistemas de Informação', 8, 'Prof. MSc. João Pereira', 'Híbrido', 35, 'ativo'),
('Análise e Desenvolvimento de Sistemas', 6, 'Prof. Esp. Maria Santos', 'EAD', 60, 'ativo'),
('Segurança da Informação', 6, 'Prof. Dr. Roberto Silva', 'Híbrido', 30, 'ativo'),
('Inteligência Artificial', 8, 'Prof. Dra. Patricia Costa', 'Presencial', 25, 'ativo')
ON DUPLICATE KEY UPDATE 
    duracao_semestres = VALUES(duracao_semestres),
    coordenador = VALUES(coordenador),
    modalidade = VALUES(modalidade),
    vagas = VALUES(vagas);

-- Inserir usuários de exemplo
INSERT INTO users (nome, email, curso, status, data_cadastro, ultimo_acesso) VALUES
-- Engenharia de Software
('Ana Silva Santos', 'ana.silva@email.com', 'Engenharia de Software', 'ativo', '2024-01-15 10:30:00', '2024-01-20 14:22:00'),
('Pedro Costa Lima', 'pedro.costa@email.com', 'Engenharia de Software', 'ativo', '2024-01-08 16:45:00', '2024-01-20 09:15:00'),
('Julia Oliveira', 'julia.oliveira@email.com', 'Engenharia de Software', 'ativo', '2024-01-12 09:20:00', '2024-01-19 16:30:00'),
('Rafael Mendes', 'rafael.mendes@email.com', 'Engenharia de Software', 'ativo', '2024-01-03 14:10:00', '2024-01-20 11:45:00'),

-- Ciência da Computação
('João Santos Pereira', 'joao.santos@email.com', 'Ciência da Computação', 'ativo', '2024-01-12 14:22:00', '2024-01-20 08:45:00'),
('Mariana Ferreira', 'mariana.ferreira@email.com', 'Ciência da Computação', 'ativo', '2024-01-07 11:30:00', '2024-01-20 13:20:00'),
('Lucas Rodrigues', 'lucas.rodrigues@email.com', 'Ciência da Computação', 'ativo', '2024-01-09 15:45:00', '2024-01-19 17:10:00'),
('Fernanda Lima', 'fernanda.lima@email.com', 'Ciência da Computação', 'inativo', '2024-01-05 08:15:00', '2024-01-18 12:30:00'),

-- Sistemas de Informação
('Maria Oliveira Costa', 'maria.oliveira@email.com', 'Sistemas de Informação', 'ativo', '2024-01-10 09:15:00', '2024-01-20 10:20:00'),
('Carlos Eduardo', 'carlos.eduardo@email.com', 'Sistemas de Informação', 'ativo', '2024-01-14 13:40:00', '2024-01-19 15:50:00'),
('Beatriz Almeida', 'beatriz.almeida@email.com', 'Sistemas de Informação', 'ativo', '2024-01-06 16:20:00', '2024-01-20 07:30:00'),

-- Análise e Desenvolvimento
('Carla Souza Dias', 'carla.souza@email.com', 'Análise e Desenvolvimento de Sistemas', 'ativo', '2024-01-05 11:20:00', '2024-01-19 15:10:00'),
('Diego Martins', 'diego.martins@email.com', 'Análise e Desenvolvimento de Sistemas', 'ativo', '2024-01-11 10:05:00', '2024-01-20 12:40:00'),
('Amanda Silva', 'amanda.silva@email.com', 'Análise e Desenvolvimento de Sistemas', 'ativo', '2024-01-13 14:55:00', '2024-01-19 18:20:00'),
('Thiago Santos', 'thiago.santos@email.com', 'Análise e Desenvolvimento de Sistemas', 'suspenso', '2024-01-02 09:30:00', '2024-01-15 16:45:00'),

-- Segurança da Informação
('Isabella Costa', 'isabella.costa@email.com', 'Segurança da Informação', 'ativo', '2024-01-16 08:45:00', '2024-01-20 11:15:00'),
('Gabriel Oliveira', 'gabriel.oliveira@email.com', 'Segurança da Informação', 'ativo', '2024-01-04 12:30:00', '2024-01-19 14:25:00'),

-- Inteligência Artificial
('Sophia Lima', 'sophia.lima@email.com', 'Inteligência Artificial', 'ativo', '2024-01-17 15:10:00', '2024-01-20 09:50:00'),
('Mateus Ferreira', 'mateus.ferreira@email.com', 'Inteligência Artificial', 'ativo', '2024-01-01 10:20:00', '2024-01-20 16:30:00'),

-- Usuário especial para demonstração Docker
('Docker Admin', 'docker@exemplo.com', 'Engenharia de Software', 'ativo', NOW(), NOW()),
('API Tester', 'api@teste.com', 'Ciência da Computação', 'ativo', NOW(), NOW())

ON DUPLICATE KEY UPDATE 
    nome = VALUES(nome),
    curso = VALUES(curso),
    status = VALUES(status);

-- Inserir algumas matrículas para demonstrar relacionamentos
INSERT INTO enrollments (user_id, course_id, status, data_matricula) 
SELECT 
    u.id,
    c.id,
    'ativa',
    u.data_cadastro
FROM users u
JOIN courses c ON u.curso = c.nome
WHERE u.status = 'ativo'
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- Inserir logs de acesso para demonstração
INSERT INTO access_logs (user_id, ip_address, user_agent, action, timestamp) 
SELECT 
    id,
    '172.25.0.1',
    'Mozilla/5.0 (Docker Container)',
    'login',
    ultimo_acesso
FROM users 
WHERE status = 'ativo'
LIMIT 10;

-- Inserir mais logs variados
INSERT INTO access_logs (user_id, ip_address, action, timestamp) VALUES
((SELECT id FROM users WHERE email = 'ana.silva@email.com'), '172.25.0.2', 'view_profile', '2024-01-20 10:15:00'),
((SELECT id FROM users WHERE email = 'joao.santos@email.com'), '172.25.0.3', 'update_profile', '2024-01-20 11:30:00'),
((SELECT id FROM users WHERE email = 'maria.oliveira@email.com'), '172.25.0.4', 'view_courses', '2024-01-20 12:45:00'),
((SELECT id FROM users WHERE email = 'pedro.costa@email.com'), '172.25.0.5', 'logout', '2024-01-20 13:20:00'),
((SELECT id FROM users WHERE email = 'carla.souza@email.com'), '172.25.0.6', 'login', '2024-01-20 14:10:00');

-- Atualizar algumas notas finais para demonstração
UPDATE enrollments 
SET nota_final = ROUND(6.0 + (RAND() * 4.0), 2)
WHERE status = 'ativa' 
LIMIT 5;

-- Criar alguns usuários com senhas hash para demonstrar autenticação
-- Senha padrão: "123456"
UPDATE users 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMye.4IZGWfJKmOH8YnFHKFCEcLo9J.k6vu'
WHERE email IN ('docker@exemplo.com', 'api@teste.com', 'ana.silva@email.com');

-- Estatísticas finais
SELECT 
    'Dados inseridos com sucesso!' as status,
    (SELECT COUNT(*) FROM users) as total_usuarios,
    (SELECT COUNT(*) FROM courses) as total_cursos,
    (SELECT COUNT(*) FROM enrollments) as total_matriculas,
    (SELECT COUNT(*) FROM access_logs) as total_logs;
