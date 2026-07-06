import express from 'express';
import { addProduct, listProducts, removeProduct, toggleStock } from '../controllers/productController.js';
import authSeller from '../middlewares/authSeller.js';
import upload from '../middlewares/multer.js';

const productRouter = express.Router();

// Use upload.any() to handle any pattern of files (e.g. array, fields image0/image1, etc.)
productRouter.post('/add', authSeller, upload.any(), addProduct);
productRouter.get('/list', listProducts);
productRouter.post('/remove', authSeller, removeProduct);
productRouter.post('/toggle-stock', authSeller, toggleStock);

export default productRouter;
