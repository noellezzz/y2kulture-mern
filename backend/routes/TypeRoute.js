import express from "express";
import { createType, deleteType, getOneType, getType, updateType } from "../controllers/TypeController.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.get('/', getType);
router.get('/:id', getOneType);
router.post('/', upload.array('images', 10), createType);
router.put('/:id', upload.array('images', 10), updateType)
router.delete("/:id", deleteType)

export default router;
