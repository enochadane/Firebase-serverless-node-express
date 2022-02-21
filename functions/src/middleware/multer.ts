import multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
      cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
  function fileFilter(file: any, cb: any) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
  
  export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  });