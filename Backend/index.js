const express = require("express");
const connectDb = require("./dbConnection");
const app = express();
const cors = require("cors");

// Middlewares
app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());

const authRoutes = require("./routes/auth");

app.use(authRoutes);

connectDb()
  .then(res => {
    console.log("Connected to database");
    app.listen(8080);
  })
  .catch(e => console.log(e.message));
