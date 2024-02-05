import Product from "../models/productModel.js";
import slugify from "slugify";
import mongoose from "mongoose";

const AddProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    stock
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  const image = req.file.location;
  const slug = slugify(name, { lower: true, replacement: "-" });

  try {
    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({ name});

    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product with this name already exists" });
    }

    // Create a new product
    const newProduct = await Product.create({
      name,
      description,
      image,
      price,
      slug,
    stock

    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error adding product", error });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.query.productId;
  try {
    const product = await Product.findById(productId);
     if(product) {
    await Product.findByIdAndDelete(productId);


    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.status(200).json({ data: products });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getProduct = async (req, res) => {
  const slug = req.params.slug;

  try {
    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({ message: "No product found" });
    }
    res.status(200).json({ data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const editProduct = async (req, res) => {
  const {
    _id,
    name,
    description,
    stock,
    price
  } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }
  const image = req.file.location;
  let slug;
  if (name) {
    slug = slugify(name, { lower: true, replacement: "-" });
  }
  try {
    await Product.findOneAndUpdate({_id : _id}, {
      name: name,
      description: description,
      image : image,
      price:price,
      stock:stock,
      slug: slug,
    });
    const updatedproduct = await Product.findById(_id);
    res
      .status(200)
      .json({ message: "product Info edited succ", data: updatedproduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};



async function searchByProductName(req, res) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "No name provided" });
  }
  try {
    const products = await Product.find({
      name: { $regex: `.*${name}.*`, $options: "i" },
      isDeleted: false,
    })
    if (products) {
      return res.json(products);
    }
    return res.status(404).json([]);
  } catch (error) {
    console.log(error);
  }
}



export {
  AddProduct,
  deleteProduct,
  getProducts,
  getProduct,
  editProduct,
  searchByProductName
};
