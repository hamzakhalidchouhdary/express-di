import express from 'express';
import { makeInvoker } from 'awilix-express';
import UserController from '../controllers/user.js';
import { userUpdateSchema, userCreateSchema, userIdSchema } from '../validator/user.js';
import { validate } from '../validator/index.js';

const router = express.Router();
const userController = makeInvoker(UserController);

router.get('/', userController('getUsers'));
router.get('/me', userController('me'));
router.get('/:id', (req, res, next) => { validate(userIdSchema, req.params, next, { modifyData: true }) }, userController('getUserById'));
router.post('/', (req, res, next) => { validate(userCreateSchema, req.body, next) }, userController('createUser'));
router.put('/:id', (req, res, next) => { validate(userIdSchema, req.params, next, { modifyData: true }) }, (req, res, next) => { validate(userUpdateSchema, req.body, next) }, userController('updateUser'));
router.delete('/:id', (req, res, next) => { validate(userIdSchema, req.params, next, { modifyData: true }) }, userController('deleteUser'));

export default router;