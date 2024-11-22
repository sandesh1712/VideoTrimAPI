import multer from "multer";

export function suffix(){
  return Date.now() + '-' + Math.round(Math.random() * 1E9)
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, 'tmp')
    },
    filename: function (req, file, cb) {
      const _suffix = suffix();
      cb(null, file.fieldname + '-' + _suffix)
    }
})
  
const upload =  multer({storage})

export default upload;