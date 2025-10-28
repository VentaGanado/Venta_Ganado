-- Esquema mínimo para la aplicación Venta_Ganado
-- Crea la base de datos y tablas básicas (usuarios, bovinos, publicaciones, transacciones)
-- Guarda este archivo en backend/database/schema_min.sql y ejecútalo con:
-- Get-Content .\database\schema_min.sql | mysql -u root -p

CREATE DATABASE IF NOT EXISTS ganado_bovino CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ganado_bovino;

-- Tabla usuarios (basada en usuario.model.ts)
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

-- Tabla bovinos (esquema básico)
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

-- Tabla publicaciones (básica)
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

-- Tabla transacciones (básica)
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

-- Indices útiles
-- Crear índices (sin IF NOT EXISTS por compatibilidad con todas las versiones de MySQL)
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_bovinos_propietario ON bovinos(propietario_id);
CREATE INDEX idx_publicaciones_vendedor ON publicaciones(vendedor_id);

-- Fin del esquema mínimo
