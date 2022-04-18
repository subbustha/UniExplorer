const express = require("express");
const authUser = require("../middleware/authUser");
const Home = require("../models/homeModel");
const Image = require("../models/imageModel");
const multer = require("multer");
const sharp = require("sharp");
const {
  UNAUTHORIZED,
  INVALID_DATA_PROVIDED,
  NOT_FOUND,
  OK,
  INTERNAL_SERVER_ERROR,
} = require("../services/http-response");
const upload = multer({
  limits: {
    fileSize: 10000000,
  },
  fileFilter(request, file, callback) {
    request.validFile = true;
    request.fileExist = false;
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
      //  return callback(new Error('Pleas Upload Image File of : JPEG, JPG or PNG'))
      request.validFile = false;
      request.fileExist = true;
    }
    callback(undefined, true);
  },
});
const router = new express.Router();

//Router to create building
router.post(
  "/api/home",
  authUser,
  upload.single("images"),
  async (request, response) => {
    if (!request.isAdmin) {
      return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
    }
    if (request.fileExist) {
      if (!request.validFile) {
        return response.status(406).send("Invalid Data Provided");
      }
    }
    const homeData = Object.keys(request.body);
    const allowedData = ["buildingName", "images", "description"];
    const isValidOperation = homeData.every((data) =>
      allowedData.includes(data)
    );
    if (!isValidOperation) {
      return response.status(406).send("Invalid Data Provided");
    }
    try {
      if (request.file) {
        const buffer = await sharp(request.file.buffer)
          .resize({ width: 300, height: 300 })
          .png({ quality: 20 })
          .toBuffer();
        const image = new Image({ image: buffer });
        const result = await image.save();
        request.body.images = [result._id];
      }
      const home = new Home(request.body);
      await home.save();
      response.status(201).send(home);
    } catch (error) {
      response.status(500).send("Internal Server Error");
    }
  }
);
//Router to get all buildings
router.get("/api/home", authUser, async (request, response) => {
  try {
    const buildings = await Home.find({});
    if (!buildings) {
      return response.status(404).send("Items not found");
    }
    response.status(200).send(buildings);
  } catch (error) {
    response.status(500).send("Internal Server Error");
  }
});

//Router to update a building info with id
router.patch("/api/home/:id", authUser, async (request, response) => {
  if (!request.isAdmin) {
    return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
  }
  const itemData = Object.keys(request.body);
  const allowedData = ["buildingName", "description"];
  const isValidOperation = itemData.every((data) => allowedData.includes(data));
  if (
    !isValidOperation ||
    !request.params?.id ||
    !request.body?.buildingName ||
    !request.body?.description
  ) {
    return response
      .status(INVALID_DATA_PROVIDED.status)
      .send(INVALID_DATA_PROVIDED.message);
  }
  try {
    let buildingInfo = null;
    try {
      buildingInfo = await Home.findById({ _id: request.params.id });
    } catch (error) {
      return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
    }

    if (!buildingInfo) {
      return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
    }
    buildingInfo.buildingName = request.body.buildingName;
    buildingInfo.description = request.body.description;
    await buildingInfo.save();
    response.status(OK.status).send(OK.message);
  } catch (error) {
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});
//Router to delete an item with id
router.delete("/api/home/:id", authUser, async (request, response) => {
  if (!request.params?.id) {
    return response
      .status(INVALID_DATA_PROVIDED.status)
      .send(INVALID_DATA_PROVIDED.message);
  }
  if (!request.isAdmin) {
    return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
  }
  try {
    try {
      const buildingInfo = await Home.findById({ _id: request.params.id });
      if (!buildingInfo) {
        return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
      }
      if (buildingInfo.images.length !== 0) {
        buildingInfo.images.forEach(async (imageId) => {
          try {
            await Image.deleteOne({ _id: imageId });
          } catch (error) {}
        });
      }
      await Home.deleteOne({ _id: request.params.id });
      return response.status(OK.status).send(OK.message);
    } catch (error) {
      return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
    }
  } catch (error) {
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});
module.exports = router;
