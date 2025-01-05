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

export const TaskViewSwitcher = () => {

    const [{
        status,
        assigneeId,
        projectId,
        dueDate
    }] = useTaskFilters();

    const workspaceId = useWorkspaceId();
    const { open } = useCreateTaskModal();

    const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ 
        workspaceId,
        projectId,
        assigneeId,
        status,
        dueDate 
    });

    const [view, setView] = useQueryState('task-view', {
        defaultValue: 'table',
    });


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
                    <DataFilters />
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
                        {JSON.stringify(tasks)}
                    </TabsContent>
                    <TabsContent value="calender" className="mt-0">
                        {JSON.stringify(tasks)}
                    </TabsContent>
                </>
                )}
            </div>
        </Tabs>
    )
}