import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const registerUser = async (req,res) => {
  try {
    const {name,email,password} = req.body;
    if(!name || !email || !password) {
      return res.json({sucess: false,message : "Missing details.."});
    }
    const salt = await bcrypt.genSalt(10);//10 means here we will user moderate encryption on passworde if we increase the value encryption done here will also be more secured but it will increase the time so 10 is good
    const hashedPass = await bcrypt.hash(password,salt);//hashed password
    const userData = {
      name,
      email,
      password : hashedPass
    }
    const newUser = new userModel(userData);
    const user = await newUser.save();//so now that user model in mongoose now got saved in monogodb collection of user as document and we got that user after saving
    const token = jwt.sign({id: user._id},process.env.JWT_SECRET);//this is token which will be send on frontend side after registration so that when user come back with this token his/her authentication can be done easily..
    res.json({sucess:true,token,user:{name : user.name}})
  } catch (error) {
    console.log("Error happened: ",error);
    res.json({sucess:false,message:error.message});
  }
} 

const userLogin = async (req,res) => {
  try {
    const {email,password} = req.body;
    const user = await userModel.findOne({email});
    if(!user) {
      return res.status(401).json({sucess: false,message:"Invalid Credentials..."});
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) {
      return res.status(401).json({sucess: false,message:"Invalid Credentials..."});
    } else {
      const token = jwt.sign({id: user._id},process.env.JWT_SECRET);
      res.json({sucess:true,token,user:{name : user.name}});
    }
  } catch (error) {
    console.log("Error happened: ",error);
    res.json({sucess:false,message:error.message});
  }
}

const userCredits = async (req,res) => {
  try {
    const {userId} = req;
    const user = await userModel.findById(userId);
    res.json({success: true,credits:user.creditBalance,user:{name:user.name}});
  } catch (error)  {
    console.log("Error happened: ",error);
    res.json({sucess:false,message:error.message});
  }
}

export {registerUser,userLogin,userCredits};