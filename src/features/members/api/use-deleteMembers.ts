import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";
// import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.members[':memberId']['$delete'], 200>
type RequestType = InferRequestType<typeof client.api.members[':memberId']['$delete']>

export const useDeleteMember = () => {
    // const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn:  async ({ param }) => {
            const response = await client.api.members[':memberId']['$delete']({ param });
            if (!response.ok) {
                throw new Error("Failed to delete member");
            }
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Member deleted successfully");
            queryClient.invalidateQueries({queryKey : ['members']});
        },
        onError: () => {
            toast.error("Member deletion failed");
        }
    })

    return mutation;
};


