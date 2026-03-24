import { describe, it, expect } from 'vitest';
import { asValue } from 'awilix';
import dependencyInjector from '../../app/dependencyInjector/index.js';
import { UserRepository } from '../../app/repository/user.js';
import { UserFactory } from '../../app/factories/user.js';
import { UserService } from '../../app/services/user.js';
import UserController from '../../app/controllers/user.js';

describe('dependencyInjector', () => {
    it('resolves singleton UserRepository', () => {
        const repo = dependencyInjector.resolve('userRepository');
        expect(repo).toBeInstanceOf(UserRepository);
    });

    it('resolves singleton UserFactory with repository injected', () => {
        const factory = dependencyInjector.resolve('userFactory');
        expect(factory).toBeInstanceOf(UserFactory);
        expect(factory.userRepository).toBeInstanceOf(UserRepository);
    });

    it('does not resolve userService from root without currentUser (request scope)', () => {
        expect(() => dependencyInjector.resolve('userService')).toThrow(/currentUser/);
    });

    it('resolves userService and userController in a child scope when currentUser is registered', async () => {
        const factory = dependencyInjector.resolve('userFactory');
        const currentUser = await factory.getInstance({
            id: 1,
            name: 'John Doe',
            role: 'admin',
        });
        const scope = dependencyInjector.createScope();
        scope.register({ currentUser: asValue(currentUser) });
        const userService = scope.resolve('userService');
        const userController = scope.resolve('userController');
        expect(userService).toBeInstanceOf(UserService);
        expect(userController).toBeInstanceOf(UserController);
        expect(await userService.me()).toMatchObject({ id: 1, role: 'admin' });
    });
});
