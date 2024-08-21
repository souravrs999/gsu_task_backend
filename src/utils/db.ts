import { Db, MongoClient, ServerApiVersion } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";
import { DB_NAME, TEST_ENV, DB_URI } from "./util";

dotenv.config();

if (!DB_NAME && !TEST_ENV) {
  throw new Error("Please provide DB name.");
}
if (!DB_URI && !TEST_ENV) {
  throw new Error("Please provide MongoDB connection string.");
}

let _db: Db;
let _client: MongoClient;
let _mongoServer: MongoMemoryServer;

export const connect = async () => {
  if (_db) return _db;

  try {
    if (TEST_ENV) {
      _mongoServer = await MongoMemoryServer.create();
      const uri = _mongoServer.getUri();
      _client = new MongoClient(uri);
    } else {
      _client = new MongoClient(DB_URI!, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        maxPoolSize: 10,
      });
    }

    await _client.connect();
    console.log("DB connected.");

    _db = _client.db(TEST_ENV ? "test" : DB_NAME);
    return _db;
  } catch (err) {
    console.error("Failed to connect to DB.", err);
    throw err;
  }
};

export const close = async () => {
  if (_client) {
    await _client.close();
    console.log("DB connection closed.");
  }
  if (_mongoServer) await _mongoServer.stop();
};

export { _db as db };
