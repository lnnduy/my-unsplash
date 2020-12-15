const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const app = express();

dotenv.config();
mongoose.connect(
  process.env.MONGO_URI,
  { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to database")
);
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api", require("./routes"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", path.join(__dirname, "client", "build", "index.html"));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(PORT));
