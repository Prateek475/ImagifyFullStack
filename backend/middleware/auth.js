import jwt from 'jsonwebtoken';

const userAuth = async (req,res,next) => {
  const {token} = req.headers;

  if(!token) {
    return res.json({success:false, message: 'Not Authorized. Login Again'});
  }

  try {
    const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);
    if(tokenDecode.id) {
      req.userId = tokenDecode.id;
    } else {
      return res.json({success: false,message: 'Not Authorized.Login again..'});
    }
    next();//this next method will run controller which will return user credit
  } catch (error) {
    console.log("Error happened: ",error);
    res.json({sucess:false,message:error.message});
  }
}

export default userAuth;