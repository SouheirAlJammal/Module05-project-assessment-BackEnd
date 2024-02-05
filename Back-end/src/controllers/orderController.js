import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";


//function to update product counter
const updateProductQuantities = async (products, increment) => {
  await Promise.all(
    products.map(async (productElt) => {
      await Product.findByIdAndUpdate(productElt.product, {
        $inc: { stock: increment * productElt.quantity },
      });
    })
  );
};

export const addOrder = async (req, res) => {

  const {
    shippingAddress,
    status,
    country,
    totalAmount,
    products,
    userId,
  } = req.body;


  // Check for required fields
  if (
    !shippingAddress ||
    !totalAmount ||
    !country ||
    !products ||
    products.length === 0
  ) {
    return res.status(400).json({ message: "Missing required field" });
  }

  try {
    const newOrder = await Order.create({
      shippingAddress,
      status: status || "Pending",
      totalAmount,
      country,
      userId,
      products,
    });

    // Update product counter and sizes
    await updateProductQuantities(products, 1);
    return res
      .status(201)
      .json({ message: "Order created successfully", data: newOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating order" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Orders" });
  }
};

export const updateOrder = async (req, res) => {
  const { id, status, products } = req.body;
  try {
    const oldOrder = await Order.findById(id);

    if (oldOrder.status === "Rejected" || oldOrder.status === "Approved ") {
      console.log("first");
      console.log("error3");
      return res.json({
        message: `You can't change the status, order already ${oldOrder.status}`,
      });
    }

    if (status === "Rejected") {
      // Update product counter and sizes for the old order
      console.log("error2");
      await updateProductQuantities(oldOrder.products, -1);
    }

    if (oldOrder.status === "pending") {
      console.log("Done");
      const order = await Order.findByIdAndUpdate(id, {
        status: status,
        products: products,
      }).exec();
      return res
        .status(200)
        .json({ message: "Order updated successfully", data: order });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating order" });
  }
};

export const getOneOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id)
      .populate(["products.product", "userId"])
      .exec();
    res
      .status(200)
      .json({ message: "Successfully fetched order", data: order });
  } catch (error) {
    res.status(500).json({ message: "Error fetching an Order" });
    console.log(error);
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  const { products } = req.body;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(400)
        .json({ message: "There is no order with this id" });
    }

    // Update product counter and stock for the order being deleted
    if (order.status == "Pending") {
      await updateProductQuantities(products, -1)
    }

    // Delete the order
    await Order.findByIdAndDelete(id);

    res.status(200).json({ message: "Order is deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting an Order" });
  }
};
