const jwt=require('jsonwebtoken');
const express=require('express');
const mongoose=require('mongoose');
require('dotenv').config();

const {userRouter}=require('./routes/user')
const {adminRouter}=require('./routes/admin')
const {courseRouter}=require('./routes/course')
const app=express();


app.use(express.json());

// Routing

app.use('/api/v1/user',userRouter)
app.use('/api/v1/course',courseRouter)
app.use('/api/v1/admin',adminRouter)

//database connection

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
    console.log('connected to the database');
    
    app.listen(3000);
}
main();

