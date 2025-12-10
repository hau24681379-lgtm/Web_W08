import { getProductById } from "../controllers/product.c.js";
import express from 'express';

const router = express.Router();

router.get('/:id', getProductById);

export default router;