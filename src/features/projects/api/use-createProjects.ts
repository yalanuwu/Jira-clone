import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";
// import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.projects['$post'], 200>
type RequestType = InferRequestType<typeof client.api.projects['$post']>

export const useCreateProjects = () => {
    // const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn:  async ({form}) => {
            const response = await client.api.projects['$post']({ form });
            if (!response.ok) {
                throw new Error("Failed to create project");
            }
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Project created successfully");
            queryClient.invalidateQueries({queryKey : ['projects']});
        },
        onError: () => {
            toast.error("Project creation failed");
        }
    })

    return mutation;
};


