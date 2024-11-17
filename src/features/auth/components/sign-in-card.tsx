import {FcGoogle} from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {Form, FormControl, FormItem, FormField, FormMessage} from "@/components/ui/form"
import { dottedSeparator as DottedLineSeparator } from "@/components/dotted-line-separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link';

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password required'),
})

export const SignInCard = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log({values});
    }

    return (
        <Card className="w-full h-full md:w-[487px] border-none shadow-none">
            <CardHeader className="flex items-center justify-center text-center p-7">
                <CardTitle className="text-2xl">
                    Welcome Back !!
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <DottedLineSeparator />
            </div>
            
            <CardContent className="p-7">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    
                    <Button disabled={false} size='lg' className="w-full">
                        Sign In
                    </Button>    
                </form>
            </Form>
            </CardContent>
            <div className="px-7">
                <DottedLineSeparator/>
            </div>
            <CardContent className="p-7 flex flex-col gap-y-4">
                <Button variant='secondary' size={"lg"} className="w-full" disabled={false}>
                    <FcGoogle className='mr-2 size-5'/>
                    Sign in with Goggle
                </Button>
                <Button variant='secondary' size={"lg"} className="w-full" disabled={false}>
                    <FaGithub className='mr-2 size-5'/>
                    Sign in with Github
                </Button>
            </CardContent>

            <div className='px-7'>
                <DottedLineSeparator />
            </div>
            <CardContent className='p-7 items-center justify-center flex'>
                Don&apos;t have an account?
                <Link href={'/sign-up'}>
                    <span className='text-blue-700'>&nbsp;Sign Up</span>
                </Link>
            </CardContent>
        </Card>
    )
}

