import { Task, TaskStatus } from "../types";

import React, { useCallback, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult, } from '@hello-pangea/dnd'
import { KanbanColumnHeader } from "./kanban-column-header";



interface DataKanbanProps {
    data: Task[];
};



const boards: TaskStatus[] = [
    TaskStatus.BACKLOG,
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_REVIEW,
    TaskStatus.DONE,
]

type TaskState = {
    [key in TaskStatus] : Task[];
};

export const DataKanban = ({ data } : DataKanbanProps) => {

    const [ tasks, setTasks ] = useState<TaskState>(() => {

        const initialTasks: TaskState = {
            [TaskStatus.BACKLOG] : [],
            [TaskStatus.TODO] : [],
            [TaskStatus.IN_PROGRESS] : [],
            [TaskStatus.IN_REVIEW] : [],
            [TaskStatus.DONE] : [],
        };

        data.forEach((task) => {
            initialTasks[task.status].push(task);
        });

        Object.keys(initialTasks).forEach((status) => {
            initialTasks[status as TaskStatus].sort((a, b) => a.position - b.position)
        });

        return initialTasks;
    })

    return (
        <DragDropContext onDragEnd={() => {}}>
            <div className="flex overflow-x-auto">
                {boards.map((board) => {
                    return (
                        <div className='flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]' key={board}>
                            <KanbanColumnHeader 
                                board={board}
                                taskCount = {tasks[board].length}
                            />
                        </div>
                    )
                })}
            </div>
        </DragDropContext>
    )
}