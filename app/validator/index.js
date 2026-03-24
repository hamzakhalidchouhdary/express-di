import HttpError from 'http-error';
import { ZodError } from 'zod';

export const validate = (schema, data, next, options = { modifyData: false }) => {
    try {
        if (options.modifyData) {
            Object.assign(data, schema.parse(data));
        } else {
            schema.parse(data);
        }
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            next(new HttpError.BadRequest(error.flatten().fieldErrors));
            return;
        } else {
            next(error);
        }
    }
};
