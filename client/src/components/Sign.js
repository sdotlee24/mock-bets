import React from "react";
import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom'
import GoogleIcon from '@mui/icons-material/Google';

export const Sign = () => {
    const [userInfo, setUser] = useState({
        username: "",
        password: "",
      });
    const navigate = useNavigate();

      const [errMsg, setMsg] = useState("-");
      const [username, setUsername] = useState("");
      const [_, setCookies] = useCookies(["access_token"]);
      const onChange = (event) => {
        const { name, value } = event.target;
        setUser((prevUser) => {
          return {
            ...prevUser,
            [name]: value,
          };
        });
      };
      const onButton = (event) => {
        event.preventDefault();
        const name = event.target.name;
        const { username, password } = userInfo;
        const url = "http://localhost:8000/auth/";
        if (name === "register") {
          axios
            .post(url + "register", { username, password })
            .then((res) => {
              console.log(res.message);
                
            })
            .catch((err) => {
              setMsg(err.response.data.message);
            });
        } else {
          axios
            .post(url + "login", { username, password })
            .then((res) => {
              setCookies("access_token", res.data.token);
              window.localStorage.setItem("userID", res.data.userID);
              window.localStorage.setItem("username", username);  
              setUsername(username);
              navigate("/");
            })
            .catch((err) => {
                setMsg(err.response.data.message)
            });
        }
        setUser({ username: "", password: "" });
        setMsg("-");
      };
    
      return (
        <div className="login-form">
          <form >
            <h1>Login/Register</h1>
            <div className="content">
              <div className="input-field">
                <input
                type="text"
                className="login one"
                name="username"
                onChange={onChange}
                value={userInfo.username}
                placeholder="Username"
                autoComplete="off"
                /> 
              </div>
              <div className="input-field">
                <input
                type="password"
                name="password"
                className="login two"
                onChange={onChange}
                value={userInfo.password}
                placeholder="Password"
                />
              </div>
            </div>
            <p className="err">{errMsg}</p>
            <p className="oauth">- or login with -</p>
            <GoogleIcon className="oauth2" fontSize="large" style={{marginBottom: "12px"}}/>
            <div className="action">
              <button onClick={onButton} name="register">Register</button>
              <button onClick={onButton} name="login">Sign in</button>
            </div>
            </form>
        </div>
      );
    };
