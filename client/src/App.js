import React, { useEffect, useState } from "react";
import {
  Paper,
  Grid,
  TextField,
  CssBaseline,
  Button,
  Box,
} from "@material-ui/core";
import Form from './Form'
import { isEqual } from "lodash";
import AuthHeader from './components/AuthHeader'
import FormStyle from "./styles/FormStyle";
import Copyright from "./components/Copyright";
import axios from "axios";
import Register from "./components/Register";
import Update from "./components/Update";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import ScaleLoader from "react-spinners/ScaleLoader";
const updatedText = "Successfully updated your profile!";

const useStyles = FormStyle;

export default function App() {
  const classes = useStyles();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    ga_email: "",
    full_name: "",
    active: false,
    mobile: "",
  });

  const [stage, setStage] = useState("check email");
  const [message, setMessage] = useState(
    "Enter your email to see if it's in the database."
  );
  const [buttonText, setButtonText] = useState("Check Email");
  const [user, setUser] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const [profileChanged, setProfileChanged] = useState(false);

  const handleInputChange = (e) => {
    if (e.target.name === "active") {
      setInputs({ ...inputs, active: !inputs.active });
      return;
    }
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    return;
  };

  const checkIfUserExists = () => {
    setLoading(true);
    axios
      .post("http://localhost:4000/exists", { email: inputs.email })
      .then(({ data }) => {
        setLoading(false);
        const { exists } = data;
        if (exists) {
          setStage("login");
          setButtonText("Check Password");
          setMessage("This email is registered. Enter your password");
        } else {
          setStage("register");
          setButtonText("Register");
          setMessage(
            "Email does not exist in our database. Register for the service"
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        setMessage("There was an error. Reload the page and try again.");
        console.error(err, "There was an error");
      });
  };

  const loginUser = () => {
    setLoading(true);

    axios
      .post("http://localhost:4000/login", {
        email: inputs.email,
        password: inputs.password,
      })
      .then(({ data }) => {
        setLoading(false);
        const { error, message: responseMessage, user: userData } = data;
        // console.log(userData, `from login`);
        if (error) {
          setMessage(responseMessage);
        } else {
          setStage("authenticated");
          console.log(`My user data is...`);
          console.log(userData);
          setUser({ ...inputs, ...userData });
          setInputs({ ...inputs, ...userData });
          setMessage(
            `You are authenticated as ${userData.email}. You may update your details below.`
          );
          setButtonText("Update");
        }
      })
      .catch((err) => {
        setLoading(false);
        setMessage("Something went wrong. Reload the page and try again.");
        console.error(err, "There was an error");
      });
  };

  const updateUser = () => {
    const { email, full_name, ga_email, active, mobile } = inputs;
    setLoading(true);
    axios
      .patch("http://localhost:4000/update", {
        email,
        full_name,
        ga_email,
        active,
        mobile,
      })
      .then(({ data }) => {
        const { error, user: userData } = data;
        setProfileChanged(false);
        // console.log(res.data);
        if (!error) {
          setLoading(false);
          setMessage("Your profile was updated successfully.");
          setStage("updated profile");
          setUser({ ...inputs, ...userData });
          setInputs({ ...inputs, ...userData });
          setButtonText(updatedText);
        } else {
          setLoading(false);
          setMessage(
            "Something went wrong while trying to update your user. Reload the page and try again."
          );
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage(
          "Something went wrong while trying to update your user. Reload the page and try again."
        );
      });
  };

  const registerUser = () => {
    setLoading(true);
    axios
      .post("http://localhost:4000/register", inputs)
      .then(({ data }) => {
        setTimeout(setLoading(false), 800);
        const err = data.error;
        console.log(data);
        if (!err) {
          const { user: userData } = data;
          setStage("authenticated");
          setUser({ ...inputs, ...userData });
          setInputs({ ...inputs, ...userData });
          setMessage(
            `You are now registered as ${userData.email}, and are subscribed to the service. You may turn off the service below.`
          );
          setButtonText("Update");
        } else {
          setMessage(data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err, "There was an error");
      });
  };

  // useEffect(() => {
  //   console.log(`Use effect user log`, user);
  // }, [user]);

  useEffect(() => {
    if (stage==="authenticated" || stage==="updated profile") {
      if (!isEqual(inputs, user)) {
        setButtonText("Update");
        setProfileChanged(true);
        return;
      }
      setProfileChanged(false);
    }
    
  }, [inputs]);

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={3} md={5} className={classes.image} />
      <Grid item xs={12} sm={9} md={7} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <AuthHeader classes={classes} stage={stage} message={message} />

          <Form classes={classes} stage={stage} message={message} checkIfUserExists={checkIfUserExists} registerUser={registerUser} loginUser={loginUser} loading={loading} profileChanged={profileChanged} updateUser={updateUser} handleInputChange={handleInputChange} inputs={inputs} user={user} buttonText={buttonText}/>

          <Box mt={5}>
            <Welcome />

            <Copyright />
          </Box>
        </div>
      </Grid>
    </Grid>
  );
}
