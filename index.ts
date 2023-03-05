import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import sessions from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import StatusCodes from "http-status-codes";

dotenv.config();
import { User, Ingredient } from "./db";

const app: Express = express();
const port = process.env.PORT;
const jsonParser = bodyParser.json();

const oneDay = 1000 * 60 * 60 * 24;

app.use(jsonParser);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cookieParser());

//session middleware
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: true,
  })
);

app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user: User, done) {
  done(null, user);
});

// authn user
passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ where: { username, password } });
      if (!user) {
        done(null, false);
        return;
      }
      done(null, {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      });
    } catch (error) {
      done(error);
    }
  })
);

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.get("/user", (req: Request, res: Response) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized " });
    return;
  }
  res.json({ status: "OK", user: req.user });
});

app.post("/ingredient", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized " });
    return;
  }
  try {
    const i = await Ingredient.create({
      name: req.body.name,
      properties: req.body.properties,
    });
    res.json(i);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST);
  }
});

app.get("/ingredients", async (req: Request, res: Response) => {
  try {
    // apply filters if passed
    let where: { name?: any; properties?: any } = {};
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
    const i = await Ingredient.findAll({
      where: {
        ...where,
      },
    });
    res.json(i);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST);
  }
});

app.post("/ingredients", async (req: Request, res: Response) => {
  try {
    await Ingredient.destroy({ where: { id: req.body.id } });
    res.status(StatusCodes.OK);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST);
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
