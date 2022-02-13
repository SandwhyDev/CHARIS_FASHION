import multer from "multer";
import path from "path";
import fs from "fs";
import jSleep from "jvalley-sleep";
import ps from "../prisma/connection";
import moment from "moment";

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, `../static/uploads/product_images`));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const product_images = multer({
  storage: uploadStorage,
  fileFilter: (req, file, cb) => {
    var ext = file.mimetype;
    if (ext == "image/png" || ext == "image/jpg" || ext == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

export default product_images;
