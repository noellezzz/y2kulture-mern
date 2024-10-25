import multer from 'multer';
import path from 'path';

// Configure multer
export const upload = multer({
    limits: { fileSize: 100 * 1024 * 1024 }, // Corrected from fieldSize to fileSize
    storage: multer.diskStorage({
        // Define storage settings here if needed
        destination: (req, file, cb) => {
            cb(null, 'uploads/'); // Specify the uploads directory
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname)); // Set the filename
        }
    }),
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            cb(new Error('Unsupported file type!'), false);
            return;
        }
        cb(null, true);
    },
});