import express from "express";
import { createProduct, deleteProduct, getOneProduct, getProduct, updateProduct, 
        createStock, deductStock, deleteStock, 
        addReview,
        updateReview,
        checkUserOrders,
        checkIfReviewed,
        deleteReview,
        productSeeder,
        reviewSeeder
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

router.post('/review/:productId/:userId', addReview)
router.post('/check/:productId/:userId', checkUserOrders)
router.post('/delete/:productId/:userId', deleteReview)
router.get('/checkReviews/:productId/:userId', checkIfReviewed)
router.post('/updateReview/:productId/:userId', updateReview)

router.get('/seed/randomized', productSeeder)
router.get('/seed/review', reviewSeeder)

export default router;
