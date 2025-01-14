"use client"

import {FcGoogle} from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"


import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {Form, FormControl, FormItem, FormField, FormMessage} from "@/components/ui/form"
import { dottedSeparator as DottedLineSeparator } from "@/components/dotted-line-separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link';

import { signUpSchema } from '../schema';
import { useSignUp } from '../api/use-signUp';
import { signUpWithGithub, signUpWithGoogle } from '@/lib/oauth';

export const SignUpCard = () => {

    const { mutate, isPending } = useSignUp();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    })

    const onSubmit = (values: z.infer<typeof signUpSchema>) => {
        mutate({json : values});
    }

    return (
        <Card className="w-full h-full md:w-[487px] border-none shadow-none">

            <CardHeader className="flex items-center justify-center text-center p-7">
                <CardTitle className="text-2xl">
                    Sign Up
                </CardTitle>
                <CardDescription>
                    By signing up you agree to our{" "}
                    <Link href={'/privacy'}>
                        <span className='text-blue-700'>Privacy Policy</span>
                    </Link>
                    and{" "}
                    <Link href={'/terms'}>
                        <span className='text-blue-700'>Terms of Service</span>
                    </Link>
                </CardDescription>
            </CardHeader>
            
            <div className="px-7">
                <DottedLineSeparator />
            </div>

            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}className="space-y-4">
                    <FormField 
                    name='name'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="text" placeholder="Enter Your name" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField 
                    name='email'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="email" placeholder="Enter Email address" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField 
                    name='password'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="password" placeholder="Enter Password" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <Button disabled={isPending} size='lg' className="w-full">
                        Sign Up
                    </Button>    
                    </form>
                </Form>

            </CardContent>
            <div className="px-7">
                <DottedLineSeparator/>
            </div>
            <CardContent className="p-7 flex flex-col gap-y-4">
                <Button variant='secondary' size={"lg"} className="w-full" disabled={isPending} onClick={() => signUpWithGoogle()}>
                    <FcGoogle className='mr-2 size-5'/>
                    Login with Goggle
                </Button>
                <Button variant='secondary' size={"lg"} className="w-full" disabled={isPending} onClick={() => signUpWithGithub()}>
                    <FaGithub className='mr-2 size-5'/>
                    Login with Github
                </Button>
            </CardContent>
            <div className='px-7'>
                <DottedLineSeparator />
            </div>
            <CardContent className='p-7 items-center justify-center flex'>
                Already have an account?
                <Link href={'/sign-in'}>
                    <span className='text-blue-700'>&nbsp;Sign In</span>
                </Link>
            </CardContent>
        </Card>
    )
}

