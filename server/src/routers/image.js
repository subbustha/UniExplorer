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
    image = image.toObject();
    delete image._id;
    delete image.__v;
    return response
      .status(200)
      .send(`data:image/png;base64,${image.image.toString("base64")}`);
  } catch (error) {
    response
      .status(INTERNAL_SERVER_ERROR.status)
      .send(INTERNAL_SERVER_ERROR.message);
  }
});

router.post(
  "/api/image",
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
    const imageData = Object.keys(request.body);
    const allowedData = ["image", "collection", "identifier"];
    const isValidOperation = imageData.every((data) =>
      allowedData.includes(data)
    );
    if (!isValidOperation) {
      return response.status(406).send("Invalid Data Provided");
    }
    try {
      const { collection = null, identifier = null } = request.body;
      if (!collection || !identifier) {
        return response.status(406).send("Invalid Data Provided");
      }
      if (request.file) {
        const buffer = await sharp(request.file.buffer)
          .resize({ width: 300, height: 300 })
          .png({ quality: 20 })
          .toBuffer();
        const image = new Image({ image: buffer });
        const uploadedImage = await image.save();
        if (collection === "home") {
          const collectionItem = await Home.findOne({
            _id: new ObjectId(identifier),
          });
          if (collectionItem) {
            collectionItem.images = [
              ...collectionItem.images,
              uploadedImage._id,
            ];
            await collectionItem.save();
          }
        }
      }
    } catch (error) {}
  }
);


module.exports = router;
