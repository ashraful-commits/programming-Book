import multer from 'multer';
import path, { resolve } from 'path';
const __dirname = resolve();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/public/images'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

//================================ create photo multer
export const photoMulter = multer({
  storage,
}).single('photo');

export const galleryMulter = multer({
  storage,
}).array('gallery', 20);
