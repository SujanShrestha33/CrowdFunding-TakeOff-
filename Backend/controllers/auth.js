const User = require("../models/User");

exports.signupUser = async (req, res) => {
  const { username, email, password } = req.body;
  const newUser = new User({ username, email, password });
  newUser
    .save()
    .then(res => console.log("user saved"))
    .catch(err => console.log(err));
};
