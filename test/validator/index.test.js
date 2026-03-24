import { describe, it, expect, vi } from 'vitest';
import { validate } from '../../app/validator/index.js';
import { userCreateSchema, userIdSchema } from '../../app/validator/user.js';

describe('validate', () => {
    it('calls next with no arguments when schema passes', () => {
        const data = { name: 'Alice', role: 'guest' };
        const next = vi.fn();

        validate(userCreateSchema, data, next);

        expect(next).toHaveBeenCalledWith();
    });

    it('calls next with BadRequest when schema fails', () => {
        const data = { name: '', role: 'guest' };
        const next = vi.fn();

        validate(userCreateSchema, data, next);

        const err = next.mock.calls[0][0];
        expect(err.code).toBe(400);
        
        expect(err.message).toMatchObject(
            expect.objectContaining({ name: expect.any(Array) }),
        );
    });

    it('mutates data in place when modifyData is true', () => {
        const params = { id: '7' };
        const next = vi.fn();

        validate(userIdSchema, params, next, { modifyData: true });

        expect(next).toHaveBeenCalledWith();
        expect(params.id).toBe(7);
    });
});
