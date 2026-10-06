import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectMongoDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';

//if port number is presnt in env file we will take it from there else port no 4000
const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());//use to parse the request
app.use(cors());//use to give cross origin resource sharing when front end and backend both are from diff origins
app.use('/api/user',userRouter);

// app.get('/',(req,res) => {
//   res.send("API is working...");
// });

const startServer = async () => {
  await connectMongoDB();

  app.listen(PORT,() => {
    console.log(`Server is now running on: ${PORT} ...`);
  });
}

startServer();