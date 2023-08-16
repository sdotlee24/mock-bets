import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Button from "@mui/material/Button";
import {Link} from 'react-router-dom'
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);

  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const storedUsername = window.localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  const logout = () => {
    navigate("/");
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    window.localStorage.removeItem("username");
    setUsername("");

  };
  return (
    <div className="">
      {!cookies.access_token ? (
            <Link to="/sign-in" className='nav-link sign'>Login/Register</Link> 
        
      ) : (
        <div className="logout">
            <h1 className="nav-item id">{username}</h1>
          <Button
            onClick={logout}
            variant="contained"
            startIcon={<LogoutIcon />}
            color="error"
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};


export default Auth;
