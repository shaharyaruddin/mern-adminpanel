import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { ModeToggle } from "./theme-mode-toggle";

const ChatHeader = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center justify-between px-4 w-full">
        <div className="flex gap-2">
          <SidebarTrigger className="-ml-1" />
        </div>
        <ModeToggle />
      </div>
    </header>
  );
};

export default ChatHeader;
