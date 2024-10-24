import express from 'express';
import { login, checkUser } from '../../controllers/Auth/LoginController.js';

const router = express.Router();

router.get('/', checkUser);
router.post('/', login);

export default router;