import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID.js";
import CheckIcon from '@mui/icons-material/Check';

export const BetHistory = () => {
  const [betLogs, setBetLogs] = useState([{}]);
  
  useEffect(() => {
    const fetchBetLogs = async () => {
      try {
        const response = await GetBetLogs();
        setBetLogs(response);
      } catch (error) {
        console.log("Error fetching bet logs:", error);
      }
    };

    fetchBetLogs();
  }, []);
  
  const DeleteBet = async (index) => {
    //remove bet from screen
    const tempLogs = [...betLogs];
    console.log(index);
    tempLogs.splice(index, 1);
    setBetLogs(tempLogs);
    //remove bet from db
    const getUserID = useGetUserID();
    try {
      const delBet = await axios.delete(`https://mock-bets.onrender.com/bet/betLogs/${getUserID}/${index}`);

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="about">
        <h1 className="title">Bet History</h1>
      {Array.isArray(betLogs) ? (
        <div>
          {betLogs.map((obj, index) => (
            <div className={`bet-history ${obj.status === "TBD" && "not-complete"}`} key={index} >
              <div className="date x">
                <p className="dateItem">{obj.date}</p>
              </div>
              <div className="teams x">
                <p>{obj.teamOne}{obj.teamOne == obj.pickedTeam && <CheckIcon />}</p>
                <p>{obj.teamTwo}{obj.teamTwo == obj.pickedTeam && <CheckIcon />}</p>      
              </div>
              <div className="odds x">
                <p>{obj.oneOdds}</p>
                <p>{obj.twoOdds}</p>
              </div>
              <div className="result x">
                <p style={{backgroundColor: obj.status === "WON" ? 'green': obj.status === "LOST"? 'red': 'white', color: 'black'}}>{obj.status}</p>
                {obj.status === 'TBD' && <p onMouseUp={() => DeleteBet(index)} className="delete">Delete</p>}
              </div>  
               
            </div>
        ))}
        </div>
      ) : (
        <h1 style={{color: 'red'}}>No bets/API Key expired. Unable to obtain live game info.</h1>
      )}
    </div>
  );
};

const GetBetLogs = async () => {
  const getUserID = useGetUserID();
  const bet = await axios.get(`https://mock-bets.onrender.com/bet/history/${getUserID}`);
  const bets = bet.data;
  if (bets) {
    
    return bets;
  }
  return [];

};
