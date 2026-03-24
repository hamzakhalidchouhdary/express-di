import z from 'zod';

export const userUpdateSchema = z.object({
    name: z.string().min(1),
    role: z.enum(['admin', 'guest']),
}).strict();

export const userCreateSchema = z.object({
    name: z.string().min(1),
    role: z.enum(['admin', 'guest']),
}).strict();

export const userIdSchema = z
    .object({
        id: z.coerce.number().int().positive(),
    })
    .strict();