import express from "express";
import { createPromo, deletePromo, getOnePromo, getPromo, updatePromo } from "../controllers/PromoController.js";

const router = express.Router();

router.get('/', getPromo);
router.get('/:id', getOnePromo);
router.post('/', createPromo);
router.put('/:id', updatePromo)
router.delete("/:id", deletePromo)

export default router;
