"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFotoPerfil = exports.uploadDocumento = exports.uploadFotoBovino = void 0;
// ============================================
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Crear directorios si no existen
const uploadDirs = ['uploads/bovinos', 'uploads/documentos', 'uploads/usuarios'];
uploadDirs.forEach(dir => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
});
// Configuración de almacenamiento
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'uploads/';
        if (file.fieldname === 'fotos' || file.fieldname === 'foto_bovino')
            folder += 'bovinos/';
        else if (file.fieldname === 'documento')
            folder += 'documentos/';
        else if (file.fieldname === 'foto_perfil')
            folder += 'usuarios/';
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
// Filtro de archivos
const fileFilter = (req, file, cb) => {
    const allowedImages = /jpeg|jpg|png/;
    const allowedDocs = /pdf/;
    const extname = path_1.default.extname(file.originalname).toLowerCase();
    if (file.fieldname === 'documento') {
        if (allowedDocs.test(extname)) {
            cb(null, true);
        }
        else {
            cb(new Error('Solo se permiten archivos PDF'), false);
        }
    }
    else {
        if (allowedImages.test(extname)) {
            cb(null, true);
        }
        else {
            cb(new Error('Solo se permiten imágenes JPG/PNG'), false);
        }
    }
};
exports.uploadFotoBovino = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
exports.uploadDocumento = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
exports.uploadFotoPerfil = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});
