const express = require("express")
const app =express();
const {connectDB, sequelize}=require("./database/database");
const cors = require("cors")
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.use(express.json());
app.use("/api/users",require("./routes/userroutes"))
app.use("/api/products",require("./routes/productroutes"))
app.use("/api/bookings",require("./routes/bookingroutes"))


app.get("/",(req,res)=>{
    res.json({message:"Welcome to the Homepage"});
});
 
const startServer=async()=>{
    await connectDB();
    await sequelize.sync();
    app.listen(5000,()=>{
        console.log("Server is running on port ${5000}");
    });
};
startServer();



