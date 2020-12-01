require("dotenv").config();
const User = require("../models/user");
const argon2 = require("argon2");

const errorHandler = (res, errData, message) => {
  let response = {};
  console.error(errData);
  response.message = message;
  res.status(500);
  response.error = true;
  res.json(response);
};

const setResponse = (res, errorExists, message, userData, existsField) => {
  let response = {};
  response.error = errorExists;
  response.message = message;
  if (userData) {
    response.user = userData;
  }
  if (existsField) {
    // This is only for checkIfUserExists route
    response.exists = existsField;
  }
  res.json(response);
};

const controllers = {
  register: async (req, res) => {
    // Check if user exists.
    const { email, password } = req.body;
    if (await User.findOne({ email })) {
      setResponse(res, true, "Email is already in use.");
      return;
    }

    let argon2Hash;

    try {
      argon2Hash = await argon2.hash(password);
    } catch (err) {
      errorHandler(res, err, "There was an unexpected system error.");
    }

    try {
      const newUser = await User.create({ ...req.body, password: argon2Hash });
      let { ga_email, full_name, active, mobile, last_declared } = newUser;
      let userDataToSend = { ga_email, full_name, active, mobile, email: newUser.email, last_declared };
      setResponse(res, false, "User was created successfully.", userDataToSend);
    } catch (err) {
      errorHandler(res, err, "There was an unexpected system error.");
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      setResponse(res, true, "No user with that email found.");
    }
    try {
      const passwordVerified = await argon2.verify(user.password, password);
      if (passwordVerified) {
        let { ga_email, full_name, active, mobile, last_declared } = user;
        setResponse(res, false, "Login successful.", { email: user.email, ga_email, full_name, active, mobile, last_declared });
      } else {
        setResponse(res, true, "Password is incorrect.");
      }
    } catch (err) {
      errorHandler(res, err, "There was an unexpected system error.");
    }
  },

  checkIfUserExists: async (req, res) => {
    const { email } = req.body;
    try {
      if (await User.findOne({ email })) {
        setResponse(res, false, "This user exists.", null, true);
        return;
      } else {
        setResponse(res, false, "The user does not exist.", null, false);
      }
    } catch (err) {
      errorHandler(res, err, "There was an unexpected system error.");
    }
  },

  updateUser: async (req, res) => {
    let { email, ga_email, full_name, active, mobile } = req.body;
    User.findOneAndUpdate(
      { email },
      { ga_email, full_name, active, mobile },
      { new: true } // returns the updated document
    )
      .then((updatedUser) => {
        let userDataToSend = {
          email: updatedUser.email,
          ga_email: updatedUser.ga_email,
          full_name: updatedUser.full_name,
          active: updatedUser.active,
          mobile: updatedUser.mobile,
          last_declared: updatedUser.last_declared
        }
        setResponse(res, false, "Update was successful.", userDataToSend);
      })
      .catch((err) => {
        errorHandler(res, err, "There was an unexpected system error.");
      });
  },

  getScheduledTime: (req, res) => {
    let cronTime = process.env.SCHEDULED_TIME_TO_RUN.split(" ");
    function dayOfWeekAsString(dayIndex) {
      return (
        [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ][dayIndex] || ""
      );
    }
    let hour = cronTime[1]; // hour is the second number in the cron string
    if (hour.toString().length < 2) {
      hour = "0" + hour;
    }
    const day = dayOfWeekAsString(cronTime[4]); // day of the week is the fifth number in the cron string
    res.send(`${day}, ${hour}:00 hrs`);
  }
};

module.exports = controllers;
