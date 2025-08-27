-- Script de inicialização do banco de dados para a aula de Docker
-- Este arquivo é executado automaticamente quando o container MySQL sobe pela primeira vez

USE exemplo_db;

-- Criar tabela de usuários para demonstração
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    curso VARCHAR(100),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados de exemplo
INSERT INTO usuarios (nome, email, curso) VALUES
('Ana Silva', 'ana.silva@email.com', 'Engenharia de Software'),
('João Santos', 'joao.santos@email.com', 'Ciência da Computação'),
('Maria Oliveira', 'maria.oliveira@email.com', 'Sistemas de Informação'),
('Pedro Costa', 'pedro.costa@email.com', 'Engenharia de Software'),
('Carla Souza', 'carla.souza@email.com', 'Análise e Desenvolvimento');

-- Criar tabela de cursos
CREATE TABLE IF NOT EXISTS cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    duracao_semestres INT,
    coordenador VARCHAR(100)
);

INSERT INTO cursos (nome, duracao_semestres, coordenador) VALUES
('Engenharia de Software', 8, 'Prof. Dr. Carlos Lima'),
('Ciência da Computação', 8, 'Prof. Dra. Ana Ferreira'),
('Sistemas de Informação', 8, 'Prof. MSc. João Pereira'),
('Análise e Desenvolvimento', 6, 'Prof. Esp. Maria Santos');

-- Criar uma view para consulta fácil
CREATE VIEW usuarios_com_info AS
SELECT 
    u.id,
    u.nome,
    u.email,
    u.curso,
    u.data_cadastro,
    c.duracao_semestres,
    c.coordenador
FROM usuarios u
LEFT JOIN cursos c ON u.curso = c.nome;

-- Criar um usuário específico para a aplicação (opcional)
-- CREATE USER 'app_user'@'%' IDENTIFIED BY 'app_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON exemplo_db.* TO 'app_user'@'%';
-- FLUSH PRIVILEGES;

-- Inserir alguns logs para demonstrar que o script foi executado
INSERT INTO usuarios (nome, email, curso) VALUES 
('Docker User', 'docker@exemplo.com', 'DevOps e Containers');

-- Mostrar que tudo foi criado corretamente
SELECT 'Banco de dados inicializado com sucesso!' as status;
SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_cursos FROM cursos;
