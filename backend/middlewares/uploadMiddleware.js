const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1 * 1024 * 1024 // 1 MB limit
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /pdf|docx|txt/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        
        if (extName) {
            return cb(null, true);
        } else {
            cb(new Error('FORMAT_ERROR'));
        }
    }
});

const uploadMiddleware = (req, res, next) => {
    const uploadSingle = upload.single('resume');

    uploadSingle(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    error: "Bro, is this a resume or a whole biography? 💀 Keep it under 1MB bestie ✨"
                });
            }
            if (err.message === 'FORMAT_ERROR') {
                return res.status(400).json({
                    success: false,
                    error: "Yikes! Only PDF, DOCX, or TXT files are allowed. No weird formats pls. 🚩"
                });
            }
            return res.status(500).json({ success: false, error: "Something broke fr fr." });
        }
        next();
    });
};

module.exports = uploadMiddleware;