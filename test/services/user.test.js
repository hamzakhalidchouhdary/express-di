import { describe, it, expect, vi } from 'vitest';
import { UserService } from '../../app/services/user.js';

describe('UserService', () => {
    const user = {
        me: vi.fn(),
        getAllUsers: vi.fn(),
        getUserById: vi.fn(),
        createUser: vi.fn(),
        updateUser: vi.fn(),
        deleteUser: vi.fn(),
    };

    const service = new UserService({ currentUser: user });

    it('me delegates to current user', async () => {
        user.me.mockResolvedValue({ id: 1 });
        await expect(service.me()).resolves.toEqual({ id: 1 });
        expect(user.me).toHaveBeenCalledOnce();
    });

    it('getUsers delegates to getAllUsers', async () => {
        user.getAllUsers.mockResolvedValue([{ id: 1 }]);
        await expect(service.getUsers()).resolves.toEqual([{ id: 1 }]);
    });

    it('getUserById forwards id', async () => {
        user.getUserById.mockResolvedValue(null);
        await service.getUserById(5);
        expect(user.getUserById).toHaveBeenCalledWith(5);
    });

    it('createUser forwards payload', async () => {
        const payload = { name: 'x', role: 'guest' };
        user.createUser.mockResolvedValue(payload);
        await expect(service.createUser(payload)).resolves.toBe(payload);
    });

    it('updateUser forwards id and payload', async () => {
        user.updateUser.mockResolvedValue({});
        await service.updateUser(2, { name: 'y' });
        expect(user.updateUser).toHaveBeenCalledWith(2, { name: 'y' });
    });

    it('deleteUser forwards id', async () => {
        user.deleteUser.mockResolvedValue([]);
        await service.deleteUser(3);
        expect(user.deleteUser).toHaveBeenCalledWith(3);
    });
});
