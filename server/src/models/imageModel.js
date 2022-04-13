//Schema Design for Lost And Found Items
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Properties Include: name, prices, description, available, picture
const imageSchema = new Schema({
  image: {
    type: Buffer,
  },
});

imageSchema.methods.toJSON = function () {
  const image = this;
  const imageObject = image.toObject();
  delete imageObject.__v;
  return imageObject;
};

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
