const express = require("express");
//const mongodb = require("mongodb");
const mongoose = require("mongoose");

const router = express.Router();

//Get profiles
router.get("/", async (req, res) => {
  //const profiles = await loadProfilesCollection();
  const profiles = Profiles;
  res.send(await profiles.find({}).toArray());
});

//Add profiles

//Delete profiles

//Connect to the mongodb
//const dbURL =
//"mongodb+srv://Tom:<psd>@cluster0.j3hhn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const dbURL = "mongodb://127.0.0.1:27017/Smeetrue";
const databaseName = "Smeetrue";
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true,
  })
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log(err);
  });

const me = new Profile({
  email: "asdsafa",
});
me.save()
  .then(() => {
    console.log(me);
  })
  .catch((error) => {
    console.log("Error!", error);
  });

// const profileSchema = new mongoose.Schema(
//   {
//     firstname: {
//       type: String,
//     },
//     lastname: {
//       type: String,
//     },
//     email: {
//       type: String,
//       require: true,
//     },
//     gender: {
//       type: String,
//     },
//     occupation: {
//       type: String,
//     },
//     personalInfo: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );
// const Profiles = mongoose.model("profiles", profileSchema);

// async function loadProfilesCollection() {
//   return client.db("Cluster0").collection("profiles");
// }

module.exports = router;
