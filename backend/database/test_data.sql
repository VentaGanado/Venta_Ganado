-- Script para insertar datos de prueba en el marketplace
-- Ejecutar después de crear las tablas con schema_min.sql

USE ganado_bovino;

-- Insertar usuarios de prueba (si no existen)
-- Nota: Las contraseñas deben ser hasheadas en producción
INSERT INTO usuarios (nombre, apellidos, email, password_hash, telefono, municipio, departamento) VALUES
('Juan', 'Pérez García', 'juan.perez@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456789', '3101234567', 'Tunja', 'Boyacá'),
('María', 'López Silva', 'maria.lopez@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456789', '3109876543', 'Duitama', 'Boyacá'),
('Carlos', 'Ramírez Torres', 'carlos.ramirez@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456789', '3205551234', 'Sogamoso', 'Boyacá')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Obtener IDs de usuarios (ajustar según los IDs reales en tu base de datos)
SET @usuario1 = (SELECT id FROM usuarios WHERE email = 'juan.perez@example.com' LIMIT 1);
SET @usuario2 = (SELECT id FROM usuarios WHERE email = 'maria.lopez@example.com' LIMIT 1);
SET @usuario3 = (SELECT id FROM usuarios WHERE email = 'carlos.ramirez@example.com' LIMIT 1);

-- Insertar bovinos de prueba
INSERT INTO bovinos (propietario_id, nombre, raza, sexo, edad, peso, ubicacion_municipio, ubicacion_departamento, estado_sanitario, descripcion) VALUES
(@usuario1, 'Torito', 'Angus', 'M', 3, 450, 'Tunja', 'Boyacá', 'Vacunas al día, excelente estado de salud', 'Toro de raza Angus en excelente condiciones. Ideal para reproducción.'),
(@usuario1, 'Luna', 'Holstein', 'F', 4, 520, 'Tunja', 'Boyacá', 'Vacunas al día', 'Vaca lechera de alta producción.'),
(@usuario2, 'Manchas', 'Normando', 'F', 2, 380, 'Duitama', 'Boyacá', 'Vacunas al día', 'Novilla de raza Normando, primera cría.'),
(@usuario2, 'Bravo', 'Brahman', 'M', 5, 680, 'Duitama', 'Boyacá', 'Vacunas al día, desparasitado', 'Toro reproductor de excelente genética.'),
(@usuario3, 'Estrella', 'Simmental', 'F', 3, 480, 'Sogamoso', 'Boyacá', 'Vacunas al día', 'Vaca productiva, buena para carne y leche.'),
(@usuario3, 'Campeón', 'Charolais', 'M', 4, 620, 'Sogamoso', 'Boyacá', 'Vacunas al día', 'Toro de carne de calidad superior.'),
(@usuario1, 'Princesa', 'Jersey', 'F', 2, 320, 'Tunja', 'Boyacá', 'Vacunas al día', 'Vaca lechera de raza Jersey.'),
(@usuario2, 'Rocky', 'Hereford', 'M', 3, 550, 'Duitama', 'Boyacá', 'Vacunas al día', 'Toro Hereford en excelentes condiciones.')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Obtener IDs de bovinos
SET @bovino1 = LAST_INSERT_ID();
SET @bovino2 = @bovino1 + 1;
SET @bovino3 = @bovino1 + 2;
SET @bovino4 = @bovino1 + 3;
SET @bovino5 = @bovino1 + 4;
SET @bovino6 = @bovino1 + 5;
SET @bovino7 = @bovino1 + 6;
SET @bovino8 = @bovino1 + 7;

-- Insertar publicaciones de prueba
INSERT INTO publicaciones (vendedor_id, bovino_id, titulo, descripcion, precio, activo) VALUES
(@usuario1, @bovino1, 'Toro Angus de Alta Calidad', 'Excelente toro Angus de 3 años, ideal para mejoramiento genético. Muy dócil y con excelente estructura.', 8500000, 1),
(@usuario1, @bovino2, 'Vaca Holstein Lechera', 'Vaca Holstein de alta producción lechera. Promedio de 25 litros diarios.', 6500000, 1),
(@usuario2, @bovino3, 'Novilla Normando Primera Cría', 'Hermosa novilla Normando lista para su primera cría. Excelente genética.', 4200000, 1),
(@usuario2, @bovino4, 'Toro Brahman Reproductor', 'Toro Brahman de 5 años con probada capacidad reproductora. Ideal para ganaderías de carne.', 12000000, 1),
(@usuario3, @bovino5, 'Vaca Simmental Doble Propósito', 'Vaca Simmental excelente para producción de carne y leche. Muy productiva.', 7800000, 1),
(@usuario3, @bovino6, 'Toro Charolais Premium', 'Toro Charolais de 4 años con excelente conformación cárnica. Premiado en feria ganadera.', 15000000, 1);

-- Verificar los datos insertados
SELECT 'Usuarios insertados:' as Info;
SELECT id, nombre, apellidos, email, municipio FROM usuarios WHERE email LIKE '%example.com';

SELECT 'Bovinos insertados:' as Info;
SELECT id, nombre, raza, sexo, edad, peso, ubicacion_municipio FROM bovinos ORDER BY id DESC LIMIT 8;

SELECT 'Publicaciones insertadas:' as Info;
SELECT p.id, p.titulo, p.precio, b.nombre as bovino, u.nombre as vendedor 
FROM publicaciones p
INNER JOIN bovinos b ON p.bovino_id = b.id
INNER JOIN usuarios u ON p.vendedor_id = u.id
ORDER BY p.id DESC LIMIT 6;
