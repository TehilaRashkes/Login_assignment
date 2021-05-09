const jwt = require("jsonwebtoken");
const { User } = require("../db/models/user.model");
require("dotenv").config();

// check whether the request has a valid JWT access toke
module.exports.auth = (req, res, next) => {
  const token = req.body.accessToken;
  // verify the JWT
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      // there was an error
      // jwt is invalid - * DO NOT AUTHENTICATE *
      res.status(401).send(err);
    } else {
      // jwt is valid
      req.user_id = decoded._id;
      next();
    }
  });
};
