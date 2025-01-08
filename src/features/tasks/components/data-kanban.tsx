import { Task, TaskStatus } from "../types";

import React, { useCallback, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult, } from '@hello-pangea/dnd'
import { KanbanColumnHeader } from "./kanban-column-header";
import { KanbanCard } from "./kanban-card";



interface DataKanbanProps {
    data: Task[];
    onChange: (tasks: { $id: string; status: TaskStatus; position: number;}[]) => void;
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

export const DataKanban = ({ data, onChange } : DataKanbanProps) => {

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

    useEffect(() => {
        const newTasks: TaskState = {
            [TaskStatus.BACKLOG] : [],
            [TaskStatus.TODO] : [],
            [TaskStatus.IN_PROGRESS] : [],
            [TaskStatus.IN_REVIEW] : [],
            [TaskStatus.DONE] : [],
        };

        data.forEach((task) => {
            newTasks[task.status].push(task);
        });

        Object.keys(newTasks).forEach((status) => {
            newTasks[status as TaskStatus].sort((a, b) => a.position - b.position)
        });

        setTasks(newTasks);

    },[data])

    const onDragEnd = useCallback((result : DropResult) => {
        if (!result.destination) return;

        const { source, destination } = result;
        const sourceStatus = source.droppableId as TaskStatus;
        const destinationStatus = destination.droppableId as TaskStatus;

        let updatesPayload : { $id : string; status: TaskStatus; position: number;}[] = [];

        setTasks((prevTasks) => {
            const newTasks = {...prevTasks};

            //Remove Task from source column
            const sourceColumn = [...newTasks[sourceStatus]];
            const [movedTasks] = sourceColumn.splice(source.index, 1);

            if(!movedTasks){
                console.error("No tasks found at the source index");
                return prevTasks;
            }

            const updatedMovedTask = sourceStatus !== destinationStatus
                ? {...movedTasks, status: destinationStatus}
                : movedTasks;

            //Update source column
            newTasks[sourceStatus] = sourceColumn;

            //Add the task to new updated column
            const destinationColumn = [...newTasks[destinationStatus]];
            destinationColumn.splice(destination.index, 0, updatedMovedTask);

            newTasks[destinationStatus] = destinationColumn;

            //Update minimal update Payloads
            updatesPayload = [];

            updatesPayload.push({
                $id: updatedMovedTask.$id,
                status: destinationStatus,
                position: Math.min((destination.index + 1) * 1000, 1_000_000)
            });

            newTasks[destinationStatus].forEach((task, index) => {
                if (task && task.$id !== updatedMovedTask.$id) {
                    const newPosition = Math.min((index + 1) * 1000, 1_000_000);
                    if (task.position !== newPosition) {
                        updatesPayload.push({
                            $id: task.$id,
                            status: destinationStatus,
                            position: newPosition,
                        })
                    } 
                }
            })

            //If task moved between columns, update positions in the source column
            if (sourceStatus !== destinationStatus) {
                newTasks[sourceStatus].forEach((tasks, index) => {
                    if (tasks) {
                        const newPosition = Math.min((index + 1) * 1000 , 1_000_000);
                        if (tasks.position !== newPosition) {
                            updatesPayload.push({
                                $id: tasks.$id,
                                status: sourceStatus,
                                position: newPosition,
                            })
                        }
                    }
                })
            }

            return newTasks;
        })

        onChange(updatesPayload);
    }, [onChange])

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto">
                {boards.map((board) => {
                    return (
                        <div className='flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]' key={board}>
                            <KanbanColumnHeader 
                                board={board}
                                taskCount = {tasks[board].length}
                            />
                            <Droppable droppableId={board}>
                                {(provided) => (
                                    <div 
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="min-h-[200px] py-1.5"
                                    >
                                        {tasks[board].map((task, index) => (
                                            <Draggable key={task.$id} draggableId={task.$id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        <KanbanCard task={task} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    )
                })}
            </div>
        </DragDropContext>
    )
}