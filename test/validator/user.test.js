import { describe, it, expect } from 'vitest';
import {
    userCreateSchema,
    userUpdateSchema,
    userIdSchema,
} from '../../app/validator/user.js';

describe('user validators', () => {
    describe('userCreateSchema', () => {
        it('accepts valid payload', () => {
            const data = userCreateSchema.parse({ name: 'Alice', role: 'admin' });
            expect(data).toEqual({ name: 'Alice', role: 'admin' });
        });

        it('rejects empty name', () => {
            expect(() => userCreateSchema.parse({ name: '', role: 'guest' })).toThrow();
        });

        it('rejects invalid role', () => {
            expect(() => userCreateSchema.parse({ name: 'Bob', role: 'moderator' })).toThrow();
        });

        it('rejects extra keys (strict)', () => {
            expect(() =>
                userCreateSchema.parse({ name: 'Bob', role: 'guest', extra: 1 }),
            ).toThrow();
        });
    });

    describe('userUpdateSchema', () => {
        it('accepts valid payload', () => {
            const data = userUpdateSchema.parse({ name: 'X', role: 'guest' });
            expect(data).toEqual({ name: 'X', role: 'guest' });
        });
    });

    describe('userIdSchema', () => {
        it('coerces string id to positive integer', () => {
            expect(userIdSchema.parse({ id: '42' })).toEqual({ id: 42 });
        });

        it('rejects non-positive id', () => {
            expect(() => userIdSchema.parse({ id: 0 })).toThrow();
        });
    });
});
