import express from "express";
import { createCategory, deleteCategory, getCategory, getOneCategory, updateCategory } from "../controllers/CategoryController.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.get('/', getCategory);
router.get('/:id', getOneCategory);
router.post('/', upload.array('images', 10), createCategory);
router.put('/:id', upload.array('images', 10), updateCategory)
router.delete("/:id", deleteCategory)

export default router;
