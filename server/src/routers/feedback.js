const express = require("express");
const authUser = require("../middleware/authUser");
const Feedback = require("../models/feedbackModel");
const {
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
  OK,
  INVALID_DATA_PROVIDED,
  CREATED,
  NOT_FOUND,
} = require("../services/http-response");

const router = new express.Router();

router.get("/api/feedback", authUser, async (request, response) => {
  if (!request.isAdmin) {
    return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
  }
  try {
    const allFeedbacks = await Feedback.find({});
    return response.status(OK.status).send(allFeedbacks);
  } catch (error) {
    return response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});
router.post("/api/feedback", authUser, async (request, response) => {
  if (request.isAdmin) {
    return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
  }
  try {
    const { message = "" } = request.body;
    if (!message) {
      return response
        .status(INVALID_DATA_PROVIDED.status)
        .send(INVALID_DATA_PROVIDED.message);
    }
    const feedback = new Feedback({ message });
    await feedback.save();
    return response.status(CREATED.status).send(CREATED.message);
  } catch (error) {
    return response
      .status(INTERNAL_SERVER_ERROR.status)
      .message(INTERNAL_SERVER_ERROR.message);
  }
});

router.delete("/api/feedback/:id", authUser, async (request, response) => {
  if (!request.isAdmin) {
    return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
  }
  try {
    const { id = "" } = request.params;
    if (!id) {
      return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
    }
    const feedback = await Feedback.findById({ _id: id });
    if (!feedback) {
      return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
    }
    await Feedback.deleteOne({ _id: id });
    return response.status(OK.status).send(OK.message);
  } catch (error) {
    return response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});

module.exports = router;
