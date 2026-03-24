import { describe, it, expect } from 'vitest';
import { UserFactory } from '../../app/factories/user.js';
import { UserRepository } from '../../app/repository/user.js';

describe('UserFactory', () => {
    const repo = new UserRepository();
    const factory = new UserFactory({ userRepository: repo });

    it('returns AdminUser for admin role', async () => {
        const instance = await factory.getInstance({
            id: 1,
            name: 'Admin',
            role: 'admin',
        });
        expect(await instance.me()).toMatchObject({ id: 1, role: 'admin' });
    });

    it('returns GuestUser for guest role', async () => {
        const instance = await factory.getInstance({
            id: 2,
            name: 'Guest',
            role: 'guest',
        });
        expect(await instance.me()).toMatchObject({ id: 2, role: 'guest' });
    });

    it('throws for unknown role', async () => {
        await expect(
            factory.getInstance({ id: 9, name: 'X', role: 'unknown' }),
        ).rejects.toThrow('Invalid user role');
    });
});
