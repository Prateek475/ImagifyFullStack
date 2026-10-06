import express from 'express'

import {registerUser,userLogin} from '../controllers/userController.js'

const userRouter = express.Router(); //now with userRouter we will create end point for our api and will pass the controller which should be executed for that api end point...

userRouter.post('/register',registerUser);
//this is end point for api http:localhost:4000/api/user/register with post method coming req to server
userRouter.get('/login',userLogin);

export default userRouter;

//from postmen we can directly give these type of request to our server