import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Button from "@mui/material/Button";
import { useGetUserID } from "../hooks/useGetUserID.js";


function Gamble() {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const isAuthenticated = !!cookies.access_token;
  //shows user the Gambling page if they are authenticated, shows a blank screen if else:
  return <div className="about"><h1>Available bets</h1>{isAuthenticated && <Stats />}</div>
  
}

//Gambling page, maybe put in seperate compoment. use axios to access api to POST user pick + GET results back
const Stats = () => {
  const [betData, setData] = useState([{}]);
  const getUserID = useGetUserID();
  useEffect(() => {
    axios
      .get("http://localhost:8000/bet/all")
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const saveBet = (team, id) => {
    //get original bet slip from db and change status to the team you picked
    console.log(team, id);
    axios.post(`http://localhost:8000/bet/post/${team}/${id}/${getUserID}`)
    .then(res => {

    })
    .catch(err => console.log(err));
  }

  return (
    <div>
      {betData.map((obj, index) => (
        <div className="bet-item" key={index}>
        <div className="date">
          <p className="dateItem">{obj.date}</p>
          </div>
          <div className="box team">
            <p>{obj.teamOne}</p>
            <p>{obj.teamTwo}</p>
          </div>
          <div className="box odds">
            <Button onClick={() => saveBet(obj.teamOne, obj._id)} className="btn" variant="contained"><p>{obj.oneOdds}</p></Button>
            <Button onClick={() => saveBet(obj.teamTwo, obj._id)} className="btn" variant="contained"><p>{obj.twoOdds}</p></Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gamble;


