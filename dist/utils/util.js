"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.JWT_SECRET = exports.APPLICATION_PORT = exports.DB_URI = exports.DB_NAME = exports.TEST_ENV = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.TEST_ENV = process.env.NODE_ENV === "test";
exports.DB_NAME = process.env.DB_NAME;
exports.DB_URI = process.env.MONGODB_ATLAS_URI;
exports.APPLICATION_PORT = process.env.PORT || "5000";
exports.JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const hashPassword = async (passwordStrnging) => {
    const hashed = await bcryptjs_1.default.hash(passwordStrnging, 10);
    return hashed;
};
exports.hashPassword = hashPassword;
