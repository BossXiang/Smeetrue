const mongoose = require("mongoose");

const Profile = mongoose.model("Profile", {
  id: {
    type: String,
  },
  email: {
    type: String,
    require: true,
  },
  name: {
    type: String,
  },
  gender: {
    type: String,
  },
  occupation: {
    type: String,
  },
  personalInfo: {
    type: String,
  },
  meetingIDs: [
    {
      type: String,
    },
  ],
  hostMeetingIDs: [
    {
      type: String,
    },
  ],
});

module.exports = Profile;
