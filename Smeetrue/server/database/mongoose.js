const mongoose = require("mongoose");

const dbURL = "mongodb://127.0.0.1:27017/Smeetrue";
const databaseName = "Smeetrue";
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log(err);
  });
