import express from 'express';
import { login, register, refreshToken, logout } from '../../controllers/Auth/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/logout', logout);

export default router;