"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchema = exports.createSchema = void 0;
const zod_1 = require("zod");
exports.createSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title should be atleast 3 characters."),
    description: zod_1.z.string().optional(),
    completed: zod_1.z.boolean().default(false),
});
exports.updateSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title should be atleast 3 characters.").optional(),
    description: zod_1.z.string().optional(),
    completed: zod_1.z.boolean().default(false).optional(),
});
