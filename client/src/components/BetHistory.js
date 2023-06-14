import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID.js";
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from "react-router-dom";
export const BetHistory = () => {
  const navigate = useNavigate();
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
  

  return (
    <div>
        <h1 className="about">Bet History</h1>
      {betLogs ? (
        <div>
          {betLogs.map((obj, index) => (


            <div className="bet-item" key={index}>              
              {obj.status !== "TBD" && <div className="bet-item"><div className="date">
                <p className="dateItem">{obj.date}</p>
              </div><div className="box team" style={{backgroundColor: obj.status === "WON"? 'green':'red'}}>
                <p>{obj.teamOne}{obj.teamOne == obj.pickedTeam && <CheckIcon />}</p>
                <p>{obj.teamTwo}{obj.teamTwo == obj.pickedTeam && <CheckIcon />}</p>
                
              </div>
              <div className="box odds" style={{backgroundColor: obj.status === "WON"? 'green':'red'}}>
                <p>{obj.oneOdds}</p>
                <p>{obj.twoOdds}</p>
              </div></div>}
            </div>
        ))}
        </div>
      ) : (
        <h1>Loading...</h1>
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
