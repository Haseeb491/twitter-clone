import express from 'express';
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv';
import connectMongoDB from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // parse req.body (data of user coming from frontend)
app.use(express.urlencoded({extended : true})); // to parse form data
app.use(cookieParser()); //parse the cookies

app.use("/api/auth",authRoutes );
app.use("/api/users",userRoutes );


app.listen(PORT, ()=>{
    console.log(`server is running on port: ${PORT}`);
    connectMongoDB()
});