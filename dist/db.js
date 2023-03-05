"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ingredient = exports.User = void 0;
const sequelize_1 = require("sequelize");
if (!process.env.DB_NAME ||
    !process.env.DB_USER ||
    !process.env.DB_PASSWORD ||
    !process.env.DB_HOST) {
    console.error("DB configs must be configuired in .env file, see .env_example");
    process.exit();
}
const sequelize = new sequelize_1.Sequelize((_a = process.env.DB_NAME) !== null && _a !== void 0 ? _a : "", (_b = process.env.DB_USER) !== null && _b !== void 0 ? _b : "", (_c = process.env.DB_PASSWORD) !== null && _c !== void 0 ? _c : "", {
    host: (_d = process.env.DB_HOST) !== null && _d !== void 0 ? _d : "",
    dialect: "mysql",
});
// Connect to db
sequelize
    .authenticate()
    .then(() => {
    console.log("Connection has been established successfully.");
})
    .catch((error) => {
    console.error("Unable to connect to the database: ", error);
});
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    password: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    isAdmin: {
        type: new sequelize_1.DataTypes.BOOLEAN(),
        allowNull: false,
    },
}, {
    tableName: "user",
    sequelize,
});
class Ingredient extends sequelize_1.Model {
}
exports.Ingredient = Ingredient;
Ingredient.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    properties: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "ingredient",
    sequelize,
});
sequelize
    .sync()
    .then(() => {
    // Intialize db with some users
    User.create({
        username: "admin",
        password: "admin",
        isAdmin: true,
    })
        .then((res) => {
        console.log(res);
    })
        .catch((error) => {
        console.error("Failed to crseate a new record ", error);
    });
    User.create({
        username: "nonadmin",
        password: "nonadmin",
        isAdmin: false,
    })
        .then((res) => {
        console.log(res);
    })
        .catch((error) => {
        console.error("Failed to create a new record : ", error);
    });
    console.log("DB synced");
})
    .catch((error) => {
    console.error("Unable to create table : ", error);
});
