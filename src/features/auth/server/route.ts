import { Hono } from "hono";
// import z from 'zod';
import { signInSchema, signUpSchema } from "../schema";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from 'hono/cookie';


import { zValidator } from '@hono/zod-validator';
import { createAdminClient } from "@/lib/appwrite";
import { AUTH_COOKIE } from "../constants";
import { sessionMiddleware } from "@/lib/session-middleware";


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
        sessionMiddleware,
        async (c) => {
            const account = c.get('account');
            deleteCookie(c, AUTH_COOKIE);
            await account.deleteSession('current');
            return c.json({ success : true });
        }
    )

    .get('/current',
        sessionMiddleware,
        (c) => {
            const user = c.get('user');
            return c.json({data : user});
        }
    )

export default app;