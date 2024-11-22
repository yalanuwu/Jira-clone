import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.auth.logout['$post']>

export const useLogOut = () => {

    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn:  async () => {
            const response = await client.api.auth.logout['$post']();
            return await response.json();
        },
        onSuccess : () => {
            // window.location.reload();
            router.refresh();
            queryClient.invalidateQueries({queryKey : ['current']});
        }
    })

    return mutation;
};


