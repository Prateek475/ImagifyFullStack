import express from 'express';

import { generateImage } from '../controllers/imageController.js';
import userAuth from '../middleware/auth.js';

const imageRouter = express.Router();

imageRouter.post('/generate-image',userAuth,generateImage);//first middleware do authentication and add userId in req part and pass it on to next controller where now we can generate image after user has been properly authenticated....

export default imageRouter;