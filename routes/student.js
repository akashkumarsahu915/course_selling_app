import express from "express";
import jwt from "jsonwebtoken";
import { Student } from "../database/db.js";
const jwtpassword="123akshjndbjnj";
const studentRouter=express.Router();
studentRouter.post("/signup",async(req,res)=>{
    let inpemail=req.body.email;
    let inppassword=req.body.password;
    let inpphno=req.body.phno;
    let purchasedCourses=req.body.purchasedCourses;
    let student=await Student.findOne({
        email:inpemail
    })
    if(Student){ 
        res.send("email is already taken");
    }else{
        const stu=await Student.create({
            email:inpemail,
            password:inppassword
        });
        const token=jwt.sign({
            email:stu.email,
            id:stu._id
        },jwtpassword);
        res.status(200).json({
            msg:"signup sucessfull",
            token:token
        })
    }
})



studentRouter.get("/signin",async(req,res)=>{
    let inpemail=req.body.email;
    let inppassword=req.body.password;
    let Student=await Student.findOne({
        email:inpemail
    })
    if(!Student){
        res.send("Student not found");
    }else{
        if(Student.password!=inppassword){
            res.send("password incorrect ")
        }else{
            const token=jwt.sign({
                email:Student.email,
                id:Student._id
            },jwtpassword);
            res.status(200).json({
                msg:"signin sucessfull",
                token:token
            })
        }
    }
});
const studentMiddlewire =(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        res.status(403).json({
            msg:"invalid token "
        })
    }
    const token =authHeader.split(" ")[1];
    try{
        const decode=jwt.verify(token,jwtpassword);
        req.userId=decode.id;
        next();
    }
    catch(error){
        res.status(411).json({
            msg:"invalid credientionals"
        })

    }
}
studentRouter.post("/purcheshedCourses",studentMiddlewire,async(req,res)=>{
    let name=req.body.name;
    let des=req.body.description;
    let price=req.body.price;
    let purcheshedCourses=await Course.create({
        name:name,
        description:des,
        price:price
    })
    let userId=req.userId;
    try{
        await student.updateOne(
            {_id:userId},{
              $push:{
                purcheshedCourses:purcheshedCourses._id
              }  
            }
        )
        res.status(200).json({
            msg:"course purcheshed sucessfully"
        })
    }
    catch(error){
        res.status(411).json({
            msg:"can't purcheshed course"

        })
    }
})
export default studentRouter;