const mongoose = require("mongoose");

//const dbURL = "mongodb://127.0.0.1:27017/Smeetrue";
const dbURL =
  "mongodb+srv://Xiang:abc123456@cluster0.j3hhn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
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
