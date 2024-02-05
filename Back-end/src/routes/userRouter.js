import { Router } from "express";
import {
  addNewUser,
  deleteUser,
  getOneUser,
  getUsers,
  signIn,
  updateUser,
} from "../controllers/userController.js";
import { authenticate, isAdmin } from "../middlewares/authenticate.js";

export const userRoutes = Router();

userRoutes.post("/signup", addNewUser);
userRoutes.post("/login", signIn);
userRoutes.get("/", getUsers);
userRoutes.get("/one", getOneUser);
userRoutes.delete("/delete", authenticate,isAdmin, deleteUser);
userRoutes.patch("/update",authenticate,isAdmin,  updateUser);
