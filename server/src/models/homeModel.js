//Schema Design for Lost And Found Items
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Properties Include: name, prices, description, available, picture
const homeSchema = new Schema({
  buildingName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  images: {
    //Image for the building
    type: [Schema.Types.ObjectId],
    default: [],
  },
  description: {
    // Who has claimed the item
    type: String,
    required: true,
    default: "",
  },
});

homeSchema.methods.toJSON = function () {
  const buildings = this;
  const buildingsObject = buildings.toObject();
  delete buildingsObject.__v;
  return buildingsObject;
};

const Home = mongoose.model("Home", homeSchema);

module.exports = Home;
