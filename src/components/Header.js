import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const username = localStorage.getItem("username");
  console.log(username);
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/")}
        >
          Back to explore
        </Button>
      ) : (
        <Stack spacing={2} direction="row">
          {username ? (
            <>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar alt={username} src="avatar.png" />
                <Typography variant="root" className="username-text">
                  {username}
                </Typography>
              </Stack>
              <Button
                variant="text"
                onClick={() => {
                  localStorage.clear();
                  history.push("/");
                  window.location.reload();
                }}
              >
                LOGOUT
              </Button>
            </>
          ) : (
            <>
              <Button variant="text" onClick={() => history.push("/login")}>
                LOGIN
              </Button>
              <Button
                variant="contained"
                onClick={() => history.push("/register")}
              >
                REGISTER
              </Button>
            </>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default Header;
