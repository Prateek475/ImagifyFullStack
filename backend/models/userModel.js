import mongoose from "mongoose";

//in this we will define structure of our data which we will store in our mongo db database
const userSchema = new mongoose.Schema({
  name : {type:String,required: true},
  email : {type: String, required: true,unique: true},
  password : {type: String, required: true},
  creditBalance : {type: Number,default: 5}
});
//now we have created the schema with the help of this schema we will create the model which is going to store this document inside a collection made by this mongoose model

//if a user model is already there in mongoose then we will take that one else we will create one in mongoose 
const userModel = mongoose.model.user ||  mongoose.model("user",userSchema);// a model will be created in mongoose with name user of the above type schema and when this model in mongoose will be saved to mongodb then first collection of user name will be made in database where this document of user will get stored

export default userModel;
