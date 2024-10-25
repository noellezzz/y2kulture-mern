import express from 'express';
import { login, checkUser, logout } from '../../controllers/Auth/LoginController.js';
import { isAuthenticatedUser, authorizeRoles } from '../../middleware/auth.js'

const router = express.Router();

router.get('/', isAuthenticatedUser, checkUser);
// router.get('/test', isAuthenticatedUser);
router.post('/', login);
router.get('/logout', logout);


export default router;