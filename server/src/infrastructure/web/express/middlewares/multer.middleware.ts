import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, //2MB
    },
    fileFilter: (_req, file, callback) => {
        if(!file.mimetype.startsWith('image/')) {
            callback(new Error('Only image files are allowed'));
        } else {
            callback(null, true);
        }
    },
});