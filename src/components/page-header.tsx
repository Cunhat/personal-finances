import React, { PropsWithChildren } from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";

type PageHeaderProps = {
  title: string;
};

export function PageHeader({
  title,
  children,
}: PropsWithChildren<PageHeaderProps>) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-bold">{title}</h1>
        {children}
      </div>
    </header>
  );
}
