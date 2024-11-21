'use client';

import { Button } from "@/components/ui/button";

import { useCurrent } from "@/features/auth/api/use-current";
import { useLogOut } from "@/features/auth/api/use-logOut";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()
  const { data, isLoading } = useCurrent();
  const { mutate } = useLogOut();

  useEffect(() => {
    if(!data && !isLoading){
      router.push('/sign-in');
    }
  }, [data]);

  return (
    <div  className="flex gap-4">
      Only Visible to authorized users
      <Button onClick={() => mutate()}>
        Logout
      </Button>
    </div>
  );
}
