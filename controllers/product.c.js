import categoryM from "../models/category.m.js";
import productM from "../models/product.m.js";

export const getProductById = async (req, res) => {
  const productId = req.params.id;
  
  try {
    const product = await productM.one(productId);
    const categories = await categoryM.all();
    
    if (product) {
      res.render("product/productDetail", { product, categories });
    } else {
      res.status(404).send("404 Not Found - Product not found");
    }
  } catch (error) {
    res.status(500).send("500 Internal Server Error - Failed to load product");
  }
};