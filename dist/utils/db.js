"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.close = exports.connect = void 0;
const mongodb_1 = require("mongodb");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const dotenv_1 = __importDefault(require("dotenv"));
const util_1 = require("./util");
dotenv_1.default.config();
if (!util_1.DB_NAME && !util_1.TEST_ENV) {
    throw new Error("Please provide DB name.");
}
if (!util_1.DB_URI && !util_1.TEST_ENV) {
    throw new Error("Please provide MongoDB connection string.");
}
let _db;
let _client;
let _mongoServer;
const connect = async () => {
    if (_db)
        return _db;
    try {
        if (util_1.TEST_ENV) {
            _mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
            const uri = _mongoServer.getUri();
            _client = new mongodb_1.MongoClient(uri);
        }
        else {
            _client = new mongodb_1.MongoClient(util_1.DB_URI, {
                serverApi: {
                    version: mongodb_1.ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                },
                maxPoolSize: 10,
            });
        }
        await _client.connect();
        console.log("DB connected.");
        exports.db = _db = _client.db(util_1.TEST_ENV ? "test" : util_1.DB_NAME);
        return _db;
    }
    catch (err) {
        console.error("Failed to connect to DB.", err);
        throw err;
    }
};
exports.connect = connect;
const close = async () => {
    if (_client) {
        await _client.close();
        console.log("DB connection closed.");
    }
    if (_mongoServer)
        await _mongoServer.stop();
};
exports.close = close;
