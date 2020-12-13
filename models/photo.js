const { Schema, model } = require("mongoose");

const photoSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      max: 50,
    },
    publicId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Photo = model("Photo", photoSchema);

module.exports = Photo;
