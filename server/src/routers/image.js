const { Router } = require("express");

const router = new Router();
const authUser = require("../middleware/authUser");
const ObjectId = require("mongoose").Types.ObjectId;
const multer = require("multer");
const sharp = require("sharp");
const upload = multer({
  limits: {
    fileSize: 10000000,
  },
  fileFilter(request, file, callback) {
    request.validFile = true;
    request.fileExist = false;
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      //  return callback(new Error('Pleas Upload Image File of : JPEG, JPG or PNG'))
      request.validFile = false;
      request.fileExist = true;
    }
    callback(undefined, true);
  },
});
const Image = require("../models/imageModel");
const Home = require("../models/homeModel");
const LostAndFound = require("../models/lafModel");
const {
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  OK,
  INVALID_DATA_PROVIDED,
  CONFLICT,
} = require("../services/http-response");

router.get("/api/image/:imageId", authUser, async (request, response) => {
  try {
    let imageId = request.params.imageId;
    let image = null;
    try {
      image = await Image.findOne({ _id: new ObjectId(imageId) });
    } catch (e) {
      return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
    }
    if (!image) {
      return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
    }
    image = image.toObject();
    delete image._id;
    delete image.__v;
    return response
      .status(OK.status)
      .send(`data:image/png;base64,${image.image.toString("base64")}`);
  } catch (error) {
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});

router.patch(
  "/api/image/:collection/:id",
  authUser,
  upload.single("image"),
  async (request, response) => {
    if (!request.params?.collection || !request.params?.id) {
      return response
        .status(INVALID_DATA_PROVIDED.status)
        .send(INVALID_DATA_PROVIDED.message);
    }
    if (!request.isAdmin) {
      return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
    }
    if (request.fileExist) {
      if (!request.validFile) {
        return response
          .status(INVALID_DATA_PROVIDED.status)
          .send(INVALID_DATA_PROVIDED.message);
      }
    }
    const imageData = Object.keys(request.body);
    const allowedData = ["image"];
    const isValidOperation = imageData.every((data) =>
      allowedData.includes(data)
    );
    if (!isValidOperation) {
      return response
        .status(INVALID_DATA_PROVIDED.status)
        .send(INVALID_DATA_PROVIDED.message);
    }
    try {
      const { collection, id: identifier } = request.params;
      if (!request.file) {
        return response
          .status(INVALID_DATA_PROVIDED.status)
          .send(INVALID_DATA_PROVIDED.message);
      }
      const buffer = await sharp(request.file.buffer)
        .resize({ width: 300, height: 300 })
        .png({ quality: 20 })
        .toBuffer();
      if (collection.toLowerCase() === "home") {
        const collectionItem = await Home.findOne({
          _id: new ObjectId(identifier),
        });
        if (!collectionItem) {
          return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
        }
        const image = new Image({ image: buffer });
        const uploadedImage = await image.save();
        collectionItem.images = [...collectionItem.images, uploadedImage._id];
        await collectionItem.save();
        return response.status(OK.status).send(OK.message);
      } else if (collection.toLowerCase() === "item") {
        const collectionItem = await LostAndFound.findById({ _id: identifier });
        if (!collectionItem) {
          return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
        }
        await Image.deleteOne({ _id: collectionItem.image });
        const image = new Image({ image: buffer });
        const uploadedImage = await image.save();
        collectionItem.image = uploadedImage._id;
        await collectionItem.save();
        return response.status(OK.status).send(OK.message);
      } else {
        return response.status(CONFLICT.status).send(CONFLICT.message);
      }
    } catch (error) {
      response
        .status(INTERNAL_SERVER_ERROR.status)
        .send(INTERNAL_SERVER_ERROR.message);
    }
  }
);

router.delete(
  "/api/image/:collection/:id/:imageId",
  authUser,
  async (request, response) => {
    const {
      collection = null,
      id: identifier = null,
      imageId = null,
    } = request.params;
    if (!collection || !identifier || !imageId) {
      return response
        .status(INVALID_DATA_PROVIDED.status)
        .send(INVALID_DATA_PROVIDED.message);
    }
    if (!request.isAdmin) {
      return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
    }
    try {
      if (collection.toLowerCase() === "home") {
        const collectionItem = await Home.findOne({
          _id: new ObjectId(identifier),
        });
        if (!collectionItem || !collectionItem.images.includes(imageId)) {
          return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
        }
        collectionItem.images = collectionItem.images.filter(
          (each) => each.toString() !== imageId
        );
        await Image.deleteOne({ _id: imageId });
        await collectionItem.save();
        return response.status(OK.status).send(OK.message);
      }
    } catch (e) {
      response
        .status(INTERNAL_SERVER_ERROR.status)
        .send(INTERNAL_SERVER_ERROR.message);
    }
  }
);

module.exports = router;
