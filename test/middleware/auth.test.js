import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('jsonwebtoken', () => ({
    default: {
        verify: vi.fn(),
    },
}));

import jwt from 'jsonwebtoken';
import { authMiddleware } from '../../app/middleware/auth.js';

describe('authMiddleware', () => {
    beforeEach(() => {
        vi.mocked(jwt.verify).mockReset();
    });

    it('calls next when verify returns a non-empty payload', async () => {
        vi.mocked(jwt.verify).mockReturnValue({ id: 1, sub: 'u1' });
        const next = vi.fn();
        const req = { headers: { authorization: 'Bearer abc.token' } };

        await authMiddleware(req, {}, next);

        expect(req.decodedToken).toEqual({ id: 1, sub: 'u1' });
        expect(jwt.verify).toHaveBeenCalledWith('abc.token', 'test-secret');
        expect(next).toHaveBeenCalledWith();
    });

    it('calls next with Unauthorized when authorization header is missing', async () => {
        const next = vi.fn();
        const req = { headers: {} };

        await authMiddleware(req, {}, next);

        const err = next.mock.calls[0][0];
        expect(err.code).toBe(401);
        expect(err.message).toBe('missing authorization token');
    });

    it('calls next with Unauthorized when verify returns empty object', async () => {
        vi.mocked(jwt.verify).mockReturnValue({});
        const next = vi.fn();
        const req = { headers: { authorization: 'Bearer x' } };

        await authMiddleware(req, {}, next);

        const err = next.mock.calls[0][0];
        expect(err.code).toBe(401);
        expect(err.message).toBe('invalid authorization token');
    });
});
