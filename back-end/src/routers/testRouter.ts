import { Router } from 'express';
import { clear, seed } from '../controllers/testController.js';

const testRouter = Router();

testRouter.post('/clear', clear);
testRouter.post('/seed', seed);

export default testRouter;