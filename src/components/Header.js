import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import "./Header.css";
import { useHistory, Link } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  // console.log(children, hasHiddenAuthButtons);
  let history = useHistory();
  const [username, setUsername] = useState("")

  // const  = JSON.parse();
  // console.log(successData);

  useEffect(() => {
    // let user = JSON.parse(localStorage.getItem("username"))
    setUsername(localStorage.getItem("username"));
    console.log(username);
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.reload();
    history.push("/")
  }

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {children}
        {(!hasHiddenAuthButtons) ? 
        ((username) ?
        <Stack className="userAvatar" direction="row" spacing={2}>
          <img src="avatar.png" width={50} height={50} alt={username}></img>
          <p>{username}</p>
          <Button variant="text" onClick={logout}>LOGOUT</Button>
        </Stack> :
        <Stack direction="row" spacing={2}>
          <Link className="link" to="/login"><Button variant="text" >LOGIN</Button></Link>
          <Link className="link" to="/register"><Button variant="contained" >REGISTER</Button></Link>
        </Stack> ):
        <Button
          startIcon={<ArrowBackIcon />}
          variant="text"
          className="explore-button"
          onClick={() => history.push("/")}
          >Back to explore
        </Button>}

      </Box>
    );
};

export default Header;
