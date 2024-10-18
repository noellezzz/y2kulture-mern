import express from "express";
import { createProduct, deleteProduct, getOneProduct, getProduct, updateProduct } from "../controllers/ProductController.js";

const router = express.Router();

router.get('/', getProduct);
router.get('/:id', getOneProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct)
router.delete("/:id", deleteProduct)

export default router;
