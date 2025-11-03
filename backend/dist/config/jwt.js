"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeVerifyRefreshToken = exports.safeVerifyAccessToken = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = exports.JWT_REFRESH_EXPIRES_IN = exports.JWT_REFRESH_SECRET = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = void 0;
const jwt = __importStar(require("jsonwebtoken"));
exports.JWT_SECRET = process.env.JWT_SECRET ?? "change_this_secret_in_production";
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "15m";
exports.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "change_refresh_secret";
exports.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";
// Helper casts to avoid repetir los as everywhere
const accessSecret = exports.JWT_SECRET;
const refreshSecret = exports.JWT_REFRESH_SECRET;
const accessSignOptions = { expiresIn: exports.JWT_EXPIRES_IN };
const refreshSignOptions = {
    expiresIn: exports.JWT_REFRESH_EXPIRES_IN,
};
const generateAccessToken = (payload) => {
    return jwt.sign(payload, accessSecret, accessSignOptions);
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, refreshSecret, refreshSignOptions);
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    return jwt.verify(token, accessSecret);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return jwt.verify(token, refreshSecret);
};
exports.verifyRefreshToken = verifyRefreshToken;
/**
 * Opcional: funciones seguras que envuelven verify con try/catch y devuelven null si inválido
 */
const safeVerifyAccessToken = (token) => {
    try {
        return (0, exports.verifyAccessToken)(token);
    }
    catch (err) {
        return null;
    }
};
exports.safeVerifyAccessToken = safeVerifyAccessToken;
const safeVerifyRefreshToken = (token) => {
    try {
        return (0, exports.verifyRefreshToken)(token);
    }
    catch (err) {
        return null;
    }
};
exports.safeVerifyRefreshToken = safeVerifyRefreshToken;
