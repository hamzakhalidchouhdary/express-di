import { describe, it, expect, vi } from 'vitest';
import UserController from '../../app/controllers/user.js';

function mockRes() {
    const res = {};
    res.json = vi.fn().mockReturnValue(res);
    res.status = vi.fn().mockReturnValue(res);
    return res;
}

describe('UserController', () => {
    const userService = {
        me: vi.fn(),
        getUsers: vi.fn(),
        getUserById: vi.fn(),
        createUser: vi.fn(),
        updateUser: vi.fn(),
        deleteUser: vi.fn(),
    };

    const controller = new UserController({ userService });

    it('me returns user json on success', async () => {
        userService.me.mockResolvedValue({ id: 1, name: 'A' });
        const res = mockRes();
        const next = vi.fn();

        await controller.me({}, res, next);

        expect(userService.me).toHaveBeenCalledOnce();
        expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'A' });
        expect(next).not.toHaveBeenCalled();
    });

    it('me forwards errors to next', async () => {
        const boom = new Error('boom');
        userService.me.mockRejectedValue(boom);
        const res = mockRes();
        const next = vi.fn();

        await controller.me({}, res, next);

        expect(next).toHaveBeenCalledWith(boom);
        expect(res.json).not.toHaveBeenCalled();
    });

    it('getUsers delegates to service', async () => {
        userService.getUsers.mockResolvedValue([]);
        const res = mockRes();
        const next = vi.fn();

        await controller.getUsers({}, res, next);

        expect(res.json).toHaveBeenCalledWith([]);
        expect(next).not.toHaveBeenCalled();
    });

    it('getUserById passes id from params', async () => {
        userService.getUserById.mockResolvedValue({ id: 2 });
        const res = mockRes();
        const next = vi.fn();

        await controller.getUserById({ params: { id: '2' } }, res, next);

        expect(userService.getUserById).toHaveBeenCalledWith('2');
        expect(res.json).toHaveBeenCalledWith({ id: 2 });
    });

    it('createUser passes body', async () => {
        userService.createUser.mockResolvedValue({ id: 9 });
        const body = { name: 'N', role: 'guest' };
        const res = mockRes();
        const next = vi.fn();

        await controller.createUser({ body }, res, next);

        expect(userService.createUser).toHaveBeenCalledWith(body);
        expect(res.json).toHaveBeenCalledWith({ id: 9 });
    });

    it('updateUser passes id and body', async () => {
        userService.updateUser.mockResolvedValue({ id: 1 });
        const res = mockRes();
        const next = vi.fn();

        await controller.updateUser({ params: { id: '1' }, body: { name: 'Z' } }, res, next);

        expect(userService.updateUser).toHaveBeenCalledWith('1', { name: 'Z' });
    });

    it('deleteUser returns success message', async () => {
        userService.deleteUser.mockResolvedValue(undefined);
        const res = mockRes();
        const next = vi.fn();

        await controller.deleteUser({ params: { id: '3' } }, res, next);

        expect(userService.deleteUser).toHaveBeenCalledWith('3');
        expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });
});
