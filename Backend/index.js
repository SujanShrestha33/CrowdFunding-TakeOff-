const express = require("express");

const connectDb = require("./dbConnection");

const app = express();

// Middlewares
app.use(express.json());

const authRoutes = require("./routes/auth");

app.use(authRoutes);

connectDb()
  .then(res => {
    console.log("Connected to database");
    app.listen(8080);
  })
  .catch(e => console.log(e.message));
