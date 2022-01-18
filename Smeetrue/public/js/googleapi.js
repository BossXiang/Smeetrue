// function onSignIn(googleUser) {
//   var profile = googleUser.getBasicProfile();
//   console.log("User is " + JSON.stringify(profile));

//   var element = document.querySelector("#content");

//   var image = document.createElement("img");
//   image.setAttribute("src", profile.getImageUrl());

//   element.innerText =
//     "Name = " +
//     profile.getFamilyName() +
//     profile.getGivenName() +
//     "\nEmail = " +
//     profile.getEmail() +
//     "\n";

//   element.append(image);
// }

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/login");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    console.log("Signed in as: " + xhr.responseText);
    if (xhr.responseText === "success") {
      signOut();
      location.assign("/myprofile");
    }
  };
  xhr.send(JSON.stringify({ token: id_token }));
}

// function signOut() {
//   gapi.auth2
//     .getAuthInstance()
//     .signOut()
//     .then(function () {
//       console.log("user signed out!");
//     });
// }

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log("User signed out.");
  });
}
