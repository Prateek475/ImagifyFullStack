import mongoose from "mongoose";

const connectMongoDB = async ()=> {

  mongoose.connection.on('connected',()=> {
    console.log("Database connected...");
    //this is an event which happens when mongodb is connected to our server with help of mongoose and then this callback function runs
  });
  await mongoose.connect(`${process.env.MONGODB_URI}/Imagify`);
}

export default connectMongoDB;