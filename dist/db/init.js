"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ingredient_1 = __importDefault(require("./models/ingredient"));
const isDev = process.env.NODE_ENV === "development";
const dbInit = () => {
    ingredient_1.default.sync({ alter: isDev });
};
exports.default = dbInit;
