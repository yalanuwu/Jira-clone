import { Hono } from "hono";
// import z from 'zod';
import { signInSchema, signUpSchema } from "../schema";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from 'hono/cookie';


import { zValidator } from '@hono/zod-validator';
import { createAdminClient } from "@/lib/appwrite";
import { AUTH_COOKIE } from "../constants";


const app = new Hono()
    .post('/signIn', zValidator('json', signInSchema), async (c) => {
        const {email, password} = c.req.valid("json");
        
        const { account }  = await createAdminClient();
        const session = await account.createEmailPasswordSession(
            email, 
            password
        );

        setCookie(c, AUTH_COOKIE, session.secret, {
            path:'/',
            httpOnly : true,
            secure : true,
            sameSite : 'strict',
            maxAge : 60 * 60 * 24 * 30
        });


        return c.json({ success : true });
    })

    .post(
        '/signUp',
        zValidator('json', signUpSchema),
        async (c) => {
            const {name, email, password} = c.req.valid("json");
            
            const { account } = await createAdminClient();
            const user = await account.create(
                ID.unique(),
                email,
                password,
                name,
            );

            const session = await account.createEmailPasswordSession(
                email,
                password,
            );

            setCookie(c, AUTH_COOKIE, session.secret, {
                path:'/',
                httpOnly : true,
                secure : true,
                sameSite : 'strict',
                maxAge : 60 * 60 * 24 * 30
            })


            return c.json({ data : user });

    })

    .post('/logout',
        (c) => {
            deleteCookie(c, AUTH_COOKIE);
            return c.json({ success : true });
        }
    )

export default app;