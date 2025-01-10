import { useGetMembers } from "@/features/members/api/use-getMembers";
import { useGetProjects } from "@/features/projects/api/use-getProjects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";

import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { FolderIcon, ListCheckIcon, UserIcon } from "lucide-react";
import { TaskStatus } from "../types";
import { useTaskFilters } from "../hooks/use-taskFIlter";

interface DataFiltersProps {
    hideProjectFilter?: boolean;
}

export const DataFilters = ({ hideProjectFilter}: DataFiltersProps) => {
    const workspaceId = useWorkspaceId();
    const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
    const {data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

    const isLoading = isLoadingProjects || isLoadingMembers;

    const projectOptions = projects?.data.documents.map((project) => ({
        value: project.$id,
        label: project.name
    }))

    const memberOptions = members?.data.documents.map((member) => ({
        value: member.$id,
        label: member.name
    }))

    const [{
        status,
        assigneeId,
        projectId,
        dueDate
    }, setFilters ] = useTaskFilters();

    const onStatusChange = (value: string) => {
        if (value == 'all') {
            setFilters({ status: null });
        } else {
            setFilters({ status: value as TaskStatus })
        }
    }

    const onAssigneeChange = (value: string) => {
        setFilters({ assigneeId: value === "all" ? null : value as string });
    }

    const onProjectChange = (value: string) => {
        setFilters({ projectId: value === "all" ? null : value as string });
    }

    if (isLoading) return null;

    return (
        <div className="flex flex-col lg:flex-row gap-2">
            <Select
                defaultValue={status ?? undefined}
                onValueChange={(value) => onStatusChange(value)}
            >
                <SelectTrigger className="w-full lg:w-auto h-8">
                    <div className="flex items-center pr-2">
                        <ListCheckIcon className="size-4 mr-2"/>
                        <SelectValue placeholder='All statuses'/>
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all" >All Statuses</SelectItem>
                    <SelectSeparator />
                    <SelectItem value={TaskStatus.BACKLOG}>BACKLOG</SelectItem>
                    <SelectItem value={TaskStatus.DONE}>DONE</SelectItem>
                    <SelectItem value={TaskStatus.IN_PROGRESS}>IN PROGRESS</SelectItem>
                    <SelectItem value={TaskStatus.IN_REVIEW}>IN REVIEW</SelectItem>
                    <SelectItem value={TaskStatus.TODO}>TODO</SelectItem>
                </SelectContent>
            </Select>

            <Select
                defaultValue={assigneeId ?? undefined}
                onValueChange={(value) => onAssigneeChange(value)}
            >
                <SelectTrigger className="w-full lg:w-auto h-8">
                    <div className="flex items-center pr-2">
                        <UserIcon className="size-4 mr-2"/>
                        <SelectValue placeholder='All assignees'/>
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all" >All Assignees</SelectItem>
                    <SelectSeparator />
                    {memberOptions?.map((member) => (
                        <SelectItem key={member.value} value={member.value}>{member.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {!hideProjectFilter && (
            <Select
                defaultValue={projectId ?? undefined}
                onValueChange={(value) => onProjectChange(value)}
            >
                <SelectTrigger className="w-full lg:w-auto h-8">
                    <div className="flex items-center pr-2">
                        <FolderIcon className="size-4 mr-2"/>
                        <SelectValue placeholder='All projects'/>
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all" >All Projects</SelectItem>
                    <SelectSeparator />
                    {projectOptions?.map((project) => (
                        <SelectItem key={project.value} value={project.value}>{project.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            )}

            <DatePicker 
                placeholder="Due Date"
                className="h-8 w-full lg:w-auto"
                value={dueDate ? new Date(dueDate) : undefined}
                onChange={(date) => {
                    setFilters({ dueDate: date ? date.toISOString() : null })
                }}
            />
        </div>
    )
} 