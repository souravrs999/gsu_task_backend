"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const db_1 = require("./utils/db");
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const util_1 = require("./utils/util");
if (!util_1.APPLICATION_PORT) {
    throw new Error("Please expose PORT to env.");
}
async function main() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use((0, compression_1.default)());
    app.use((0, morgan_1.default)("tiny"));
    app.use("/api", task_routes_1.default);
    app.use("/api", auth_routes_1.default);
    app.use("/api", user_routes_1.default);
    await (0, db_1.connect)();
    const server = app.listen(util_1.APPLICATION_PORT, () => console.log(`Server running on port ${util_1.APPLICATION_PORT}`));
    const shutdown = async () => {
        console.log("Closing HTTP server.");
        server.close(async () => {
            await (0, db_1.close)();
            process.exit(0);
        });
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}
main();
