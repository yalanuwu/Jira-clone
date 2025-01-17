"use client";

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dottedSeparator as DottedSeparator } from "@/components/dotted-line-separator"
import { Loader, PlusIcon } from "lucide-react"
import { useCreateTaskModal } from "../hooks/use-createTaskModal"
import { useGetTasks } from "../api/use-getTasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { useQueryState } from "nuqs";
import { DataFilters } from "./data-filters";
import { useTaskFilters } from "../hooks/use-taskFIlter";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { DataKanban } from "./data-kanban";
import { useCallback } from "react";
import { TaskStatus } from "../types";
import { useBulkUpdateTask } from "../api/use-BulkUpdateTask";
import { DataCalendar } from "./data-calendar";
import { useProjectId } from "@/features/projects/hooks/use-projectId";

interface TaskViewSwitcherProps {
    hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({ hideProjectFilter } : TaskViewSwitcherProps) => {

    const [{
        status,
        assigneeId,
        projectId,
        dueDate
    }] = useTaskFilters();

    const workspaceId = useWorkspaceId();
    const paramProjectId = useProjectId();
    const { open } = useCreateTaskModal();

    const { mutate: bulkUpdate } = useBulkUpdateTask();

    const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ 
        workspaceId,
        projectId : paramProjectId || projectId,
        assigneeId,
        status,
        dueDate 
    });

    const [view, setView] = useQueryState('task-view', {
        defaultValue: 'table',
    });

    const onKanbanChange = useCallback((
        tasks: { $id: string ; status: TaskStatus; position: number }[]
    ) => {
        bulkUpdate({
            json: { tasks },
        })
    }, [bulkUpdate])


    return (
        <Tabs className="flex-1 rounded-lg border w-full" defaultValue={view} onValueChange={setView}>
            <div className="h-full flex flex-col overflow-auto p-4">
                <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
                    <TabsList className="w-full lg:w-auto">
                        <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
                            Table
                        </TabsTrigger>
                        <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
                            Kanban
                        </TabsTrigger>
                        <TabsTrigger className="h-8 w-full lg:w-auto" value="calender">
                            Calender
                        </TabsTrigger>
                    </TabsList>
                    <Button onClick={open} size='sm' className="w-full lg:w-auto">
                        <PlusIcon className="size-4 mr-2"/>
                        New
                    </Button>
                </div>
                <DottedSeparator className="my-4"/>
                    <DataFilters hideProjectFilter={hideProjectFilter}/>
                <DottedSeparator className="my-4"/>
                {isLoadingTasks ? (
                    <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
                        <Loader className="size-5 animate-spin text-muted-foreground"/>
                    </div>
                ) : (
                <>
                    <TabsContent value="table" className="mt-0">
                        <DataTable columns={columns} data={tasks?.documents ?? []}/>
                    </TabsContent>
                    <TabsContent value="kanban" className="mt-0">
                        <DataKanban data={tasks?.documents ?? []} onChange={onKanbanChange} />
                    </TabsContent>
                    <TabsContent value="calender" className="mt-0 h-full pb-4">
                        <DataCalendar data={tasks?.documents ?? []}/>
                    </TabsContent>
                </>
                )}
            </div>
        </Tabs>
    )
}