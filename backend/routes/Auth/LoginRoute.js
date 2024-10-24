import express from 'express';
import { login, checkUser } from '../../controllers/Auth/LoginController.js';
import { isAuthenticatedUser, authorizeRoles } from '../../middleware/auth.js'

const router = express.Router();

router.get('/', isAuthenticatedUser, checkUser);
// router.get('/test', isAuthenticatedUser);
router.post('/', login);


export default router;