import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.auth.signIn['$post']>
type RequestType = InferRequestType<typeof client.api.auth.signIn['$post']>

export const useSignIn = () => {

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn:  async ({json}) => {
            const response = await client.api.auth.signIn['$post']({ json });
            return await response.json();
        }
    })

    return mutation;
};


