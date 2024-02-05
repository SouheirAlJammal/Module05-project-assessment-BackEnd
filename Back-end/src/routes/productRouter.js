import { Router } from "express";
import { uploadImage } from "../middlewares/multer.js";
import { authenticate, isAdmin } from "../middlewares/authenticate.js";

import {
  AddProduct,
  deleteProduct,
  getProducts,
  getProduct,
  editProduct,
  searchByProductName,
} from "../controllers/productController.js";

export const productRoutes = Router();

productRoutes.post("/addProduct", uploadImage.single("image"), authenticate, isAdmin, AddProduct);
productRoutes.delete("/deleteProduct", authenticate, isAdmin, deleteProduct);
productRoutes.get("/AllProducts", getProducts);
productRoutes.post("/search", searchByProductName);
productRoutes.get("/byId/:slug", getProduct);
productRoutes.patch("/editProduct", uploadImage.single("image"),  authenticate, isAdmin,editProduct);
