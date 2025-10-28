

USE ganado_bovino;

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

DESCRIBE bovinos;

SELECT '✅ Tabla bovinos actualizada correctamente' as resultado;
