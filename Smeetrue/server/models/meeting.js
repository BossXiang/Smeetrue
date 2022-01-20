const mongoose = require("mongoose");

const Meeting = mongoose.model("Meeting", {
  hostEmail: {
    type: String,
    required: true,
  },
  hostName: {
    type: String,
  },
  Name: {
    type: String,
  },
  roomID: {
    type: String,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  startTime: {
    type: Number,
    required: true,
  },
  endTime: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  attendeeEmails: [
    {
      type: String,
      default: "",
    },
  ],
});

module.exports = Meeting;
