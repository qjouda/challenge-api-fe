"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
dotenv_1.default.config();
const db_1 = require("./db");
const app = (0, express_1.default)();
const port = process.env.PORT;
const jsonParser = body_parser_1.default.json();
const oneDay = 1000 * 60 * 60 * 24;
app.use(jsonParser);
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST"],
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use((0, cookie_parser_1.default)());
//session middleware
app.use((0, express_session_1.default)({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: true,
}));
app.use(passport_1.default.session());
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
// authn user
passport_1.default.use(new passport_local_1.Strategy(function (username, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield db_1.User.findOne({ where: { username, password } });
            if (!user) {
                done(null, false);
                return;
            }
            done(null, {
                id: user.id,
                username: user.username,
                isAdmin: user.isAdmin,
            });
        }
        catch (error) {
            done(error);
        }
    });
}));
app.post("/login", passport_1.default.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
}));
app.get("/user", (req, res) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).json({ error: "Unauthorized " });
        return;
    }
    res.json({ status: "OK", user: req.user });
});
app.post("/ingredient", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated()) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).json({ error: "Unauthorized " });
        return;
    }
    try {
        const i = yield db_1.Ingredient.create({
            name: req.body.name,
            properties: req.body.properties,
        });
        res.json(i);
    }
    catch (error) {
        res.status(http_status_codes_1.default.BAD_REQUEST);
    }
}));
app.get("/ingredients", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // apply filters if passed
        let where = {};
        if (req.body.nameFilter) {
            where.name = {
                $like: `%${req.body.nameFilter}%`,
            };
        }
        if (req.body.propertyFilter) {
            where.properties = {
                $like: `%${req.body.propertyFilter}%`,
            };
        }
        // find
        const i = yield db_1.Ingredient.findAll({
            where: Object.assign({}, where),
        });
        res.json(i);
    }
    catch (error) {
        res.status(http_status_codes_1.default.BAD_REQUEST);
    }
}));
app.post("/ingredients", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.Ingredient.destroy({ where: { id: req.body.id } });
        res.status(http_status_codes_1.default.OK);
    }
    catch (error) {
        res.status(http_status_codes_1.default.BAD_REQUEST);
    }
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
