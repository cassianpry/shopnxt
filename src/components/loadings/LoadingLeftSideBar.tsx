import React from "react";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";

const LoadingLeftSideBar = () => {
  return (
    <>
      <Skeleton className="h-3 w-40 bg-dark-500" />
      <div className="flex items-center gap-2 mt-10">
        <Skeleton className="h-8 w-8 bg-dark-500" />
        <Skeleton className="h-5 w-36 bg-dark-500" />
      </div>
      <div className="flex flex-1 flex-col mt-16">
        <Skeleton className="h-3 w-40 bg-dark-500" />
        <Separator orientation="horizontal" className="bg-black mt-5" />
        <Skeleton className="h-3 w-40 bg-dark-500 mt-5" />
      </div>
    </>
  );
};

export default LoadingLeftSideBar;
