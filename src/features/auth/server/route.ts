import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator';
// import z from 'zod';
import { signInSchema, signUpSchema } from "../schema";

const app = new Hono()
    .post('/signIn', zValidator('json', signInSchema), async (c) => {
        const {email, password} = c.req.valid("json");
        console.log({ email, password });
        return c.json({ email, password });
    })

    .post(
        '/signUp',
        zValidator('json', signUpSchema),
        async (c) => {
            const {name, email, password} = c.req.valid("json");
            console.log({ name, email, password });
            return c.json({ name, email, password });

    })

export default app;