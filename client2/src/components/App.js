import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BetHistory } from "./BetHistory.js";
import { Navbar } from "./Navbar.js";
import { Sign } from "./Sign.js";
import { About } from "./About.js";
import { Stats } from "./Stats.js";
import Gamble from "./Gamble";
import { useCookies } from "react-cookie";
function App() {
  const [players, setPlayers] = useState([]);
  const [cookies, setCookies] = useCookies(["access_token"]);
  useEffect(() => {
    fetch("http://localhost:8000/players/")
      .then((res) => res.json())
      .catch((error) => {
        console.log(error);
      })
      .then((data) => setPlayers(data))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="App">
      {/* <div>
      {players.map((player, index) => {
        return (
          <Player key={index} fname={player.FirstName} lname={player.LastName} num={player.Jersey} />
        )
      })}
      </div> */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Gamble />} />
          <Route path="/history" element={cookies.access_token &&<BetHistory />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<Sign />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
