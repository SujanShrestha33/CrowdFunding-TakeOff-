const express = require("express");

const connectDb = require("./dbConnection");

const app = express();

// Middlewares
app.use(express.json());

connectDb()
  .then(res => {
    console.log("Connected to database");
    app.listen(8080);
  })
  .catch(e => console.log(e.message));
