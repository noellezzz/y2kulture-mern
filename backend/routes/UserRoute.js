import express from "express";
import { addToCart, addToCheckout, createUser, deleteUser, getOneUser, getUser, updateOrderStatus, updateUser } from "../controllers/UserController.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.get('/', getUser);
router.get('/:id', getOneUser);
router.post('/', upload.array('images', 10), createUser);
router.put('/:id', upload.array('images', 10), updateUser)
router.delete("/:id", deleteUser)

router.post('/addToCart/:userId', addToCart)
router.post('/:userId/checkout', addToCheckout)
router.post('/update/stock', updateOrderStatus)
export default router;
