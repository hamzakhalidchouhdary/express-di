import { createContainer, asClass, asValue } from 'awilix';
import { UserService } from '../services/user.js';
import UserController from '../controllers/user.js';
import { UserRepository } from '../repository/user.js';
import { UserFactory } from '../factories/user.js';

const diContainer = createContainer();

diContainer.register({
    'userService': asClass(UserService).scoped(),
    'userController': asClass(UserController).scoped(),
    'userRepository': asClass(UserRepository).singleton(),
    'userFactory': asClass(UserFactory).singleton(),
});

export default diContainer;