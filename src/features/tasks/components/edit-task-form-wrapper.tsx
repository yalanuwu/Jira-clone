import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-getMembers";
import { useGetProjects } from "@/features/projects/api/use-getProjects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { Loader } from "lucide-react";
import { useGetTask } from "../api/use-getTask";
import { EditTaskForm } from "./edit-task-form";

interface EditTaskFormWrapperProps {
  onCancel: () => void;
  id: string;
};

export const EditTaskFormWrapper = ({
    onCancel,
    id,
}: EditTaskFormWrapperProps ) => {

    const workspaceId = useWorkspaceId();
    const { data: initialValues, isLoading: isLoadingTask } = useGetTask({
        taskId: id
    }); 
    const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
    const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

    const projectOptions = projects?.data.documents.map((project) => ({ 
        id: project.$id,
        name: project.name,
        imageUrl: project.imageUrl
    }));

    const memberOptions = members?.data.documents.map((project) => ({ 
        id: project.$id,
        name: project.name,
    }));

    const isLoading = isLoadingProjects || isLoadingMembers || isLoadingTask;

    if (isLoading) {
        return (
            <Card className="w-full h-[714px] border-none shadow-none">
                <CardContent className="flex items-center h-full justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground"/>
                </CardContent>
            </Card>
        )
    }

    if (!initialValues) return null;

    return(
        <EditTaskForm 
            onCancel={onCancel}
            initialValues={initialValues}
            projectOptions={projectOptions ?? []}
            memberOptions={memberOptions ?? []}
        />
    )
}

