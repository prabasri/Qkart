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
  // debugger;
  const { enqueueSnackbar } = useSnackbar();

  const [loginData, setLoginData] = useState({
    username:"",
    password:""
  })
  const [isLoading, setLoading] = useState(false);
  // const [isLogged, setIsLogged] = useState(false);

  // useEffect(() => {
  //   console.log(isLogged)
  // }, [isLogged]);
  let history = useHistory();

  const handleChange = (e) => {
    let {name, value} = e.target;
    setLoginData((prevState) => ({...prevState, [name] : value}))
  }
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
  const login = async (e) => {
    e.preventDefault();
    // console.log(validateInput(loginData));
    // console.log(isLogged);

    if(validateInput(loginData)) {
      setLoading(true);
      try {
        const data = {
          username:loginData.username,
          password:loginData.password
        }

        let POSTloginData = await axios.post(`${config.endpoint}/auth/login`, data);
        // console.log(`${config.endpoint}/auth/login`);
        console.log(POSTloginData);

        persistLogin(POSTloginData.data.token, POSTloginData.data.username, POSTloginData.data.balance)
        
        setLoginData({
          username:"",
          password:""
        })

        if(POSTloginData.data.success) {
          // setIsLogged((prevState) => ({ ...prevState, isLogged: !isLogged }));
          // setIsLogged(true);
          enqueueSnackbar("Logged in successfully", {variant:"success"});
          history.push("/products");
        
        }
        setLoading(false);

      } catch(error) {

        setLoading(false);
        // setIsLogged(false);
        console.log(error.response);

        if(error.response.status%400 === 0 ) {
          enqueueSnackbar(error.response.data.message, {variant:"error"})
        } else {
          enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {variant:"error"})
        }
        setLoading(false);
      }
    }
    setLoading(false);
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
    if(data.username === "") {
      enqueueSnackbar("Username is a required field", {variant: "error"});
      return false;
    }
    if(data.password === "") {
      enqueueSnackbar("Password is a required field", {variant: "error"});
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
    // let successData = {
    //   token: token,
    //   username: username,
    //   balance: balance
    // }
    console.log(token, username, balance);
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    localStorage.setItem("balance", balance);
  };
  // console.log(isLogged)
  
  return (
    
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      
      <Header hasHiddenAuthButtons = {true} />
    {/* {isLogged ? <Header><Products children={isLogged} /></Header>:<Header hasHiddenAuthButtons = {true} />} */}
      <Box className="content">
        <Stack spacing={2} className="form">
        <h2 className="title">Login</h2>
          <TextField
            id="loginUsername"
            label="username"
            name="username"
            onChange={(e) => handleChange(e)}
            fullWidth
          />
          <TextField
            id="loginPassword"
            label="password"
            name="password"
            onChange={(e) => handleChange(e)}
            fullWidth
          />
          <Box>{isLoading ? <CircularProgress/> :
            <Button className="button" variant="contained" color="success" onClick={(e) => login(e)}>LOGIN TO QKART</Button>}
          </Box>
          <p className="secondary-action">
            Don't have an account?
             <Link className="link" to="/register">
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
