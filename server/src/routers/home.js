const express = require("express");
const authAdmin = require("../middleware/authAdmin");
const userAuth  = require("../middleware/authUser");
const Home = require("../models/homeModel");
const multer = require("multer");
const sharp = require("sharp");
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

//Router to create item
router.post(
  "/api/home/create",
  upload.single("images"),
  async (request, response) => {
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
          .png({ quality: 10 })
          .toBuffer();
        request.body.images = [buffer];
      }

      const home = new Home(request.body);
      await home.save();
      response.status(201).send(home);
    } catch (error) {
        console.log(error);
      response.status(500).send("Internal Server Error");
    }
  }
);
//Router to get all items
router.get("/api/home",userAuth, async (request, response) => {
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
router.patch("/api/home/:id", authAdmin, async (request, response) => {
  if (!request.admin.super) {
    return response.status(401).send("Unauthorized");
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
router.delete("/api/home/:id", authAdmin, async (request, response) => {
  if (!request.admin.super) {
    return response.status(401).send("Unauthorized");
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
