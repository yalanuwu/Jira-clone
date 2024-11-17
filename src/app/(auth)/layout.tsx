"use client";

import Image from "next/image"

import { ReactNode } from "react"
import { usePathname } from "next/navigation";
import Link from "next/link";

import {Button} from "@/components/ui/button"

interface AuthLayoutProps {
    children : ReactNode
}

function AuthLayout({ children } : AuthLayoutProps) {
  const pathName = usePathname();

  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Image src="/logo.svg" height={25} width={50} alt="logo"/>
          
          <Button asChild variant='secondary'>
            <Link href={pathName === '/sign-in' ? '/sign-up' : 'sign-in'}>
              {pathName === '/sign-in' ? "Sign Up" : "Login"}
            </Link>
          </Button>
          
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  )
}

export default AuthLayout