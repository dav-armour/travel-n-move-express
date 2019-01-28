const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
require("dotenv").config();

// configure the keys for accessing AWS
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// create S3 instance
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: "public-read",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, `tour_images/${Date.now().toString()}`);
    }
  })
});

function imageUpload(req, res, next) {
  const singleUpload = upload.single("image");
  singleUpload(req, res, err => {
    if (err) {
      return res.status(422).send({
        errors: [{ title: "Image Upload Error", detail: err.message }]
      });
    }
    if (!req.file) {
      if (req.route.methods.put || req.route.methods.patch) {
        return next();
      }
      const error = {
        message: "Validation Error",
        errors: {
          image: "Image file missing"
        }
      };
      return next(new HTTPError(400, error));
    }
    req.body.image = req.file.location;
    next();
  });
}

function deleteImage(imageUrl) {
  if (!imageUrl.match(/s3/)) {
    return;
  }
  const Key = imageUrl
    .split("/")
    .slice(3)
    .join("/");
  var params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key
  };
  s3.deleteObject(params, function(err, data) {
    if (err) throw err;
  });
}

module.exports = {
  imageUpload,
  deleteImage
};
