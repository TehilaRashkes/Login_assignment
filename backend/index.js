const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const https = require("https");
const cors = require("cors");
// const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(
//   bodyParser.urlencoded({
//     limit: "50mb",
//     extended: true,
//     parameterLimit: 50000,
//   })
// );
// const server = require("http").createServer(app);
// const io = require("socket.io")(server);
// const { spawn } = require("child_process");

const { mongoose } = require("./db/mongoose");

//const sgMail = require("@sendgrid/mail");
// Load in the mongoose models
const { User } = require("./db/models/user.model");
// const { Property } = require("./db/models/property.model");
// const { Comment } = require("./db/models/comment.model");
// const { AirbnbProperty } = require("./db/models/airbnbProperty.model");
// const { AllProperty } = require("./db/models/all_property.model");

const jwt = require("jsonwebtoken");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

/* MIDDLEWARE  */

// Load middleware
app.use(bodyParser.json());

// CORS HEADERS MIDDLEWARE
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id"
//   );

//   res.header(
//     "Access-Control-Expose-Headers",
//     "x-access-token, x-refresh-token"
//   );

//   next();
// });

// check whether the request has a valid JWT access token
let authenticate = (req, res, next) => {
  let token = req.body.jwt;
  // verify the JWT
  jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
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

// Verify Refresh Token Middleware (which will be verifying the session)
let verifySession = (req, res, next) => {
  // grab the refresh token from the request header
  let refreshToken = req.header("x-refresh-token");
  refreshToken = req.body.refreshToken;
  // grab the _id from the request header
  let _id = req.header("_id");
  _id = req.body._id;

  User.findByIdAndToken(_id, refreshToken)
    .then((user) => {
      if (!user) {
        // user couldn't be found
        return Promise.reject({
          error:
            "User not found. Make sure that the refresh token and user id are correct",
        });
      }

      // if the code reaches here - the user was found
      // therefore the refresh token exists in the database - but we still have to check if it has expired or not

      req.user_id = user._id;
      req.userObject = user;
      req.refreshToken = refreshToken;

      let isSessionValid = false;

      user.sessions.forEach((session) => {
        if (session.token === refreshToken) {
          // check if the session has expired
          if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
            // refresh token has not expired
            isSessionValid = true;
          }
        }
      });

      if (isSessionValid) {
        // the session is VALID - call next() to continue with processing this web request
        next();
      } else {
        // the session is not valid
        return Promise.reject({
          error: "Refresh token has expired or the session is invalid",
        });
      }
    })
    .catch((e) => {
      res.status(401).send(e);
    });
};

/* END MIDDLEWARE  */

/* USER ROUTES */

/**
 * POST /users
 * Purpose: Sign up
 */
app.post("/sign-up", (req, res) => {
  // User sign up
  const newUser = new User(req.body.data);
  // const salt = bcrypt.genSaltSync(10);
  // newUser.password = bcrypt.hashSync(newUser.password, salt);
  User.findOne({
    email: newUser.email,
  }).then((userFind) => {
    if (userFind) {
      res.status(409).send("user is already exists");
    } else {
      newUser
        .save()
        .then(() => newUser.createSession())
        .then((refreshToken) => {
          // Session created successfully - refreshToken returned.
          // now we geneate an access auth token for the user
          return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken };
          });
        })
        .then((authTokens) => {
          console.log(authTokens);
          // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
          res
            .cookie("refreshToken", authTokens.refreshToken)
            .cookie("accessToken", authTokens.accessToken)
            .cookie("_id", newUser._id)
            .send(newUser);
        })
        .catch((e) => {
          console.log(e);
          res.status(400).send(e);
        });
    }

    // let email = newUser.email;
    // let password = newUser.password;

    //User.findByCredentials(email, password)
    //.then((user) => {

    // return user
    //   .createSession()
    //   .then((refreshToken) => {
    //     // Session created successfully - refreshToken returned.
    //     // now we geneate an access auth token for the user

    //     return user.generateAccessAuthToken().then((accessToken) => {
    //       // access auth token generated successfully, now we return an object containing the auth tokens
    //       return { accessToken, refreshToken };
    //     });
    //   })
    //   .then((authTokens) => {
    //     // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
    //     res
    //       .header("x-refresh-token", authTokens.refreshToken)
    //       .header("x-access-token", authTokens.accessToken)
    //       .send(user);
    //   });

    // else - the list object is undefined
  });
});
/**
 * POST /users
 * Purpose: login
 */
app.post("/sign-in", (req, res) => {
  const user = req.body.data;
  User.findByCredentials(user.email, user.password)
    .then((user) => {
      return user
        .createSession()
        .then((refreshToken) => {
          // Session created successfully - refreshToken returned.
          // now we geneate an access auth token for the user

          return user.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken };
          });
        })
        .then((authTokens) => {
          // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
          res
            .cookie("refreshToken", authTokens.refreshToken)
            .cookie("accessToken", authTokens.accessToken)
            .cookie("_id", user._id)
            .header("x-refresh-token", authTokens.refreshToken)
            .header("x-access-token", authTokens.accessToken)
            .send(user);
        });
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

/**
 * GET /users/me/access-token
 * Purpose: generates and returns an access token
 */

app.get("/refresh-token", verifySession, (req, res) => {
  // we know that the user/caller is authenticated and we have the user_id and user object available to us
  req.userObject
    .generateAccessAuthToken()
    .then((accessToken) => {
      res
        .header("x-access-token", accessToken)
        .send({ accessToken })
        .cookie("accessToken", accessToken)
        .cookie("refreshToken", refreshToken);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

app.post("/validate", authenticate, (req, res) => {
  User.findById(req.user_id)
    .then((user) => {
      console.log(user);
      res.send(user);
    })
    .catch((e) => res.send(e));
});

app.get("/", (req, res) => {
  User.find({}, (err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      res.send(err);
    }
  });
});

app.listen(8080, () => {
  console.log(" Server is listening on port 8080");
});
