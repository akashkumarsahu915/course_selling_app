import teacherRouter from "./routes/teacher.js";
import StudentRouter from "./routes/student.js";
import express from "express";
const app =express();
app.use(express.json());
app.use("/teacher",teacherRouter);
app.use("/student",StudentRouter);
app.get("/",(req,res)=>{
    res.send("hello from express");
});
app.listen(3000,()=>{
    console.log("app is running at port 3000");
});