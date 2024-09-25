import express from "express";
import jwt from "jsonwebtoken";
import { Teacher,Course } from "../database/db.js";
const jwtpassword="123aksh";
const teacherRouter=express.Router();
teacherRouter.post("/signup",async(req,res)=>{
    let inpname=req.body.name;
    let inpemail=req.body.email;
    let inppassword=req.body.password;
    let inpphno=req.body.phno;
    let teacher=await Teacher.findOne({
        email:inpemail
    })
    if(teacher){ 
        res.send("email is already taken");
    }else{
        const teach=await Teacher.create({
            email:inpemail,
            password:inppassword,
            name:inpname,
            phno:inpphno
        });
        const token=jwt.sign({
            email:teach.email,
            id:teach._id
        },jwtpassword);
        res.status(200).json({
            msg:"login sucessfull",
            token:token
        })
    }
})


teacherRouter.get("/signin",async(req,res)=>{
    let inpemail=req.body.email;
    let inppassword=req.body.password;
    let teacher=await Teacher.findOne({
        email:inpemail
    })
    if(!teacher){
        res.send("teacher not found");
    }else{
        if(teacher.password!=inppassword){
            res.send("password incorrect ")
        }else{
            const token=jwt.sign({
                email:teacher.email,
                id:teacher._id
            },jwtpassword);
            res.status(200).json({
                msg:"login sucessfull",
                token:token
            })
        }
    }
})
const teacherMiddlewire =(req,res,next)=>{
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

teacherRouter.post("/publish",teacherMiddlewire,async(req,res)=>{
    let name=req.body.name;
    let des=req.body.description;
    let price=req.body.price;
    let course=await Course.create({
        name:name,
        description:des,
        price:price
    })
    let userId=req.userId;
    try{
        await Teacher.updateOne(
            {_id:userId},{
              $push:{
                publishedCourses:course._id
              }  
            }
        )
        res.status(200).json({
            msg:"course publshied sucessfully"
        })
    }
    catch(error){
        res.status(411).json({
            msg:"can't added course"

        })
    }
})

export default teacherRouter;