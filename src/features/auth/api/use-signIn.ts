import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.auth.signIn['$post']>
type RequestType = InferRequestType<typeof client.api.auth.signIn['$post']>

export const useSignIn = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn:  async ({json}) => {
            const response = await client.api.auth.signIn['$post']({ json });

            if (!response.ok) {
                throw new Error("Failed to SignIn");
            }
            
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Signed In Successfully');
            router.refresh();
            queryClient.invalidateQueries({queryKey : ['current']});
        },
        onError: () => {
            toast.error('Sign In Failed');
        }
    })

    return mutation;
};


