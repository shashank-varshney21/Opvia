import express from 'express';
import { createPost, getUserFeed } from './postController.js';

const postRouter = express.Router();

postRouter.post('/', createPost);       
postRouter.get('/feed', getUserFeed);    

export default postRouter;
