const express = require("express");
const authUser = require("../middleware/authUser");
const Home = require("../models/homeModel");
const Image = require("../models/imageModel");
const multer = require("multer");
const sharp = require("sharp");
const { UNAUTHORIZED } = require("../services/http-response");
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
    if(!request.isAdmin) {
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

//Router to update an item with id
router.patch("/api/home/:id", authUser, async (request, response) => {
  if (!request.isAdmin) {
    return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
  }
  const itemData = Object.keys(request.body);
  const allowedData = ["name", "prices", "description", "available", "picture"];
  const isValidOperation = itemData.every((data) => allowedData.includes(data));
  if (!isValidOperation) {
    return response.status(406).send("Invalid Data Provided");
  }
  try {
    const item = await Item.findById({ _id: request.params.id });
    if (!item) {
      return response.status(404).send("Item not found");
    }
    itemData.forEach((data) => {
      item[data] = request.body[data];
    });
    await item.save();
    response.status(200).send(item);
  } catch (error) {
    response.status(500).send("Internal Server Error");
  }
});
//Router to delete an item with id
router.delete("/api/home/:id", authUser, async (request, response) => {
  if (!request.isAdmin) {
    return response.status(UNAUTHORIZED.status).send(UNAUTHORIZED.message);
  }
  try {
    const item = await Item.findById({ _id: request.params.id });
    if (!item) {
      return response.status(404).send("Item not found");
    }
    await Item.deleteOne({ _id: request.params.id });
    response.status(200).send(item);
  } catch (error) {
    response.status(500).send("Internal Server Error");
  }
});
module.exports = router;
