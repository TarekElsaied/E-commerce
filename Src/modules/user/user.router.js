import express from "express";
import * as user from "./user.controller.js";
import { allowedTo, protectdRoutes } from "../auth/auth.controller.js";

const userRouter = express.Router();

userRouter
  .route("/")
  .post(user.createUser)
  .get(protectdRoutes, allowedTo("admin"), user.getAllUsers);

userRouter
  .route("/:id")
  .put(protectdRoutes, allowedTo("admin", "user"), user.updateUser)
  .delete(protectdRoutes, allowedTo("admin"), user.deleteUser)
  .get(protectdRoutes, allowedTo("admin"), user.getUser);
userRouter.patch("/changeUserPassword/:id", user.changeUserPassword);

export default userRouter;
