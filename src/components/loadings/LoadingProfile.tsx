import React from "react";
import { Skeleton } from "../ui/skeleton";

const LoadingProfile = () => {
  return (
    <div className="container mt-10">
      <div className="flex justify-center m-5">
        <Skeleton className="h-3 w-[250px] bg-gray-500" />
      </div>
      <div className="flex flex-col">
        <Skeleton className="h-3 w-[70px] bg-gray-500" />
        <Skeleton className="h-11 bg-gray-500 mt-0.5" />
      </div>
      <div className="flex flex-col mt-5">
        <Skeleton className="h-3 w-[70px] bg-gray-500" />
        <Skeleton className="h-11 bg-gray-500 mt-0.5" />
      </div>
      <div className="flex flex-col mt-5">
        <Skeleton className="h-3 w-[70px] bg-gray-500" />
        <Skeleton className="h-11 bg-gray-500 mt-0.5" />
      </div>
      <div className="flex flex-col mt-5">
        <Skeleton className="h-3 w-[70px] bg-gray-500" />
        <Skeleton className="h-11 bg-gray-500 mt-0.5" />
      </div>
      <div className="flex flex-col mt-5">
        <Skeleton className="h-3 w-[70px] bg-gray-500" />
        <Skeleton className="h-11 bg-gray-500 mt-0.5" />
      </div>
      <div className="flex flex-col mt-5">
        <Skeleton className="h-3 w-[70px] bg-gray-500" />
        <Skeleton className="h-11 bg-gray-500 mt-0.5" />
      </div>
      <div className="flex flex-col mt-5">
        <Skeleton className="h-3 w-[70px] bg-gray-500" />
        <Skeleton className="h-11 bg-gray-500 mt-0.5" />
      </div>
      <Skeleton className="h-14 bg-gray-500 mt-5" />
    </div>
  );
};

export default LoadingProfile;
