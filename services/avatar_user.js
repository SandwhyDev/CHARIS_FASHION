import multer from "multer";
import path from "path"

const uploadStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, path.join(__dirname, `../static/uploads/avatar_user`))
    },
    filename : (req, file, cb) => {
        // var ext = file.mimetype.split('/')[1]
        cb(null, file.originalname)

        // cb(null, req.body.email +"."+ ext)
    },
})

const avatar_user = multer({storage : uploadStorage})

export default avatar_user