import express from "express";
import { conn } from "./database/dbConnection.js";
import morgan from "morgan";
import dotenv from "dotenv";
import { init } from "./Src/modules/index.routes.js";
import cors from "cors";
import { createOnlineOrder } from "./Src/modules/order/order.controller.js";
dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  createOnlineOrder
);
app.use(express.json());
app.use(express.static("uploads"));
app.use(morgan("dev"));

conn();
init(app);
app.listen(process.env.PORT | port, () =>
  console.log(`Example app listening on port ${port}!`)
);
