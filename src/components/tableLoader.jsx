"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TableLoader() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <Skeleton className={"max-w-20 w-full min-h-10"} />
        <Skeleton className={"max-w-52 w-full min-h-10"} />
      </div>
      <div className="w-full flex flex-col mt-5 space-y-2">
        {Array.from({ length: 4 }).map((_,i) => {
          return <Skeleton key={i} className={"w-full min-h-10"} />;
        })}
      </div>
      <div className="flex justify-end w-full mt-4">
        <div className="flex space-x-3">
        <Skeleton className={"w-20  min-h-8"} />
        <Skeleton className={"w-20  min-h-8"} />
        <Skeleton className={"w-32  min-h-8"} />

        </div>
      </div>
    </div>
  );
}
