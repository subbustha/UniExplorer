//Schema Design for Lost And Found Items
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Properties Include: name, prices, description, available, picture
const itemSchema = new Schema({
  name: {
    //Name of the item that was found
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  image: {
    //Image for the pizza
    type: Schema.Types.ObjectId,
  },
  location: {
    //Location where the item was discovered
    type: String,
    required: true,
    maxlength: 50,
  },
  claimedBy: {
    // Who has claimed the item
    type: String,
    default: "",
  },
});

itemSchema.methods.toJSON = function () {
  const item = this;
  const itemObject = item.toObject();
  delete itemObject.__v;
  return itemObject;
};

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
