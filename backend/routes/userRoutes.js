import express from 'express'

import {registerUser,userCredits,userLogin} from '../controllers/userController.js'
import userAuth from '../middleware/auth.js';

const userRouter = express.Router(); //now with userRouter we will create end point for our api and will pass the controller which should be executed for that api end point...

userRouter.post('/register',registerUser);
//this is end point for api http:localhost:4000/api/user/register with post method coming req to server
userRouter.post('/login',userLogin);

userRouter.get('/credits',userAuth,userCredits);
//first middleware doing authentication checking whther user is logged in and authenticated or not when we confirms that we passed it to next controller where we use the userId obtained after authentication to get the credits of specific user who is authenticated...

export default userRouter;

//from postmen we can directly give these type of request to our server