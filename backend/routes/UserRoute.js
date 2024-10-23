import express from "express";
import { createUser, deleteUser, getOneUser, getUser, updateUser } from "../controllers/UserController.js";

const router = express.Router();

router.get('/', getUser);
router.get('/:id', getOneUser);
router.post('/', createUser);
router.put('/:id', updateUser)
router.delete("/:id", deleteUser)

export default router;
