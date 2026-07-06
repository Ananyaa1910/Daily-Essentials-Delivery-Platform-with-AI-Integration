import express from 'express';
import { addToCart, updateCart, removeFromCart, getCart } from '../controllers/cartController.js';
import authUser from '../middlewares/authUser.js';
import mongoose from 'mongoose';

const cartRouter = express.Router();

cartRouter.post('/add', authUser, addToCart);
cartRouter.post('/update', authUser, updateCart);
cartRouter.post('/remove', authUser, removeFromCart);
cartRouter.get('/get', authUser, getCart);

export default cartRouter;
