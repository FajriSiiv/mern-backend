import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import SequelizeStore from "connect-session-sequelize";
import db from "./config/Database.js";

// 53:52
dotenv.config();
const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

(async () => {
  await db.sync();
})();

const server = process.env.APP_PORT || 5000;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: "auto",
    },
    store: store,
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);

store.sync();

app.listen(server, () => {
  console.log("server running", process.env.APP_PORT);
});
