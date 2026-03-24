import { describe, it, expect, beforeEach } from 'vitest';
import { UserRepository } from '../../app/repository/user.js';

describe('UserRepository', () => {
    let repo;

    beforeEach(() => {
        repo = new UserRepository();
    });

    it('getAllUsers returns seed users', async () => {
        const users = await repo.getAllUsers();
        expect(users).toHaveLength(2);
        expect(users[0]).toMatchObject({ id: 1, name: 'John Doe', role: 'admin' });
        expect(users[1]).toMatchObject({ id: 2, name: 'Jane Doe', role: 'guest' });
    });

    it('getUserById returns a user when id matches', async () => {
        const user = await repo.getUserById(1);
        expect(user).toEqual({ id: 1, name: 'John Doe', role: 'admin' });
    });

    it('getUserById returns undefined when id is missing', async () => {
        expect(await repo.getUserById(999)).toBeUndefined();
    });

    it('createUser assigns id and appends to collection', async () => {
        const created = await repo.createUser({ name: 'New', role: 'guest' });
        expect(created.id).toBe(3);
        expect(await repo.getUserById(3)).toEqual(created);
    });

    it('updateUser merges fields for existing id', async () => {
        const updated = await repo.updateUser(1, { name: 'John Updated' });
        expect(updated).toMatchObject({ name: 'John Updated' });
        const stored = await repo.getUserById(1);
        expect(stored.name).toBe('John Updated');
        expect(stored.role).toBe('admin');
    });

    it('updateUser throws NotFound when id does not exist', async () => {
        await expect(repo.updateUser(999, { name: 'x' })).rejects.toMatchObject({
            code: 404,
            message: 'User not found',
        });
    });

    it('deleteUser removes user and returns remaining collection', async () => {
        const remaining = await repo.deleteUser(2);
        expect(remaining.some((u) => u.id === 2)).toBe(false);
        expect(await repo.getUserById(2)).toBeUndefined();
    });

    it('deleteUser throws NotFound when id does not exist', async () => {
        await expect(repo.deleteUser(999)).rejects.toMatchObject({
            code: 404,
            message: 'User not found',
        });
    });
});
