import express from 'express'
import ejs from 'ejs'
import https from 'https'
import mongoose from 'mongoose'
import {UserRouter} from './routes/users.js'
import { betRouter, getBets } from './routes/bets.js' //call getBets every 24hrs
import cron from 'node-cron'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport'
import session from 'express-session'

const app = express();
app.use(express.urlencoded());
app.use(express.json());
// app.use(passport.initialize());
// app.use(passport.session());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
app.use("/auth", UserRouter);
app.use("/bet", betRouter) //we are going to be writing code for all endpoints related to auth in a seperate file
// and we import the function as userRouter

app.set('view engine', 'ejs');



mongoose.connect(process.env.ATLAS);

const PORT = process.env.PORT || 8000;
const playerSchema = new mongoose.Schema({
    PlayerID: Number,
    FirstName: String,
    LastName: String,
    Jersey: Number
});

const Player = new mongoose.model("Player", playerSchema);

cron.schedule('0 0 * * *', () => {
   getBets(); 
  });
cron.schedule('0 0 1 * *', () => {
    getPlayers();
});



//getPlayers is called every 3 months to update database on which players are currently on the roster/
//to obtain their playerID's

const getPlayers = () => {
    const url = "https://api.sportsdata.io/v3/nba/scores/json/PlayersBasic/GS?key=9f1300bf822e4de592ac182f5d35cdfa" 
    const request = https.get(url, res => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            const dataString = data.toString();
            const dataJSON = JSON.parse(dataString);
            //make it so that data doesnt get stacked (appeneded) onto the database everytime i call this method, only modify/update
            dataJSON.forEach(athlete => {
                const {PlayerID, FirstName, LastName, Jersey} = athlete;
                const player = new Player({PlayerID, FirstName, LastName, Jersey});
                player.save();
            });
            
        });

    });
}



app.get("/players", (req, res) => {
    Player.find()
    .then(data => res.json(data))
    // res.json({ message: "one" });
});


app.listen(PORT, () => {
    console.log(`something started on ${PORT}`);
});