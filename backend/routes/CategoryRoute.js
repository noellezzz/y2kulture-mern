import express from "express";
import { createCategory, deleteCategory, getCategory, getOneCategory, updateCategory } from "../controllers/CategoryController.js";

const router = express.Router();

router.get('/', getCategory);
router.get('/:id', getOneCategory);
router.post('/', createCategory);
router.put('/:id', updateCategory)
router.delete("/:id", deleteCategory)

export default router;
