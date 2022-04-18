const express = require("express");
const authUser = require("../middleware/authUser");
const Item = require("../models/lafModel");
const Image = require("../models/imageModel");
const multer = require("multer");
const sharp = require("sharp");
const {
  UNAUTHORIZED,
  NOT_FOUND,
  INVALID_DATA_PROVIDED,
  INTERNAL_SERVER_ERROR,
  OK,
} = require("../services/http-response");
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
const router = new express.Router();

//Router to create item
router.post(
  "/api/item",
  authUser,
  upload.single("image"),
  async (request, response) => {
    if (!request.isAdmin) {
      return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
    }
    if (request.fileExist) {
      if (!request.validFile) {
        return response.status(406).send("Invalid Data Provided");
      }
    }
    const itemData = Object.keys(request.body);
    const allowedData = ["name", "image", "location", "claimedBy"];
    const isValidOperation = itemData.every((data) =>
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
        request.body.image = result.id;
      }

      const item = new Item(request.body);
      await item.save();
      response.status(201).send(item);
    } catch (error) {
      response.status(500).send("Internal Server Error");
    }
  }
);
//Router to get all items
router.get("/api/item", authUser, async (request, response) => {
  try {
    const items = await Item.find({});
    if (!items) {
      return response.status(404).send("Items not found");
    }
    response.status(200).send(items);
  } catch (error) {
    response.status(500).send("Internal Server Error");
  }
});
//Router to update an item with id
router.patch("/api/item/:id", authUser, async (request, response) => {
  if (!request.params?.id) {
    return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
  }
  if (!request.isAdmin) {
    return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
  }
  const itemData = Object.keys(request.body);
  const allowedData = ["name", "location", "claimedBy"];
  const isValidOperation = itemData.every((data) => allowedData.includes(data));
  if (!isValidOperation) {
    return response
      .status(INVALID_DATA_PROVIDED.status)
      .send(INVALID_DATA_PROVIDED.message);
  }
  try {
    let item = null;
    try {
      item = await Item.findById({ _id: request.params.id });
    } catch (e) {
      return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
    }
    if (!item) {
      return response.status(404).send("Item not found");
    }
    itemData.forEach((data) => {
      item[data] = request.body[data];
    });
    await item.save();
    response.status(OK.status).send(item);
  } catch (error) {
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});
//Router to delete an item with id
router.delete("/api/item/:id", authUser, async (request, response) => {
  if (!request.params?.id) {
    return response
      .status(INVALID_DATA_PROVIDED.status)
      .send(INVALID_DATA_PROVIDED.message);
  }
  if (!request.isAdmin) {
    return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
  }
  try {
    let item = null;
    try {
      item = await Item.findById({ _id: request.params.id });
    } catch (e) {
      return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
    }
    if (!item) {
      return response.status(NOT_FOUND.status).send(NOT_FOUND.message);
    }
    await Image.deleteOne({ _id: item.image });
    await Item.deleteOne({ _id: request.params.id });
    response.status(OK.status).send(OK.message);
  } catch (error) {
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});
module.exports = router;
