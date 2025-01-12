"use client";

import Analytics from "@/components/analytics";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { useGetProject } from "@/features/projects/api/use-getProject";
import { useGetProjectAnalytics } from "@/features/projects/api/use-getProjectAnalytics";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-projectId";
import { TaskViewSwitcher } from "@/features/tasks/components/switcher";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

export const ProjectIdClient = () => {

    const projectId = useProjectId();
    const {data : project , isLoading: isLoadingProject } = useGetProject({ projectId });
    const { data: analytics , isLoading: isLoadingAnalytics } = useGetProjectAnalytics({ projectId });

    const isLoading = isLoadingAnalytics || isLoadingProject;

    if(isLoading){
        return <PageLoader/>;
    }

    if (!project){
        return <PageError message="Project not found" />
    }

    return ( 
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <ProjectAvatar
                        name={project.name}
                        image={project.imageUrl}
                        className="size-8"
                    />
                    <p className="font-semibold text-lg">{project.name}</p>
                </div>
                <div>
                    <Button variant={'secondary'} asChild size={'sm'}>
                        <Link href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}>
                            <PencilIcon className="size-4 mr-2"/>
                            Edit Project
                        </Link>
                    </Button>
                </div>
            </div>
            {analytics ? (
                <Analytics data={analytics}/>
            ) : null}
            <TaskViewSwitcher hideProjectFilter/>
        </div> 
    );
}