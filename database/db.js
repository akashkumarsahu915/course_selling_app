import mongoose from "mongoose";
mongoose.connect("mongodb://localhost:27017/course_app").then(()=>{
    console.log("mongodb connected");
}).catch((error)=>{
    console.log(error);
});
const courseSchema=mongoose.Schema({
    name:String,
    description:String,
    price:Number
});
export const Course =mongoose.model("Course",courseSchema);
const teacherSchema=mongoose.Schema({
    email:String,
    password:String,
    name:String,
    phno:Number,
    publishedCourses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }]

});
const studentSchema=mongoose.Schema({
    email:String,
    password:String,
    name:String,
    phno:Number,
    purcheshedCourses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"purcheshedCourses"
    }]

});
export const Teacher=mongoose.model("Teacher",teacherSchema);
export const Student=mongoose.model("student",studentSchema);
