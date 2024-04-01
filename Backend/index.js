require("dotenv").config();
const express = require("express");
const connectDb = require("./dbConnection");
const app = express();
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const User = require("./models/User");
const cookieParser = require("cookie-parser");

// for file upload
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
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
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      const userExists = await User.find({ email: profile.emails[0].value });
      if (userExists) {
        return cb(null, userExists);
      }
      try {
        console.log(profile);
        const user = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          password: profile.id,
          isVerified: true,
        });
        await user.save();
        return cb(null, user);
      } catch (e) {
        return cb(e, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:4200/auth/login",
    successRedirect: "http://localhost:4200/",
  }),
);

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const profileRoutes = require("./routes/profile");
const esewaRoutes = require("./routes/esewa");
const adminRoutes = require("./routes/admin");

app.use(authRoutes);
app.use(projectRoutes);
app.use(profileRoutes);
app.use(esewaRoutes);
app.use(adminRoutes);

connectDb()
  .then((res) => {
    console.log("Connected to database");
    app.listen(8080);
  })
  .catch((e) => console.log(e.message));
