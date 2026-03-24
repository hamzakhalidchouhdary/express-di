import express from 'express';
import { asValue } from 'awilix';
import { scopePerRequest } from 'awilix-express';
import { json } from 'express';
import HttpError from 'http-error';
import dependencyInjector from './dependencyInjector/index.js';
import { authMiddleware } from './middleware/auth.js';
import indexRouter from './routers/index.js';

export function createApp() {
    const app = express();

    app.use(json());
    app.use(scopePerRequest(dependencyInjector));
    app.use(authMiddleware);

    // inject authenticated user
    app.use(async (req, _res, next) => {
        const ufInstance = req.container.resolve('userFactory');
        const userRepository = req.container.resolve('userRepository');
        const currentUser = await userRepository.getUserById(req.decodedToken.id);
        if (!currentUser) {
            return next(new HttpError.Unauthorized('user not found'));
        }
        req.container.register({ currentUser: asValue(await ufInstance.getInstance(currentUser)) });
        next();
    });

    // route registration
    app.use('/', indexRouter);

    // handle not found
    app.use((_req, _res, next) => { next(new HttpError.NotFound('resource not found')); });

    // handle errors
    app.use((err, _req, res, _next) => {
        console.error(err);
        const statusCode = err.code || 500;
        const message = err.message || err.defaultMessage || 'Internal server error';
        return res.status(statusCode).json({ message });
    });

    return app;
}
