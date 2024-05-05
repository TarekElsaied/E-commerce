import express from "express";
const authRouter = express.Router();
import * as auth from "./auth.controller.js";

authRouter.post("/signUp", auth.signUp);
authRouter.post("/sigIn", auth.signIn);

export default authRouter;
