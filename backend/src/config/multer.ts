// ============================================
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Crear directorios si no existen
const uploadDirs = ['uploads/bovinos', 'uploads/documentos', 'uploads/usuarios'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/';
    if (file.fieldname === 'foto_bovino') folder += 'bovinos/';
    else if (file.fieldname === 'documento') folder += 'documentos/';
    else if (file.fieldname === 'foto_perfil') folder += 'usuarios/';
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de archivos
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedImages = /jpeg|jpg|png/;
  const allowedDocs = /pdf/;
  
  const extname = path.extname(file.originalname).toLowerCase();
  
  if (file.fieldname === 'documento') {
    if (allowedDocs.test(extname)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'), false);
    }
  } else {
    if (allowedImages.test(extname)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes JPG/PNG'), false);
    }
  }
};

export const uploadFotoBovino = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export const uploadDocumento = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

export const uploadFotoPerfil = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});
