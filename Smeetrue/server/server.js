const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../src/views/css");

//Google Auth
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
  "414524429120-luneb60d6lof9ebf5j97qqqo6u5it3o1.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// Setup handlebars engine and views location
app.set("view engine", "ejs");
// app.set("views", viewsPath);
app.use(express.json());
app.use(cookieParser());

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("/", (req, res) => {
  res.render("index");
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
