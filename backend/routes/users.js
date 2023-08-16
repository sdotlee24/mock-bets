import express from 'express'
import jwt from 'jsonwebtoken'
import bcrpyt from 'bcrypt'
import {UserModel} from '../models/Users.js'
const router = express.Router();

router.post('/register', async(req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({message: "Please enter username or password"})
    }
    const user = await UserModel.findOne({ username });
    if (user) {
         return res.status(400).json({message: "Username already exists"});
    }
    const hashedPassword = await bcrpyt.hash(password, 10);
    const newUser = new UserModel({
        username: username,
        password: hashedPassword
    });
    await newUser.save();
    res.json({message: "user created successfully"});
})

router.post("/login", async(req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({message: "Please enter username or password"})
    }
    const user = await UserModel.findOne({ username });
    
    if (!user) {
        return res.status(400).json({message: "User does not exist."})
    }
    const passwordValid = await bcrpyt.compare(password, user.password);
    if (! passwordValid) {
        return res.status(400).json({message: "Username/Password invalid"});
    }
    
    const token = jwt.sign({id: user._id}, "secret")
    res.json({token, userID: user._id})
})
export {router as UserRouter};