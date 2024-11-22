"use client";

import { Loader } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { dottedSeparator as DottedSeparator } from "@/components/dotted-line-separator";
import { LogOut } from "lucide-react";

import { useLogOut } from "../api/use-logOut";
import { useCurrent } from "../api/use-current";

export const UserButton = () => {
    const {data: user, isLoading } = useCurrent();
    const {mutate: logout} = useLogOut();

    if (isLoading) {
        return (
            <div className="size-10 flex rounded-full items-center justify-center bg-neutral-200 border border-neutral-300">
                <Loader className="size-4 animate-spin text-muted-foreground"/>
            </div>
        )
    }

    const userData = user?.data;

    if (!userData) {
        return null;
    };
    console.log(userData)
    const { name, email} = userData; 

    const avatarFallback = name
        ? name.charAt(0).toUpperCase()
        : email.charAt(0).toUpperCase() ?? 'U';
    
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative">
            <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300 ">
                <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                    {avatarFallback}
                </AvatarFallback>
            </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" side="bottom" className="w-60" sideOffset={10}>
                <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
                <Avatar className="size-[52px] transition border border-neutral-300 ">
                    <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-neutral-900 ">
                        {name || "User"}
                    </p>
                    <p className="text-xs text-neutral-500 ">
                        {email}
                    </p>
                </div>
                </div>
                <DottedSeparator className="mb-1"/>
                <DropdownMenuItem
                    onClick={() => logout()} 
                    className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
                >
                    <LogOut className="size-4 mr-2"/>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu>
    );
};