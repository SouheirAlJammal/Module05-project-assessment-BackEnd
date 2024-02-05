import express from "express";
const orderRouter = express.Router();
import {
    addOrder,
    getAllOrders,
    getOneOrderById,
    deleteOrder,
    updateOrder
} from "../controllers/orderController.js";
import { authenticate, isAdmin } from "../middlewares/authenticate.js";


orderRouter.post("/addNewOrder", addOrder);
orderRouter.get("/getallorders", getAllOrders);
orderRouter.get("/one/:id", getOneOrderById);
orderRouter.delete("/delete/:id",authenticate,isAdmin, deleteOrder);
orderRouter.patch("/update",authenticate,isAdmin,  updateOrder);

export default orderRouter