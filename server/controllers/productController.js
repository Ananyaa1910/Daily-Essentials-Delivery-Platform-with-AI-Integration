import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';

// Add Product
export const addProduct = async (req, res) => {
  try {
    const { name, description, category, price, offerPrice, stock, weight } = req.body;

    // Description can be a JSON string from frontend or a regular array/string
    let parsedDescription = [];
    if (description) {
      try {
        parsedDescription = JSON.parse(description);
      } catch (e) {
        parsedDescription = Array.isArray(description) ? description : [description];
      }
    }

    // Get files from request
    const files = req.files || [];
    let imageUrls = [];

    if (files.length > 0) {
      const uploadPromises = files.map(file =>
        cloudinary.uploader.upload(file.path, { resource_type: 'image' })
      );
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map(result => result.secure_url);
    }

    const newProduct = new productModel({
      name,
      description: parsedDescription,
      category,
      price: Number(price),
      offerPrice: Number(offerPrice),
      image: imageUrls.length > 0 ? imageUrls : ["https://via.placeholder.com/150"],
      stock: stock ? Number(stock) : 10,
      inStock: stock ? Number(stock) > 0 : true,
      weight: weight || "N/A"
    });

    const product = await newProduct.save();
    res.status(201).json({ success: true, message: "Product Added successfully", product });

  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// List Products // api/product/list
export const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("List Products Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove Product
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedProduct = await productModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product Removed successfully" });
  } catch (error) {
    console.error("Remove Product Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle Stock /api/product/toggle-stock
export const toggleStock = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.inStock = !product.inStock;
    product.stock = product.inStock ? 10 : 0; // sync stock quantity with toggle state
    await product.save();

    res.status(200).json({ success: true, message: "Stock status toggled successfully", product });
  } catch (error) {
    console.error("Toggle Stock Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
