import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useGetUserID } from "../hooks/useGetUserID.js";
import 'dotenv/config';

function Gamble() {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const isAuthenticated = !!cookies.access_token;
  //shows user the Gambling page if they are authenticated, shows a blank screen if else:
  return <div className="about"><h1 className="title">Available bets</h1>{isAuthenticated && <Stats />}</div>
  
}

//Gambling page, maybe put in seperate compoment. use axios to access api to POST user pick + GET results back
const Stats = () => {
  const [betData, setData] = useState([{}]);
  const getUserID = useGetUserID();
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "/bet/all")
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const saveBet = (team, id) => {
    //get original bet slip from db and change status to the team you picked
    console.log(team, id);
    axios.post(process.env.REACT_APP_BACKEND_URL + `/bet/post/${team}/${id}/${getUserID}`)
    .then(res => {

    })
    .catch(err => console.log(err));
  }

  return (
    <div>
      {betData.map((obj, index) => (
        <div className="bet-history" key={index}>
        <div className="date x">
          <p className="dateItem">{obj.date}</p>
          </div>
          <div className="teams x">
            <p>{obj.teamOne}</p>
            <p>{obj.teamTwo}</p>
          </div>
          <div className="x odds">
            <p onMouseUp={() => saveBet(obj.teamOne, obj._id)} className="team-odd">{obj.oneOdds}</p>
            <p onMouseUp={() => saveBet(obj.teamTwo, obj._id)} className="team-odd">{obj.twoOdds}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gamble;


