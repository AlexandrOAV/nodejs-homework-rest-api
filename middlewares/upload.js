import multer from "multer";
import path from "path";

const destination = path.resolve('tmp');

const storage = multer.diskStorage({
    destination,
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
  });

  const limits = {
    fieldSize: 10 * 1024 * 1024,
  }
const upload = multer({
storage,
limits
});

export default upload;