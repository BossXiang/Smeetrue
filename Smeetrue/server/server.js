const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const validator = require("validator");

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
app.post("/api/createProfile", (req, res) => {
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
const { profile } = require("console");
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
app.post("/api/updateMeeting", (req, res) => {
  console.log(req.body);
  Meeting.updateOne(
    { _id: req.body._id },
    {
      name: req.body.name,
      hostName: req.body.hostName,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      attendeeEmails: req.attendeeEmails,
    }
  )
    .then((profile) => {
      res.send(profile);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});
app.post("/api/profile/addMeeting/:email/:id", (req, res) => {
  console.log(req.body);
  addMeeting(req.params.email, req.params.id);
  res.send("Finished!");
});
function addMeeting(_email, _id) {
  Profile.updateOne(
    { email: _email },
    {
      $push: { hostMeetingIDs: _id },
    }
  )
    .then((profile) => {
      res.send(profile);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
}
app.post("/api/createMeeting", (req, res) => {
  const meeting = new Meeting(req.body);
  meeting
    .save()
    .then((result) => {
      const _id = result._id.toString();
      addMeeting(req.body.hostEmail, _id);
      for (var i in req.body.attendeeEmails) {
        addMeeting(req.body.attendeeEmails[i], _id);
      }
      res.status(201).send(meeting);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
app.delete("/api/deleteMeeting", (req, res) => {});
app.post("/api/updateMeeting", (req, res) => {});
app.get("/api/meeting/:id", (req, res) => {
  Meeting.find({ _id: req.params.id })
    .then((meetings) => {
      res.status(200).send(meetings);
    })
    .catch((e) => {
      res.status(500).send();
    });
});
app.get("/api/meetings/:month/:day", (req, res) => {
  Meeting.find({ month: req.params.month, day: req.params.day })
    .then((meetings) => {
      res.status(200).send(meetings);
    })
    .catch((e) => {
      res.status(500).send();
    });
});
app.get("/api/getMeetings/:month/:email", (req, res) => {
  Meeting.find({
    month: req.params.month,
    hostEmail: req.params.email,
  })
    .then((meetings) => {
      res.status(200).send(meetings);
    })
    .catch((e) => {
      res.status(500).send();
    });
});
app.get("/api/getMeetings/:month/:day/:email", (req, res) => {
  Meeting.find({
    month: req.params.month,
    day: req.params.day,
    hostEmail: req.params.email,
  })
    .then((meetings) => {
      res.status(200).send(meetings);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

const Room = require("./models/room");
app.get("/api/rooms", (req, res) => {
  Room.find({})
    .then((rooms) => {
      res.status(200).send(rooms);
    })
    .catch((e) => {
      res.status(500).send();
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

    Profile.findOne({ email: payload.email }).then((profile) => {
      if (!profile) {
        const newProfile = new Profile({
          name: payload.name,
          email: payload.email,
          gender: "",
          occupation: "",
          personalInfo: "New comer!!",
          meetingIDs: [],
          hostMeetingIDs: [],
        });
        newProfile
          .save()
          .then(() => {
            console.log("New profile created!");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });

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

//Create dummy data (profile & room)
app.post("/api/dummyProfileInit", (req, res) => {
  Profile.deleteMany({})
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  for (var i = 1; i < 10; i++) {
    const profile = new Profile({
      email: "b1081500" + String(i) + "@gapps.ntust.edu.tw",
      name: "同學" + String(i),
      gender: "",
      occupation: "",
      personalInfo: "New comer!!",
      meetingIDs: [],
      hostMeetingIDs: [],
    });
    profile.save();
  }
  for (var i = 10; i < 66; i++) {
    const profile = new Profile({
      email: "b108150" + String(i) + "@gapps.ntust.edu.tw",
      name: "同學" + String(i),
      gender: "",
      occupation: "",
      personalInfo: "New comer!!",
      meetingIDs: [],
      hostMeetingIDs: [],
    });
    profile.save();
  }
  console.log("dummy profiles successfully initialized!");
  res.status(201).send();
});
app.post("/api/roomInit", (req, res) => {
  Room.deleteMany({})
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  const room1 = new Room({
    id: "0",
    name: "RoomA",
    location: "location",
    description: "description area",
  }).save();
  const room2 = new Room({
    id: "1",
    name: "RoomB",
    location: "location",
    description: "description area",
  }).save();
  const room3 = new Room({
    id: "2",
    name: "RoomC",
    location: "location",
    description: "description area",
  }).save();
  const room4 = new Room({
    id: "3",
    name: "RoomD",
    location: "location",
    description: "description area",
  }).save();
  const room5 = new Room({
    id: "4",
    name: "RoomE",
    location: "location",
    description: "description area",
  }).save();
  console.log("rooms successfully initialized!");
  res.status(201).send();
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT + "...");
});
