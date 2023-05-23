const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter a username"],
    },
    telegramHandle: {
      type: String,
      required: [false, "Please enter a Telegram handle"],
    },
    address: {
      type: String,
      required: [true, "Please enter an address"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
