import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../app/createApp.js';
import dependencyInjector from '../app/dependencyInjector/index.js';

const seedUsers = () => [
    { id: 1, name: 'John Doe', role: 'admin' },
    { id: 2, name: 'Jane Doe', role: 'guest' },
];

describe('createApp', () => {
    let app;

    beforeEach(() => {
        const repo = dependencyInjector.resolve('userRepository');
        repo.collection = JSON.parse(JSON.stringify(seedUsers()));
        app = createApp();
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    function authAsUser(userId) {
        const token = jwt.sign({ id: userId }, 'test-secret');
        return { Authorization: `Bearer ${token}` };
    }

    it('returns 404 for unknown routes', async () => {
        const res = await request(app).get('/nope').set(authAsUser(1));
        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: 'resource not found' });
    });

    it('GET /users/me returns current user for valid token', async () => {
        const res = await request(app).get('/users/me').set(authAsUser(1));

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ id: 1, name: 'John Doe', role: 'admin' });
    });

    it('GET /users returns list for valid token', async () => {
        const res = await request(app).get('/users').set(authAsUser(1));

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('returns 401 when user id does not exist in repository', async () => {
        const res = await request(app).get('/users/me').set(authAsUser(9999));

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ message: 'user not found' });
    });
});
