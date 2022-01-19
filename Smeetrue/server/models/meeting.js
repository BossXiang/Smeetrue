const mongoose = require("mongoose");

const Meeting = mongoose.model("Meeting", {
  id: {
    type: String,
  },
  hostID: {
    type: String,
  },
  roomID: {
    type: String,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  description: {
    type: String,
  },
  attendeeIDs: {
    type: String,
  },
});

module.exports = Meeting;
