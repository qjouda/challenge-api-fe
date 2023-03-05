import { Sequelize, DataTypes, Optional, Model } from "sequelize";

if (
  !process.env.DB_NAME ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_HOST
) {
  console.error(
    "DB configs must be configuired in .env file, see .env_example"
  );
  process.exit();
}

const sequelize = new Sequelize(
  process.env.DB_NAME ?? "",
  process.env.DB_USER ?? "",
  process.env.DB_PASSWORD ?? "",
  {
    host: process.env.DB_HOST ?? "",
    dialect: "mysql",
  }
);

// Connect to db
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

type UserAttributes = {
  id: number;
  username: string;
  password: string;
  isAdmin: boolean;
};

// Define user model
type UserCreationAttributes = Optional<UserAttributes, "id">;

export class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare username: string;
  declare passoword: string;
  declare isAdmin: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    isAdmin: {
      type: new DataTypes.BOOLEAN(),
      allowNull: false,
    },
  },
  {
    tableName: "user",
    sequelize,
  }
);

// define ingredeint model
type IngredientAttributes = {
  id: number;
  name: string;
  properties: string;
};

type IngredientCreationAttributes = Optional<IngredientAttributes, "id">;

export class Ingredient extends Model<
  IngredientAttributes,
  IngredientCreationAttributes
> {
  declare id: number;
  declare name: string;
  declare properties: string;
}

Ingredient.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    properties: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "ingredient",
    sequelize,
  }
);

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
