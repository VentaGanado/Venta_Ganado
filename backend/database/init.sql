
CREATE DATABASE IF NOT EXISTS ganado_bovino CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ganado_bovino;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150),
    email VARCHAR(200) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    municipio VARCHAR(100),
    departamento VARCHAR(100) DEFAULT 'Boyacá',
    foto_perfil VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo TINYINT(1) DEFAULT 1,
    refresh_token TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bovinos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    propietario_id INT NOT NULL,
    nombre VARCHAR(150),
    raza VARCHAR(100) NOT NULL,
    sexo ENUM('M','F') DEFAULT 'M',
    edad INT,
    peso DECIMAL(8,2),
    ubicacion_municipio VARCHAR(100),
    ubicacion_departamento VARCHAR(100) DEFAULT 'Boyacá',
    estado_sanitario VARCHAR(255),
    foto_principal VARCHAR(255),
    registro_fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo TINYINT(1) DEFAULT 1,
    descripcion TEXT,
    FOREIGN KEY (propietario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS publicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendedor_id INT NOT NULL,
    bovino_id INT NOT NULL,
    titulo VARCHAR(255),
    descripcion TEXT,
    precio DECIMAL(12,2),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (bovino_id) REFERENCES bovinos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS transacciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comprador_id INT,
    vendedor_id INT,
    publicacion_id INT,
    monto DECIMAL(12,2) NOT NULL,
    estado ENUM('pendiente','confirmada','cancelada') DEFAULT 'pendiente',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comprador_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_bovinos_propietario ON bovinos(propietario_id);
CREATE INDEX idx_publicaciones_vendedor ON publicaciones(vendedor_id);


CREATE TABLE IF NOT EXISTS bovino_fotos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bovino_id INT NOT NULL,
    ruta_foto VARCHAR(255) NOT NULL,
    es_principal TINYINT(1) DEFAULT 0,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bovino_id) REFERENCES bovinos(id) ON DELETE CASCADE,
    INDEX idx_bovino_fotos (bovino_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS historial_sanitario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bovino_id INT NOT NULL,
    fecha DATE NOT NULL,
    tipo_registro VARCHAR(100) NOT NULL,
    descripcion TEXT,
    veterinario VARCHAR(200),
    costo DECIMAL(10,2),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bovino_id) REFERENCES bovinos(id) ON DELETE CASCADE,
    INDEX idx_historial_sanitario (bovino_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS historial_reproductivo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bovino_id INT NOT NULL,
    fecha DATE NOT NULL,
    tipo_evento VARCHAR(100) NOT NULL,
    descripcion TEXT,
    resultado VARCHAR(200),
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bovino_id) REFERENCES bovinos(id) ON DELETE CASCADE,
    INDEX idx_historial_reproductivo (bovino_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'ganado_bovino' 
    AND TABLE_NAME = 'bovinos' 
    AND COLUMN_NAME = 'raza');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE bovinos ADD COLUMN raza VARCHAR(100) NOT NULL DEFAULT "Sin especificar" AFTER nombre',
    'SELECT "La columna raza ya existe" as mensaje');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'ganado_bovino' 
    AND TABLE_NAME = 'bovinos' 
    AND COLUMN_NAME = 'ubicacion_municipio');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE bovinos ADD COLUMN ubicacion_municipio VARCHAR(100) AFTER peso',
    'SELECT "La columna ubicacion_municipio ya existe" as mensaje');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'ganado_bovino' 
    AND TABLE_NAME = 'bovinos' 
    AND COLUMN_NAME = 'ubicacion_departamento');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE bovinos ADD COLUMN ubicacion_departamento VARCHAR(100) DEFAULT "Boyacá" AFTER ubicacion_municipio',
    'SELECT "La columna ubicacion_departamento ya existe" as mensaje');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'ganado_bovino' 
    AND TABLE_NAME = 'bovinos' 
    AND COLUMN_NAME = 'estado_sanitario');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE bovinos ADD COLUMN estado_sanitario VARCHAR(255) AFTER ubicacion_departamento',
    'SELECT "La columna estado_sanitario ya existe" as mensaje');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'ganado_bovino' 
    AND TABLE_NAME = 'bovinos' 
    AND COLUMN_NAME = 'foto_principal');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE bovinos ADD COLUMN foto_principal VARCHAR(255) AFTER estado_sanitario',
    'SELECT "La columna foto_principal ya existe" as mensaje');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;


UPDATE bovinos
SET foto_principal = REPLACE(foto_principal, '/uploads/', '')
WHERE foto_principal LIKE '/uploads/%';

UPDATE bovino_fotos
SET ruta_foto = REPLACE(ruta_foto, '/uploads/', '')
WHERE ruta_foto LIKE '/uploads/%';

UPDATE bovinos
SET foto_principal = TRIM(LEADING '/' FROM foto_principal)
WHERE foto_principal LIKE '/%';

UPDATE bovino_fotos
SET ruta_foto = TRIM(LEADING '/' FROM ruta_foto)
WHERE ruta_foto LIKE '/%';

