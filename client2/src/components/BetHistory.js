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
      const delBet = await axios.delete(`http://localhost:8000/bet/betLogs/${getUserID}/${index}`);

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="about">
        <h1 className="title">Bet History</h1>
      {betLogs ? (
        <div>
          {betLogs.map((obj, index) => (
            <div className={`bet-history ${obj.status === "TBD" && "not-complete"}`} key={index} onClick={obj.status === 'TBD' ? () => DeleteBet(index) : null}>
              <div className="date x">
                <p className="dateItem">{obj.date}</p>
              </div>
              <div className="teams x">
                <p>{obj.teamOne}{obj.teamOne == obj.pickedTeam && <CheckIcon />}</p>
                <p>{obj.teamTwo}{obj.teamTwo == obj.pickedTeam && <CheckIcon />}</p>      
              </div>
              <div className="x odds">
                <p>{obj.oneOdds}</p>
                <p>{obj.twoOdds}</p>
              </div>
              <div className="x">
                <p style={{backgroundColor: obj.status === "WON" ? 'green': obj.status === "LOST"? 'red': 'white'}}>{obj.status}</p>
              </div>   
            </div>
        ))}
        </div>
      ) : (
        <h1>No Bets</h1>
      )}
    </div>
  );
};

const GetBetLogs = async () => {
  const getUserID = useGetUserID();
  const bet = await axios.get(`http://localhost:8000/bet/history/${getUserID}`);
  const bets = bet.data;
  if (bets) {
    
    return bets;
  }
  return [];

};
