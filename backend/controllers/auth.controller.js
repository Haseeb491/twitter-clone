import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs';


export const signup = async (req, res) =>{
    try {
        const {fullName, username, email, password} = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({error : "Invalid Email format"});
        }

        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(400).json({error: "username is already taken"});
        }

        const existingEmail = await User.findOne({email});
        if (existingEmail) {
            return res.status(400).json({error: "An account already exists with that email"});
        }

        if(password.length < 6) {
            return res.status(400).json({error : "password should be atleast 6 charachters"})
        }
        
        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);



        //create the new user 
        const newUser = await new User({
            fullName,
            username,
            email,
            password : hashedPassword
        });

        //generate a token and set the cookie
        if (newUser) {
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id : newUser._id,
                fullName : newUser.fullName,
                username : newUser.username,
                email : newUser.email,
                followers : newUser.followers,
                following : newUser.following,
                profileImg : newUser.profileImg,
                coverImg : newUser.coverImg,
            });


        } else {
            res.status(400).json({error : "Invalid user data"})
        }
    } catch (error) {
        console.log("error in signUp controller",error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}
export const login = async (req, res) =>{
    res.json({
        data : "you hit the login end point"
    });
}
export const logout = async (req, res) =>{
    res.json({
        data : "you hit the logout end point"
    });
}