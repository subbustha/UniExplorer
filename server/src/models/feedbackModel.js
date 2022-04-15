//Schema Design for Lost And Found Items
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Properties Include: name, prices, description, available, picture
const feedbackSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
});

feedbackSchema.methods.toJSON = function () {
  const feedback = this;
  const feedbackObject = feedback.toObject();
  delete feedbackObject.__v;
  return feedbackObject;
};

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
