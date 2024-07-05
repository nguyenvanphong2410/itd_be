const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: { type: String, required: true },
  thumbnail: {
    type: String,
    default: null,
  },
  slug: {
    type: String,
    require: true,
    unique: true,
  }
},
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);