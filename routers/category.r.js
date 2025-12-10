import express from 'express';
import catC from '../controllers/category.c.js';
import { getDefaultCategoryProducts, getCategoryPaginatedProducts } from "../controllers/home.c.js";

const router = express.Router();

router.get('/', catC.getCategories);                
router.get('/select/:id', catC.getSelectCategory);   
router.post('/add', catC.postCategory);             
router.post('/update', catC.putCategory);            

router.get('/:id/:page', getCategoryPaginatedProducts);

router.get('/:id', getDefaultCategoryProducts);  

export default router;