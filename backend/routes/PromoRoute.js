import express from "express";
import { createPromo, deletePromo, findPromo, getOnePromo, getPromo, updatePromo } from "../controllers/PromoController.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.get('/', getPromo);
router.get('/:id', getOnePromo);
router.post('/', upload.array('images', 10), createPromo);
router.put('/:id', upload.array('images', 10), updatePromo)
router.delete("/:id", deletePromo)

router.post('/find/withcode', findPromo);

export default router;
