function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log("User is " + JSON.stringify(profile));

  var element = document.querySelector("#content");

  var image = document.createElement("img");
  image.setAttribute("src", profile.getImageUrl());

  element.innerText =
    "Name = " +
    profile.getFamilyName() +
    profile.getGivenName() +
    "\nEmail = " +
    profile.getEmail() +
    "\n";

  element.append(image);
}

function signOut() {
  gapi.auth2
    .getAuthInstance()
    .signOut()
    .then(function () {
      console.log("user signed out!");
    });
}
