import categoryM from "../models/category.m.js";
import productM from "../models/product.m.js";

const pageSize = 3;

export const getAllProductsAndCategories = async (req, res) => {
  const page = 1;
  
  const { products, total, safePage, safePageSize } = await productM.allWithPagination(page, pageSize);
  const totalPages = Math.ceil(total / safePageSize);
  const categories = await categoryM.all();
  
  res.render("product/productsWithPaging", {
    products, 
    categories, 
    totalPages,
    page: safePage, 
    enablePrev: false,
    enableNext: safePage < totalPages && totalPages > 1,
    baseRoute: ''
  });
};

export const getPaginatedProductsAndCategories = async (req, res) => {
  const { page } = req.params;
  
  const { products, total, safePage, safePageSize } = await productM.allWithPagination(page, pageSize);
  const totalPages = Math.ceil(total / safePageSize);
  const categories = await categoryM.all();
  
  res.render("product/productsWithPaging", {
    products, 
    categories, 
    totalPages,
    page: safePage, 
    enablePrev: safePage > 1 && totalPages > 1, 
    enableNext: safePage < totalPages && totalPages > 1,
    baseRoute: ''
  });
};

export const getDefaultCategoryProducts = async (req, res) => {
    const { id } = req.params;
    return res.redirect(`/categories/${id}/1`);
};

export const getCategoryPaginatedProducts = async (req, res) => {
  const { id, page } = req.params;
  const category_id = parseInt(id);

  const { products, total, safePage, safePageSize } = await productM.allOfCategoryWithPagination(category_id, page, pageSize);
  const totalPages = Math.ceil(total / safePageSize);
  const categories = await categoryM.all();
  
  res.render("product/productsWithPaging", {
    products, 
    categories, 
    totalPages,
    page: safePage, 
    enablePrev: safePage > 1 && totalPages > 1, 
    enableNext: safePage < totalPages && totalPages > 1,
    baseRoute: `/categories/${category_id}`
  });
};

export const getAjaxPage = async (req, res) => {
    const categories = await categoryM.all();
    res.render("product/productsAjaxPaging", { categories });
};

export const postAjaxPage = async (req, res) => {
    const { page, pageSize = 3 } = req.body;
    
    const { products, total, safePage, safePageSize } = await productM.allWithPagination(page, pageSize);
    const totalPages = Math.ceil(total / safePageSize);
    
    res.json({ products, totalPages, page: safePage });
};