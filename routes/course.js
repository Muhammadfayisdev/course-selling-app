const {Router}=require('express');
const courseRouter=Router();

const {purchaseModel, courseModel}=require('../db')
const {userMiddleware}=require('../middleware/user')


courseRouter.post('/purchase',userMiddleware,async function(req,res){
    const userId=req.userId;
    const courseId=req.body.courseId;
    try{
        await purchaseModel.create({
            userId,
            courseId
        })
        res.status(200).json({
            message:"course purchased successfully"
        })
    }catch(e){
        res.status(403).json({
            message:"error to purchase a course"
        })
    }
})

courseRouter.post('/preview',async function(req,res){
    try{
        const courses= await courseModel.find({});
        res.status(200).json({
            courses
        })
    }catch(e){
        res.status(403).json({
            message:"error fatching courses"
        })
    }
    res.send(courses)
})

module.exports={
    courseRouter:courseRouter
}