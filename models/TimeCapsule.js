const mongoose = require("mongoose");

const timeCapsuleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: false,
    },
    imageUrl: {
      type: String, 
      required: false,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    isReleased: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TimeCapsule", timeCapsuleSchema);