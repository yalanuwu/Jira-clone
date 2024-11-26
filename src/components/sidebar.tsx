import Link from "next/link";
import Image from "next/image";
import { dottedSeparator as DottedSeparator } from "./dotted-line-separator";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";

export const Sidebar = () => {
    return (
        <aside className="h-full bg-neutral-100 p-4 w-full">
            <Link href={"/"}>
                <Image src='/logo.svg' alt="Logo" width={90} height={30}/>
            </Link>
            <DottedSeparator className="my-4"/>
            <WorkspaceSwitcher />
            <DottedSeparator className="my-4"/>
            <Navigation />
        </aside>
    );
};