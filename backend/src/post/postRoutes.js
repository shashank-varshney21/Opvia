import express from 'express';
import { createPost, getUserFeed } from './postController.js';
import { verifyJWT } from '../middleware/userMiddleware.js';

const postRouter = express.Router();

postRouter.post('/', verifyJWT, createPost);
postRouter.get('/feed', verifyJWT, getUserFeed);

export default postRouter;
 