const mongoose = require("mongoose");

const Room = mongoose.model("Room", {
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
  },
});

module.exports = Room;
