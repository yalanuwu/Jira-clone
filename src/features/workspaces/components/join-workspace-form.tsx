"use client";

import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";
import { dottedSeparator as DottedSeparator } from "@/components/dotted-line-separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useJoinWorkspace } from "../api/use-joinWorkspace";
import { useInviteCode } from "../hooks/use-inviteCode";
import { useWorkspaceId } from "../hooks/use-workspaceId";
import { useRouter } from "next/navigation";


interface JoinWorkspaceFormProps {
    initialValues: {
        name: string
    }
}

export const JoinWorkspaceForm = ({ initialValues }: JoinWorkspaceFormProps) => {

    const workspaceId = useWorkspaceId();
    const { mutate, isPending } = useJoinWorkspace();
    const inviteCode = useInviteCode();
    const router = useRouter();

    const onSubmit = () => {
        mutate({
            param: {workspaceId},
            json: {code : inviteCode}
        },{
            onSuccess: ({data}) => {
                router.push(`/workspaces/${data.$id}`);
            }
        }
    )
    }

    return (
        <Card className="h-full w-full shadow-none border-none">
            <CardHeader className="p-7">
                <CardTitle className="text-xl font-bold">
                    Join Workspace
                </CardTitle>
                <CardDescription>
                    You&apos;ve been invited to join <strong>{initialValues.name}</strong> workspace
                </CardDescription>
            </CardHeader>
            <div className="px-7 ">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                <div className="flex flex-col gap-2 lg:flex-row items-center justify-between">
                    <Button 
                        className="w-full lg:w-fit"
                        variant={'secondary'}
                        type="button"
                        size={'lg'}
                        disabled={isPending}
                        asChild    
                    >
                        <Link href={"/"}>Cancel</Link>
                    </Button>
                    <Button 
                    size='lg' 
                    className="w-full lg:w-fit"
                    type='button'
                    onClick={onSubmit}
                    disabled={isPending}
                    >
                        Join Workspace
                    </Button>

                </div>
            </CardContent>
        </Card>
    );
 };

