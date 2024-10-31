import express from "express";
import { createProduct, deleteProduct, getOneProduct, getProduct, updateProduct, 
        createStock, deductStock, deleteStock 
        } from "../controllers/ProductController.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.get('/', getProduct);
router.get('/:id', getOneProduct);
router.post('/', upload.array('images', 10), createProduct);
router.put('/:id', upload.array('images', 10), updateProduct)
router.delete("/:id", deleteProduct)

router.post('/addStock/:productId', createStock)
router.post('/processTransaction', deductStock)
router.delete('/:productId/stock/:stockId', deleteStock)

export default router;
