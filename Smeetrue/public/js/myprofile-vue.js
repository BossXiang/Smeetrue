const app = Vue.createApp({
  data() {
    return {
      isEditing: false,
      firstName: "",
      lastName: "",
      email: "",
      gender: "",
      occupation: "",
      personalInfo: "",
    };
  },
  computed: {
    textColor() {
      if (this.isEditing) return "white";
      else return "#CCC";
    },
  },
  methods: {
    setEditing(value) {
      this.isEditing = value;
    },
    // getProfile() {
    //   var auth2 = gapi.auth2.getAuthInstance();
    //   if (auth2.isSignedIn.get()) {
    //     var profile = auth2.currentUser.get().getBasicProfile();
    //     console.log("ID: " + profile.getId());
    //     console.log("Full Name: " + profile.getName());
    //     console.log("Given Name: " + profile.getGivenName());
    //     console.log("Family Name: " + profile.getFamilyName());
    //     console.log("Image URL: " + profile.getImageUrl());
    //     console.log("Email: " + profile.getEmail());
    //   }
    // },
  },
});

app.mount("#myprofile-page");
