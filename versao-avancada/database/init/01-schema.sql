-- Schema inicial para o sistema escolar
-- Este arquivo é executado automaticamente quando o container MySQL sobe pela primeira vez

USE escola_db;

-- Tabela de usuários/alunos
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NULL, -- Para autenticação (opcional)
    curso VARCHAR(100) NOT NULL,
    status ENUM('ativo', 'inativo', 'suspenso') DEFAULT 'ativo',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_curso (curso),
    INDEX idx_status (status),
    INDEX idx_data_cadastro (data_cadastro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de cursos
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    duracao_semestres INT NOT NULL,
    coordenador VARCHAR(100) NOT NULL,
    modalidade ENUM('Presencial', 'EAD', 'Híbrido') DEFAULT 'Presencial',
    vagas INT NOT NULL DEFAULT 0,
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_nome (nome),
    INDEX idx_modalidade (modalidade),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de logs de acesso (para demonstrar relacionamentos)
CREATE TABLE IF NOT EXISTS access_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    action VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de matrículas (relacionamento many-to-many)
CREATE TABLE IF NOT EXISTS enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    data_matricula TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('ativa', 'trancada', 'concluida', 'cancelada') DEFAULT 'ativa',
    nota_final DECIMAL(4,2) NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (user_id, course_id),
    INDEX idx_user_id (user_id),
    INDEX idx_course_id (course_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS system_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir configurações padrão
INSERT INTO system_config (config_key, config_value, description) VALUES
('app_name', 'Sistema Escolar Docker', 'Nome da aplicação'),
('app_version', '1.0.0', 'Versão atual da aplicação'),
('maintenance_mode', 'false', 'Modo de manutenção ativo/inativo'),
('max_students_per_course', '50', 'Número máximo de alunos por curso'),
('registration_open', 'true', 'Matrículas abertas/fechadas')
ON DUPLICATE KEY UPDATE config_value = VALUES(config_value);

-- Views úteis para relatórios
CREATE OR REPLACE VIEW course_statistics AS
SELECT 
    c.id,
    c.nome as curso_nome,
    c.vagas,
    c.modalidade,
    c.coordenador,
    COUNT(u.id) as alunos_matriculados,
    ROUND((COUNT(u.id) / c.vagas) * 100, 2) as ocupacao_percentual,
    c.status
FROM courses c
LEFT JOIN users u ON u.curso = c.nome AND u.status = 'ativo'
GROUP BY c.id, c.nome, c.vagas, c.modalidade, c.coordenador, c.status;

CREATE OR REPLACE VIEW user_activity AS
SELECT 
    u.id,
    u.nome,
    u.email,
    u.curso,
    u.status,
    u.data_cadastro,
    u.ultimo_acesso,
    DATEDIFF(NOW(), u.ultimo_acesso) as dias_sem_acesso,
    COUNT(al.id) as total_acessos
FROM users u
LEFT JOIN access_logs al ON al.user_id = u.id
GROUP BY u.id, u.nome, u.email, u.curso, u.status, u.data_cadastro, u.ultimo_acesso;

-- Triggers para auditoria
DELIMITER $$

CREATE TRIGGER user_update_log 
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO access_logs (user_id, action, timestamp) 
        VALUES (NEW.id, CONCAT('Status alterado de ', OLD.status, ' para ', NEW.status), NOW());
    END IF;
END$$

DELIMITER ;

-- Criar índices para performance
CREATE INDEX idx_users_curso_status ON users(curso, status);
CREATE INDEX idx_access_logs_user_timestamp ON access_logs(user_id, timestamp);

-- Comentários nas tabelas para documentação
ALTER TABLE users COMMENT = 'Tabela de usuários/estudantes do sistema';
ALTER TABLE courses COMMENT = 'Tabela de cursos disponíveis';
ALTER TABLE enrollments COMMENT = 'Tabela de matrículas (relacionamento users-courses)';
ALTER TABLE access_logs COMMENT = 'Log de acessos e ações dos usuários';
ALTER TABLE system_config COMMENT = 'Configurações gerais do sistema';

SELECT 'Schema criado com sucesso!' as status;
