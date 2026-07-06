import express from 'express';
import { registerUser, loginUser, logoutUser, addAddress, getAddresses } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.get('/logout', logoutUser);
userRouter.post('/address/add', authUser, addAddress);
userRouter.get('/address/list', authUser, getAddresses);

export default userRouter;
