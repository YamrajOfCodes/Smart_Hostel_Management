   import mongoose from "mongoose";

     const  dbConnect = async()=>{
        let DB_URL = process.env.DBCONNECT
       const connect =  await mongoose.connect(DB_URL);

       if(connect){
        console.log("connected");
       }else{
        console.log("error while connect");
        
       }
    }
    

 export default dbConnect;