import express from 'express'
import mongoose from 'mongoose'
import {UserRouter} from './routes/users.js'
import { betRouter, getBets } from './routes/bets.js' //call getBets every 24hrs
import cron from 'node-cron'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { UserModel } from './models/Users.js';
import cors from 'cors';

const app = express();

// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "/auth/google/NBA",
//     scope: ["profile", "email"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//         try {
//             const email = profile.emails[0].value;
//             const user = await UserModel.findOne({username: email});
//             if (user) {
//                 const token = jwt.sign({id: user._id}, process.env.key);
//                 return done(null, token)
//             } else {
//                 const newUser = new UserModel({
//                     username: email,
//                     password: "None"
//                 }); 
                
//                 const nu = await newUser.save();
//                 const token = jwt.sign({id: nu._id}, process.env.key);
//                 return done(null, token)
//             } 
//         } catch(err) {
//             console.log("hello")
//         } 
//     }
// ));

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use("/auth", UserRouter);
app.use("/bet", betRouter);


mongoose.connect(process.env.ATLAS);


cron.schedule('0 0 * * *', () => {
   getBets(); 
});



// app.get('/auth/google', passport.authenticate('google'));


// app.get('/auth/google/NBA', passport.authenticate('google', { session: false}), (req, res) => {
//     res.json({ token: req.user});
// })




const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`something started on ${PORT}`);
});