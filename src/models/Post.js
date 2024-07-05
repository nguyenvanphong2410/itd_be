const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  pdf: {
    type: String,
    required: false,
  },
  photos: [
    {
      src: {
        type: String,
      },
      base64: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
  ],
  username: {
    type: String,
    required: true,
  },
  // categories: {
  //   type: Array,
  //   required: false
  // },
  category: {
    type: String,
    required: false
  },
  author:{
    type: String,
    required: false,
  },
  publisher:{
    type: String,
    required: false,
  },
  status: {
    type: Boolean,
    default: false
  },
  view: {
    type: Number,
    default: 0
  },
  year: {
    type: Number,
    required: false
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("Documents", PostSchema);