import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from "react-router-dom";
const Auth = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [errMsg, setMsg] = useState("");
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
    <div className="auth">
      {!cookies.access_token ? (
        <LogReg setMsg={setMsg} setUsername={setUsername}/>
      ) : (
        <div className="logout">
            <h1>{username}</h1>
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
      <p>{errMsg}</p>
    </div>
  );
};

const LogReg = ({ setMsg, setUsername }) => {
  const [userInfo, setUser] = useState({
    username: "",
    password: "",
  });
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
        })
        .catch((err) => {
            setMsg(err.response.data.message)
        });
    }
    setUser({ username: "", password: "" });
    setMsg("");
  };

  return (
    <div className="authUser">
      <form >
        <input
          type="text"
          className="login one"
          name="username"
          onChange={onChange}
          value={userInfo.username}
          placeholder="Username"
        />
        <input
          type="password"
          name="password"
          className="login two"
          onChange={onChange}
          value={userInfo.password}
          placeholder="Password"
        />
        </form>
        <div className="button-container">
        <Button
          onClick={onButton}
          name="login"
          variant="contained"
          startIcon={<LoginIcon />}>
          Login
        </Button>
        <Button
          onClick={onButton}
          name="register"
          variant="contained"
          startIcon={<LoginIcon />}>
          Register
        </Button>
        </div>
    </div>
  );
};

export default Auth;
