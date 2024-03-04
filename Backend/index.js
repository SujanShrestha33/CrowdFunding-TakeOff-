const express = require("express");
const connectDb = require("./dbConnection");
const app = express();
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

// Middlewares
app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());

const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.use(
  session({
    secret: "YOUR_SESSION_SECRET",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID:
        "136277636263-k8omr4stsgjlhsem6t326d8i70bn8i56.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      const user = await User.create({
        username: profile.displayName,
        email: profile.emails[0].value,
        password: profile.id,
      });
      cb(null, user);
    },
  ),
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/user/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  },
);

const authRoutes = require("./routes/auth");

app.use(authRoutes);

connectDb()
  .then(res => {
    console.log("Connected to database");
    app.listen(8080);
  })
  .catch(e => console.log(e.message));
