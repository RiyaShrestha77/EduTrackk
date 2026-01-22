const User = require("../models/userModel.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const addUser = async (req, res) => {
    try{
        const { username, email, password } = req.body;
        if(!username || !email || !password){
            return res.status(400).json({
                message: "All fields are required"
            });

        }
        const isUser = await User.findOne({where:{username}})
        const isemail = await User.findOne({where:{email}})
        if(isUser || isemail){
            return res.json({msg: "User with this email exits!"})
        }
        
        const hassed = await bcrypt.hash(password, 10)

        console.log(hassed)
        const newUser = await User.create({
            username,
            email,
            password: hassed

        });

        res.status(201).json({
            message: "User added successfully",
            user: newUser
        });
    }catch(error){
        res.status(500).json({
            message: "Error adding user",
            error: error.message
        });
    }
}

const loginUser = async(req, res)=>{
    try{
        const {email, password}=req.body
        const user = await User.findOne({where:{email}})
        if (!user){
            return res.status(400).json({message:"User not found"})
        }
        const isvalidUser=await bcrypt.compare(password, user.password)
        if(!isvalidUser){
            return res.status(400).json({message:"Invalid email or password"})
        }

        const token = jwt.sign(
    {id: user.id, role: user.role, username: user.username, email: user.email},
    process.env.JWT_SECRET,
    {expiresIn: '7d'}
);

        return res.status(200).json({message:"user logged in succcessfully", token})
    }catch(error){
        return res.status(500).json({error: error.message})

    }
};

module.exports={
    addUser,
    loginUser
}