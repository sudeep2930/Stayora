const cloudinary = require('cloudinary').v2;
const {
    CloudinaryStorage
} = require('multer-storage-cloudinary');

const requiredVars = {
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
};

for (const [key, value] of Object.entries(requiredVars)) {
    if (!value) {
        throw new Error(`Missing Cloudinary environment variable: ${key}`);
    }
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET

});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Stayora_DEV',
        allowedFormats: ["png", "jpeg", "jpg", "webp"],
    },
});

module.exports = {
    cloudinary,
    storage,
};