"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createProjectSchema } from "../schema";
import { z } from "zod";
import { useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormLabel, FormMessage, FormItem, FormField } from "@/components/ui/form";
import { dottedSeparator as DottedSeparator } from "@/components/dotted-line-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateProjects } from "../api/use-createProjects";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";

interface CreateProjectFormProps {
    onCancel? : () => void;
};

export const CreateProjectForm = ({ onCancel } : CreateProjectFormProps) => {

    const router = useRouter();
    const { mutate, isPending } = useCreateProjects();
    const inputRef = useRef<HTMLInputElement>(null);
    const workspaceId = useWorkspaceId();

    const form = useForm<z.infer<typeof createProjectSchema>>({
        resolver : zodResolver(createProjectSchema.omit({ workspaceId: true })),
        defaultValues: {
            name : "",
        },
    });

    const onSubmit = (values : z.infer<typeof createProjectSchema>) => {
        const finalValues = {
            ...values,
            workspaceId,
            image: values.image instanceof File ? values.image : "",
        }
        mutate({ form : finalValues }, {
            onSuccess: ({ data }) => {
                form.reset();
                router.push(`/workspaces/${workspaceId}/projects/${data.$id}`)
            }
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('image', file);
        }
    }

    return(
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">
                    Create a new Project
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Project name
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="Enter project name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <div className="flex flex-col gap-y-2">
                                    <div className="flex items-center gap-x-5">
                                        {field.value ? (
                                            <div className="size-[72px] relative rounded-md overflow-hidden">
                                                <Image 
                                                    src={
                                                        field.value instanceof File
                                                        ? URL.createObjectURL(field.value)
                                                        : field.value
                                                    }
                                                    alt="logo"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <Avatar className="size-[72px]">
                                                <AvatarFallback>
                                                    <ImageIcon className="size-[36px] text-neutral-400"/>
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className="flex flex-col">
                                            <p className="text-sm">Project Icon</p>
                                            <p className="text-sm text-muted-foreground ">
                                                JPG, PNG, SVG or JPEG, max 1MB
                                            </p>
                                            <input 
                                            className="hidden"
                                            accept=".png, .jpg, .svg, .jpeg"
                                            type="file"
                                            ref={inputRef}
                                            disabled={isPending}
                                            onChange={handleImageChange}
                                            />
                                        </div>
                                        {field.value ?   
                                        (<Button
                                            type="button"
                                            disabled={isPending}
                                            variant={'destructive'}
                                            size={'xs'}
                                            className="w-fit mt-2"
                                            onClick={() => {
                                                field.onChange(null);
                                                if (inputRef.current){
                                                    inputRef.current.value = ""
                                                }
                                            }}
                                        >
                                            Remove Image
                                        </Button>)
                                        : (<Button
                                            type="button"
                                            disabled={isPending}
                                            variant={'tertiary'}
                                            size={'xs'}
                                            className="w-fit mt-2"
                                            onClick={() => inputRef.current?.click()}
                                        >
                                            Upload Image
                                        </Button>)}
                                    </div>

                                </div>
                            )}
                        />
                        </div>
                        <DottedSeparator className="py-7" />
                        <div className="flex items-center justify-between">
                            <Button type="button" size={'lg'} variant={'secondary'} onClick={onCancel} disabled={isPending}
                            className={cn(!onCancel && 'invisible')}>
                                Cancel
                            </Button>
                            <Button type="submit" size={'lg'} disabled={isPending}>
                                Create Project
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
