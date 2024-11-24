import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.auth.signUp['$post']>
type RequestType = InferRequestType<typeof client.api.auth.signUp['$post']>

export const useSignUp = () => {

    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn:  async ({json}) => {
            const response = await client.api.auth.signUp['$post']({ json });
            if (!response.ok) {
                throw new Error("Failed to SignUp");
            }
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Sign Up Successful');
            router.refresh();
            queryClient.invalidateQueries({queryKey : ['current']});
        },
        onError: () => {
            toast.error('Sign Up Failed');
        }
    })

    return mutation;
};


