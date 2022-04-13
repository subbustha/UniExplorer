const { Router } = require("express");

const router = new Router();
const authAdmin = require("../middleware/authAdmin");
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

router.get("/api/image/:imageId", async (request, response) => {
  try {
    let imageId = request.params.imageId;
    console.log(imageId);
    let image = await Image.findOne({ _id: new ObjectId(imageId) });
    image = image.toObject();
    delete image._id;
    delete image.__v;
    return response
      .status(200)
      .send(`data:image/png;base64,${image.image.toString("base64")}`);
  } catch (error) {
    response.status(500).send("Internal Server Error");
  }
});

router.post(
  "/api/image",
  authAdmin,
  upload.single("image"),
  async (request, response) => {
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

router.post("/api/image/create");

module.exports = router;
