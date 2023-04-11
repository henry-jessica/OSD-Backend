const { S3 } = require('aws-sdk');
const multer = require('multer')
const multerS3 = require('multer-s3');

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});


// UPLOAD TO AWS S3 
const uploadFileToS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        // acl: "public-read",
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            let newFileName = null;
            if (file.originalname.length > 10) {
                newFileName = `${file.fieldname}-${file.originalname.substring(0, 9)}-${new Date().getSeconds()}-${file.originalname.substring(file.originalname.length - 5)}`
            } else {
                newFileName = `${file.fieldname}-${file.originalname}-${new Date().getSeconds()}-${file.originalname.substring(file.originalname.length - 5)}`
            }
            cb(null, newFileName);
        }
    }),
    fileFilter: function (req, file, cb) {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})
module.exports = { s3, uploadFileToS3 };