import axios from "axios";
import userModel from "../models/userModel.js";
import FormData from 'form-data'

export const generateImage = async (req,res) => {
  try {
    const {prompt} = req.body;
    const {userId} = req;//bcz auth.js adds the user id in req not req.body
    //the promp will be in req.body but the user Id will be from propmpt after authentication with token we get user id and then do this step bcz this step can only be done by authenticated users....
    const user = await userModel.findById(userId);
    if(!user || !prompt) {
      return res.status(401).json({success:false,message:"Missing details..."});
    }
    if(user.creditBalance === 0 || user.creditBalance < 0) {
      return res.json({success:false,message:"No Credits Balance"});
    }
    //now if enough credit is available then we have to generate the image from prompt by clipdrop ai whose api key we are going to use for project
    const formData = new FormData();
    formData.append('prompt',prompt);//the clipdrop ai requires the format of data to be inputted to it in form of multipart formdata it doesnt want json type data thats why we created form type data

    //clipdrop ai also wanted it to be post request and api end point was provided this by it
    const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1',formData,{
      headers: {
        ...formData.getHeaders(),
        'x-api-key': process.env.CLIPDROP_API,
      },
      responseType: 'arraybuffer'//in this we will get response from clipdrop in form of arraybuffer containing bytes of image png which is suitable when image in png format is being returned by server
    });//axios is used to make http request calls from one server to another either from frontend -backend or backend -clipdrop ai or another server
    const base64Image = Buffer.from(data,'binary').toString('base64');//converted binary or bytes data into image
    const resultImage = `data:image/png;base64,${base64Image}`;//this is the url format of the image which can be represented by the browser of our png
    await userModel.findByIdAndUpdate(userId,{creditBalance:user.creditBalance-1});

    return res.json({success: true,message:"Image Generated",creditBalance:user.creditBalance-1,resultImage});
  } catch (error) {
    console.log("Error happened: ",error);
    res.json({sucess:false,message:error.message});
  }
}