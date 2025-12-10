import { 
    getAllProductsAndCategories, 
    getPaginatedProductsAndCategories, 
    getAjaxPage,
    postAjaxPage
} from "../controllers/home.c.js";
import express from 'express';

const router = express.Router();

router.get('/ajax', getAjaxPage); 
router.post('/ajax', postAjaxPage); 

router.get('/', getAllProductsAndCategories); 

router.get('/:page', getPaginatedProductsAndCategories); 

export default router;