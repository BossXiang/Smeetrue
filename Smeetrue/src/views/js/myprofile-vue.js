const app = Vue.createApp({
  data() {
    return {
      isEditing: false,
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
  },
});

app.mount("#myprofile-page");
