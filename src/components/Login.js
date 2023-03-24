import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [isLoading, setLoadingState] = useState(false);

  const history = useHistory();
  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    const URL = config.endpoint + "/auth/login";
    setLoadingState(true);
    try {
      const response = await axios.post(URL, {
        username: formData.username,
        password: formData.password,
      });
      console.log(response);
      if (response.status === 201) {
        enqueueSnackbar("Logged in successfully", { variant: "success" });
        persistLogin(
          response.data.token,
          response.data.username,
          response.data.balance
        );
        history.push("/");
      }
    } catch (err) {
      console.log(err.response);
      if (
        err.response &&
        err.response.data &&
        err.response.status >= 400 &&
        err.response.status < 500
      ) {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    } finally {
      console.log("Response arrived!");
      setLoadingState(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    const username = data.username;
    const password = data.password;
    let message = "";
    if (username === "") {
      message = "Username is a required field";
    } else if (password === "") {
      message = "Password is a required field";
    }

    if (message) {
      enqueueSnackbar(message, { variant: "warning" });
      return false;
    }
    return true;
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            placeholder="Username"
            variant="outlined"
            name="username"
            title="Username"
            fullWidth
            value={loginData.username}
            onChange={(event) =>
              setLoginData({ ...loginData, username: event.target.value })
            }
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            title="Password"
            placeholder="Password"
            name="password"
            fullWidth
            value={loginData.password}
            onChange={(event) =>
              setLoginData({ ...loginData, password: event.target.value })
            }
          />
          {isLoading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <Button
              variant="contained"
              className="button"
              onClick={() => {
                if (validateInput(loginData)) login(loginData);
              }}
            >
              LOGIN TO QKART
            </Button>
          )}
          <p className="secondary-action">
            Don’t have an account?{" "}
            <Link to="/register" className="link">
              Register now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
