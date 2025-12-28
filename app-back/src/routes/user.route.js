import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const userRouter = new express.Router();

userRouter.get('/', authMiddleware, userController.getAllActivated);

