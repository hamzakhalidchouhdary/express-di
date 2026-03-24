import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminUser, GuestUser } from '../../app/entities/user.js';

describe('entities', () => {
    const userRepository = {
        getAllUsers: vi.fn().mockResolvedValue([]),
        getUserById: vi.fn(),
        createUser: vi.fn(),
        updateUser: vi.fn(),
        deleteUser: vi.fn(),
    };

    beforeEach(() => {
        vi.mocked(userRepository.getAllUsers).mockClear();
        vi.mocked(userRepository.getUserById).mockClear();
        vi.mocked(userRepository.createUser).mockClear();
        vi.mocked(userRepository.updateUser).mockClear();
        vi.mocked(userRepository.deleteUser).mockClear();
    });

    describe('AdminUser', () => {
        it('throws when constructed with non-admin role', () => {
            expect(
                () =>
                    new AdminUser({
                        currentUser: { id: 1, role: 'guest' },
                        userRepository,
                    }),
            ).toThrow('Invalid user role');
        });

        it('me returns current user record', () => {
            const currentUser = { id: 1, name: 'A', role: 'admin' };
            const admin = new AdminUser({ currentUser, userRepository });
            expect(admin.me()).toEqual(currentUser);
        });

        it('delegates mutations to repository', async () => {
            const currentUser = { id: 1, role: 'admin' };
            userRepository.createUser.mockResolvedValue({ id: 3 });
            userRepository.updateUser.mockResolvedValue({});
            userRepository.deleteUser.mockResolvedValue([]);

            const admin = new AdminUser({ currentUser, userRepository });

            await admin.createUser({ name: 'n', role: 'guest' });
            await admin.updateUser(1, { name: 'z' });
            await admin.deleteUser(1);

            expect(userRepository.createUser).toHaveBeenCalled();
            expect(userRepository.updateUser).toHaveBeenCalledWith(1, { name: 'z' });
            expect(userRepository.deleteUser).toHaveBeenCalledWith(1);
        });
    });

    describe('GuestUser', () => {
        it('throws when constructed with non-guest role', () => {
            expect(
                () =>
                    new GuestUser({
                        currentUser: { id: 1, role: 'admin' },
                        userRepository,
                    }),
            ).toThrow('Invalid user role');
        });

        it('read operations use repository', async () => {
            const currentUser = { id: 2, role: 'guest' };
            const guest = new GuestUser({ currentUser, userRepository });

            await guest.getAllUsers();
            await guest.getUserById(1);

            expect(userRepository.getAllUsers).toHaveBeenCalled();
            expect(userRepository.getUserById).toHaveBeenCalledWith(1);
        });

        it('mutations are not implemented', () => {
            const guest = new GuestUser({
                currentUser: { id: 2, role: 'guest' },
                userRepository,
            });

            expect(() => guest.createUser({})).toThrow('Not implemented');
            expect(() => guest.updateUser(1, {})).toThrow('Not implemented');
            expect(() => guest.deleteUser(1)).toThrow('Not implemented');
        });
    });
});
