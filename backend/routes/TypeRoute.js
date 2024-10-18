import express from "express";
import { createType, deleteType, getOneType, getType, updateType } from "../controllers/TypeController.js";

const router = express.Router();

router.get('/', getType);
router.get('/:id', getOneType);
router.post('/', createType);
router.put('/:id', updateType)
router.delete("/:id", deleteType)

export default router;
