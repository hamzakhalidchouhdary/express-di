import jwt from 'jsonwebtoken';
import HttpError from 'http-error';

export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
        return next(new HttpError.Unauthorized('missing authorization token'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || Object.keys(decoded).length === 0) {
            return next(new HttpError.Unauthorized('invalid authorization token'));
        }
        req.decodedToken = decoded;
        next();
    } catch (error) {
        return next(new HttpError.Unauthorized('invalid authorization token'));
    }
}