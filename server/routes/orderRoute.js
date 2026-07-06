import express from 'express';
import { placeOrder, placeOrderStripe, verifyStripe, userOrders, allOrders, updateStatus } from '../controllers/orderController.js';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/verify', authUser, verifyStripe);
orderRouter.get('/userorders', authUser, userOrders);
orderRouter.get('/list', authSeller, allOrders);
orderRouter.post('/status', authSeller, updateStatus);

export default orderRouter;
