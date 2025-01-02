import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dottedSeparator as DottedSeparator } from "@/components/dotted-line-separator"
import { PlusIcon } from "lucide-react"

export const TaskViewSwitcher = () => {
    return (
        <Tabs className="flex-1 rounded-lg border w-full">
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
                    <Button size='sm' className="w-full lg:w-auto">
                        <PlusIcon className="size-4 mr-2"/>
                        New
                    </Button>
                </div>
                <DottedSeparator className="my-4"/>
                {/* Add filters*/}
                <DottedSeparator className="my-4"/>
                <>
                    <TabsContent value="table" className="mt-0">
                        Data Table
                    </TabsContent>
                    <TabsContent value="kanban" className="mt-0">
                        Data Kanban
                    </TabsContent>
                    <TabsContent value="calender" className="mt-0">
                        Data Calender
                    </TabsContent>
                </>
            </div>
        </Tabs>
    )
}