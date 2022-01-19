const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

//variables
var isLoggedIn = false;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../src/views/css");

//Google Auth
const { OAuth2Client, UserRefreshClient } = require("google-auth-library");
const CLIENT_ID =
  "414524429120-luneb60d6lof9ebf5j97qqqo6u5it3o1.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// Setup handlebars engine and views location (Middle ware)
app.set("view engine", "ejs");
// app.set("views", viewsPath);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

// const profiles = require("./routes/api/profiles");
// app.use("/api/profiles", profiles);
require("./database/mongoose");
const Profile = require("./models/profile");
app.get("/api/profiles", (req, res) => {
  Profile.find({})
    .then((profiles) => {
      res.status(201).send(profiles);
    })
    .catch((e) => {
      res.status(500).send();
    });
});
app.get("/api/profiles/:email", (req, res) => {
  const _email = req.params.email;
  Profile.findOne({ email: _email })
    .then((profile) => {
      if (!profile) {
        return res.status(404).send();
      }
      res.send(profile);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});
app.post("/api/profiles", (req, res) => {
  const profile = new Profile(req.body);
  profile
    .save()
    .then(() => {
      res.status(201).send(profile);
    })
    .catch((err) => {
      res.status(400).send(profile);
    });
});
app.post("/api/updateProfile", (req, res) => {
  console.log(req.body);
  Profile.updateOne(
    { email: req.body.email },
    {
      name: req.body.name,
      gender: req.body.gender,
      occupation: req.body.occupation,
      personalInfo: req.body.personalInfo,
    }
  )
    .then((profile) => {
      res.send(profile);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

const Meeting = require("./models/meeting");
app.get("/api/meetings", (req, res) => {
  Meeting.find({})
    .then((meetings) => {
      res.status(201).send(meetings);
    })
    .catch((e) => {
      res.status(500).send();
    });
});
app.get("/api/meetings/:id", (req, res) => {
  const _id = req.params.id;
  Meeting.findOne({ id: _id })
    .then((meeting) => {
      if (!meeting) {
        return res.status(404).send();
      }
      res.send(meeting);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});
app.post("/api/meetings", (req, res) => {
  const meeting = new Meeting(req.body);
  meeting
    .save()
    .then(() => {
      res.status(201).send(meeting);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("/", isAuthenticated, (req, res) => {
  res.render("index", { isLoggedIn });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  let token = req.body.token;

  //console.log(token);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    console.log(payload);
  }
  verify()
    .then(() => {
      res.cookie("session-token", token);
      res.send("success");
    })
    .catch(console.error);
});

app.get("/profile", checkAuthenticated, (req, res) => {
  let user = req.user;
  res.render("profile", { user });
});

app.get("/protectedroute", checkAuthenticated, (req, res) => {
  res.render("protectedroute");
});

app.get("/logout", (req, res) => {
  res.clearCookie("session-token");
  isLoggedIn = false;
  res.redirect("/");
});

app.get("/calendar", checkAuthenticated, (req, res) => {
  let user = req.user;
  res.render("calendar", { user });
});

app.get("/mymeeting", checkAuthenticated, (req, res) => {
  let user = req.user;
  res.render("mymeeting", { user });
});

app.get("/myprofile", checkAuthenticated, (req, res) => {
  let user = req.user;
  res.render("myprofile", { user });
});

app.get("/info/userProfile", checkAuthenticated, (req, res) => {
  let user = req.user;
  const _email = user.email;
  Profile.findOne({ email: _email })
    .then((profile) => {
      if (!profile) {
        return res.status(404).send();
      }
      res.status(200).send(profile);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

function isAuthenticated(req, res, next) {
  let token = req.cookies["session-token"];
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      aidoemce: CLIENT_ID,
    });
    const payload = ticket.getPayload();
  }
  verify()
    .then(() => {
      isLoggedIn = true;
      next();
    })
    .catch((err) => {
      isLoggedIn = false;
      next();
    });
}

function checkAuthenticated(req, res, next) {
  let token = req.cookies["session-token"];

  let user = {};
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      aidoemce: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    user.firstname = payload.given_name;
    user.lastname = payload.family_name;
    user.email = payload.email;
    user.picture = payload.picture;
  }
  verify()
    .then(() => {
      req.user = user;
      next();
    })
    .catch((err) => {
      res.redirect("/login");
    });
}

app.listen(PORT, () => {
  console.log("Server running on port " + PORT + "...");
});
