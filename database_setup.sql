-- Script para crear las tablas necesarias para la API
-- Base de datos: practica_nodejs

-- Crear tabla perfil_usuario
CREATE TABLE IF NOT EXISTS tipo_usuario (
    idint INT PRIMARY KEY AUTO_INCREMENT,
    perfil VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla usuario
CREATE TABLE IF NOT EXISTS usuario (
    idint INT PRIMARY KEY AUTO_INCREMENT,
    tipo_documento VARCHAR(45) NOT NULL,
    numero_documento INT NOT NULL UNIQUE,
    primer_nombre VARCHAR(45) NOT NULL,
    segundo_nombre VARCHAR(45),
    primer_apellido VARCHAR(45) NOT NULL,
    segundo_aéllido VARCHAR(45),
    direccion_correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    numero_celular VARCHAR(15) NOT NULL,
    foto_perfil VARCHAR(255),
    estado VARCHAR(20) NOT NULL,
    clave VARCHAR(255),
    PERFIL_USUARIO_id INT NOT NULL, UNIQUE
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idint) REFERENCES usuario(idint) ON DELETE RESTRICT,
    FOREIGN KEY (PERFIL_USUARIO_id) REFERENCES perfil_usuario(idint) ON DELETE RESTRICT,
);

-- Insertar datos de ejemplo para tipo_usuario
-- INSERT INTO tipo_usuario (descripcion) VALUES
-- ('Administrador'),
-- ('Usuario'),
-- ('Moderador'),
-- ('Invitado')
-- ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- Insertar datos de ejemplo para usuario
-- INSERT INTO usuario (cod_tipo_usu, clave, estado, nombre, apellido) VALUES
-- (1, 'admin123', 1, 'Admin', 'Sistema'),
-- (2, 'user123', 1, 'Usuario', 'Ejemplo'),
-- (3, 'mod123', 1, 'Moderador', 'Ejemplo')
-- ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Mostrar las tablas creadas
-- SHOW TABLES;

-- Describir estructura de las tablas
DESCRIBE tipo_usuario;
DESCRIBE usuario;

-- Mostrar datos insertados
SELECT 'tipo_usuario' as tabla, COUNT(*) as registros FROM perfil_usuario
UNION ALL
SELECT 'usuario' as tabla, COUNT(*) as registros FROM usuario;