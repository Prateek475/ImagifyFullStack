import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import razorpay from 'razorpay'

const registerUser = async (req,res) => {
  try {
    const {name,email,password} = req.body;
    if(!name || !email || !password) {
      return res.json({success: false,message : "Missing details.."});
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
    res.json({success:true,token,user:{name : user.name}})
  } catch (error) {
    console.log("Error happened: ",error);
    res.json({success:false,message:error.message});
  }
} 

const userLogin = async (req,res) => {
  try {
    const {email,password} = req.body;
    const user = await userModel.findOne({email});
    if(!user) {
      return res.status(401).json({success: false,message:"Invalid Credentials..."});
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) {
      return res.status(401).json({success: false,message:"Invalid Credentials..."});
    } else {
      const token = jwt.sign({id: user._id},process.env.JWT_SECRET);
      res.json({success:true,token,user:{name : user.name}});
    }
  } catch (error) {
    console.log("Error happened: ",error);
    res.json({success:false,message:error.message});
  }
}

const userCredits = async (req,res) => {
  try {
    const {userId} = req;
    const user = await userModel.findById(userId);
    res.json({success: true,credits:user.creditBalance,user:{name:user.name}});
  } catch (error)  {
    console.log("Error happened: ",error);
    res.json({success:false,message:error.message});
  }
}

//this is just razorpay instance which will be used for making payments through the controller created below it
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentRazorpay = async(req,res) => {
  try {
    //we need the user which is buying the credits and which plan credits is the user buying..
    let {planId} = req.body;
    let {userId} = req;
    if(!planId || !userId) {
      return res.json({success: false,message:"Missing details..."});
    }
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }
    let credits,plan,amount,date;
    //the above variables will be used to store the payment type..
    switch (planId) {
      case 'Basic':
        plan = 'Basic';
        credits = 100;
        amount = 10;
        break;
      case 'Advanced':
        plan = 'Advanced';
        credits = 500;
        amount = 50;
        break;
      case 'Bussiness':
        plan = 'Bussiness';
        credits = 5000;
        amount = 250;
        break;
      default:
        return res.json({success:false,message:"Invalid plan..."});
    }
    date = Date.now();
    const transactionData = {
      userId,
      plan,
      amount,
      credits,
      date
    }
    const newTransaction = new transactionModel(transactionData);
    const transaction = await newTransaction.save();
    const options = {
      amount: amount*100,//razorpay expects amount in smallest currency
      currency : process.env.CURRENCY,
      receipt: transaction._id,
    }
    //now we will create one order using razor pay
    await razorpayInstance.orders.create(options,(error,order) => {
      if(error) {
        console.log(error);
        return res.json({success: false,message:error.message});
      }
      return res.json({success:true,order})
    })
  } catch(err) {
    console.log(err);
    return res.json({success: false,message:err.message});
  }
}

const verifyRazorpay = async (req,res) => {
  try {
    //this is returned by razorpay in handler after completing the payment
    const {razorpay_order_id} = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if(orderInfo.status = 'paid') {
      //we have to mark that transaction complete in our transaction collection of our database
      const transactionData = await transactionModel.findById(orderInfo.receipt);//we created a reciept from transaction id while creating the order now it is being used to mark that transaction complete...
      if(transactionData.payment) {
        //payment is already verified...
        return res.json({success:false,message:'Payment failed...'});
      }
      //so lets now add credits to the user
      const userData = await userModel.findById(transactionData.userId);
      const creditBalance = userData.creditBalance + transactionData.credits;
      await userModel.findByIdAndUpdate(userData._id,{creditBalance});
      await transactionModel.findByIdAndUpdate(transactionData._id,{payment:true});
      return res.json({success: true,message:"Credits added..."});
    } else {
      return res.json({success:false,message:"Payment failed..."});
    }
  } catch (err) {
    console.log(err);
    return res.json({success: false,message:err.message});
  }
}

export {registerUser,userLogin,userCredits,paymentRazorpay,verifyRazorpay};