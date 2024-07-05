const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema(
  {
    documentId: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comments", CommentsSchema);

