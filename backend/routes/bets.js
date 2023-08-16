import express from 'express'
import mongoose from 'mongoose'
import { BetModel } from "../models/Bets.js";
import { UserModel } from '../models/Users.js';
import axios from 'axios'
import 'dotenv/config'
const router = express.Router();

export const getBets = () => {
    const url = "https://api.the-odds-api.com/v4/sports/basketball_nba/odds";
    const apiKey = process.env.API_KEY; 
    axios.get(url, {
        params: {
            apiKey: apiKey,
            regions: "us",
            markets: "spreads",
            bookmakers: "draftkings"
        }
    })
    .then(res => {
        //data is an array that contains info based on team matchups, so might have to map/foreach through array
        res.data.forEach(betObj => {
            const { commence_time, bookmakers: [{ markets: [{ outcomes }] }] } = betObj;
            const [outcome1, outcome2] = outcomes;
            const pointOne = outcome1.point;
            const pointTwo = outcome2.point;
            const firstTeam = outcome1.name;
            const secondTeam = outcome2.name;
            const first = firstTeam.split(" ")[1];
            const second = secondTeam.split(" ")[1];
            const unixD = new Date(commence_time);
            const unixTime = Math.floor(unixD.getTime()/1000);
            const formatedTime = commence_time.split("T")[0];
            const newBet = new BetModel({
                oneOdds: pointOne,
                twoOdds: pointTwo,
                teamOne: first,
                teamTwo: second,
                date: formatedTime,
                unixDate: unixTime,
                pickedTeam: null,
                status: "TBD"
            });
            BetModel.findOne({
                teamOne: first,
                date: formatedTime
            })
            .then(res => {
                if (res && res.oneOdds === pointOne) {
                    return "no new changes to DB have been made";
                } else if (res && res.twoOdds !== pointTwo) {
                    //update db
                    BetModel.findOneAndUpdate(res, {...res, oneOdds: pointOne, twoOdds: pointTwo})
                    .then(res => console.log(res))
                    .catch(err => console.log(err))
                } else {
                    newBet.save();
                }
            });
            })
            ;
    })
    .catch(err => console.log(err));
}

//choice: call nbastats api every time endpoint is called vs call nbastats api once every day after all games are over, and then store into database
//and then query database for info
export const getResults = async() => {
    const url = "https://api.the-odds-api.com/v4/sports/basketball_nba/scores";
    const apiKey = process.env.API_KEY; 
    try {
        const response = await axios.get(url, {
            params: {
                apiKey: apiKey,
                daysFrom: 2,
                dateFormat: "iso"
            }
        });
        
        
        return response.data.filter(event => event.completed);
        
    } catch (err) {
        console.log(err);
    }
}

router.get("/history/:userID", async(req, res) => {
    try {
        const pastEvents = await getResults();
        const user = await UserModel.findById(req.params.userID);
        const newLog = user.betLog.map(log => {
            if (log.status == 'TBD') {
                let updatedLog = {...log.toObject()} 

                for (const event of pastEvents) {
                    //first check if date of events are same
                    const startDate = event.commence_time.split("T")[0];
                    if (startDate == log.date) {
                        if (event.home_team.includes(log.teamOne) || event.home_team.includes(log.teamTwo)) {
                            const [one, two] = event.scores;
                            
                            let outcome = "LOST";
                            let scoreDiff = 0;
                            let betOdds = rightOdds(log.oneOdds, log.twoOdds, log.teamOne, log.teamTwo, log.pickedTeam);
                            //basically doing scoreDiff = otherTeam - pickedTeam
                            if (one.name.includes(log.pickedTeam)) {
                                scoreDiff = two.score - one.score;
                            } else {
                                scoreDiff = one.score - two.score;
                            }
                            if (betOdds > scoreDiff) {
                                outcome = "WON"
                            } 
                            //now we just update the betLog array do display the outcome
                            updatedLog.status = outcome;
                            break;
                        }
                    }
   
                }
                return updatedLog;
            }
        return log;
        
        
        });
        console.log(newLog); 
        await UserModel.findByIdAndUpdate(req.params.userID, { $set: {betLog: newLog}});
        res.json(newLog);
        //founder user log, found game results
        //we want to only loop through array which have status: "TBD"
    } catch (err) {
        res.json({message: "Not available"})
    }

})

const rightOdds = (oneOdds, twoOdds, teamOne, teamTwo, pickedTeam) => {
    if (pickedTeam == teamOne) {
        return oneOdds;
    } else {
        return twoOdds;
    }
}


router.get("/all", (req, res) => {
    const currTime = Math.floor(Date.now() / 1000);
    BetModel.find({unixDate: { $gte: currTime + 12000}}).then(data => res.json(data)).catch(error => console.error(error))
})

router.post("/post/:team/:id/:userID", async(req, res) => {
    //modify betSlip to show team that user chose (by clicking on the button in the app)
    let newSlip = {};
    try {
        const old = await BetModel.findById(req.params.id);
        //this process is to eliminate all the extra gibberish like the $ signs
        const oldSlip = old.toObject();
        newSlip = {...oldSlip, pickedTeam: req.params.team}

    } catch (err) {
        console.log(err)
    }
    
    //insert newSlip into the users database
    try {      
        const users = await UserModel.findById(req.params.userID);
        const betArr = users.betLog;
        let found = false;
        for (const slip of betArr) {
            if (slip.date == newSlip.date && slip.teamOne == newSlip.teamOne) {
                found = true;
                break;
            }
        }
        if (!found) {
            const usera = await UserModel.findByIdAndUpdate(req.params.userID, {$push: {betLog: newSlip}});
        //make it so that user cant spam click the button -> it pushes more betSLips to the array
        }
    } catch (err) {

        res.json(err);
    }
    
})


export {router as betRouter}