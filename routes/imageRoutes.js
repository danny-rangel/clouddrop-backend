const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const Image = mongoose.model('images');
const SharedImage = mongoose.model('sharedImages');
const multer = require('multer');
const sharp = require('sharp');
const AWS = require('aws-sdk');
const keys = require('../config/dev');
const fileType = require('file-type');
const encrypt = require('../middlewares/encrypt');
const decrypt = require('../middlewares/decrypt');

AWS.config.update({
    accessKeyId: keys.awsKeyId,
    secretAccessKey: keys.awsKey
});

const s3 = new AWS.S3();

// Upload functions

const uploadFile = async (buffer, name, type) => {
    const params = {
        ACL: 'public-read',
        Body: buffer,
        Bucket: keys.awsBucketName,
        ContentType: type.mime,
        Key: `${name}`
    };
    const res = await s3.upload(params).promise();
    return res;
};

const upload = multer({
    limits: {
        fileSize: 4000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpeg|jpg|JPG|JPEG|PNG)$/)) {
            return cb(new Error('File not supported'));
        }
        cb(undefined, true);
    }
});

module.exports = app => {
    // Get all images for logged in user
    app.get('/api/images', requireLogin, async (req, res) => {
        const { id } = req.user;
        const images = await Image.find({ _user: id })
            .sort({ date: -1 })
            .limit(20);

        res.send(images);
    });

    // Get specific image with key
    app.get('/api/images/:key', requireLogin, async (req, res) => {
        const { key } = req.params;

        const getParams = {
            Bucket: keys.awsBucketName,
            Key: `clouddrop/${key}`
        };

        const object = await s3.getObject(getParams).promise();

        // DECRYPT
        const decryptedBuffer = decrypt(object.Body);
        res.send(decryptedBuffer.toString('base64'));
    });

    // Image upload
    app.post(
        '/api/images',
        requireLogin,
        upload.single('newImage'),
        async (req, res) => {
            const { _id, name, email } = req.user;
            const { originalname } = req.file;

            const buffer = await sharp(req.file.buffer)
                .resize({ width: 500, height: 500 })
                .png()
                .toBuffer();

            try {
                // Grab information for S3 Upload
                const type = fileType(buffer);
                const fileName = `${originalname
                    .split('.')
                    .slice(0, -1)
                    .join('.')}`;
                const URL = `clouddrop/${fileName}`;

                // ENCRYPT HERE
                const encryptedBuffer = encrypt(buffer);

                // Upload
                const data = await uploadFile(encryptedBuffer, URL, type);
                //Create the document in the database
                const image = new Image({
                    userId: _id,
                    email,
                    name,
                    date: Date.now(),
                    key: fileName,
                    _user: req.user.id
                });
                await image.save();

                req.user.imageCount += 1;
                await req.user.save();
                res.send(data);
            } catch (e) {
                return res.status(400).send(error);
            }
        }
    );

    // Image Deletion, with cascade of shared image deletion
    app.delete('/api/images', requireLogin, async (req, res) => {
        const { key } = req.body;
        const image = await Image.findOneAndDelete({ key });
        await SharedImage.deleteMany({ key });
        req.user.imageCount -= 1;
        await req.user.save();
        res.send(image);
    });
};
