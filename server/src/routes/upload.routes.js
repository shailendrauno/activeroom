import express from 'express';
import auth from '../middlewares/auth.middleware.js';
import upload from '../config/multer.js';
import cloudinary from '../config/cloudinary.js';


const router = express.Router();

router.post("/image", auth, upload.single("image"), async (req, res) => {
    try {
        // console.log("File:", req.file);
        if (!req.file) return res.status(400).json({ message: "No image" });

        const result = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
            { folder: "chat-images" }
        );

        res.json({ url: result.secure_url });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

export default router;