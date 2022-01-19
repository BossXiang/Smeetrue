const app = Vue.createApp({
  data() {
    return {
      isEditing: false,
      name: "",
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
    loadProfile() {
      var comp = this;
      var xhr = new XMLHttpRequest();
      var url = "/info/userProfile";
      xhr.open("GET", url, false);
      xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            const result = JSON.parse(this.responseText);
            console.log(result);
            comp.name = result.name;
            comp.email = result.email;
            comp.gender = result.gender;
            comp.occupation = result.occupation;
            comp.personalInfo = result.personalInfo;
          } else {
            console.log(this.status, this.statusText);
          }
        }
      };
      xhr.send();
    },
    saveProfile() {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/updateProfile");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = () => {
        const DONE = 4;
        const CREATED = 201;
        if (xhr.readyState === DONE) {
          if (xhr.status === CREATED || xhr.status === 200) {
            //this.response = xhr.response;
            console.log(xhr.response);
          } else {
            this.response = "Error: " + xhr.status;
          }
        }
      };
      xhr.send(
        JSON.stringify({
          name: this.name,
          email: this.email,
          gender: this.gender,
          occupation: this.occupation,
          personalInfo: this.personalInfo,
        })
      );
    },
    editSave() {
      this.saveProfile();
      this.setEditing(false);
    },
    editCancel() {
      this.loadProfile();
      this.setEditing(false);
    },
  },
  mounted() {
    this.loadProfile();
  },
});

app.mount("#myprofile-page");
