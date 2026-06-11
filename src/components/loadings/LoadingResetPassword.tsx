import React from "react";
import { Skeleton } from "../ui/skeleton";

const LoadingResetPassword = () => {
  return (
    <div className="container">
      <div className="flex items-center justify-center gap-3">
        <Skeleton className="h-14 w-[100px] bg-dark-500" />
        <Skeleton className="h-3 w-[500px] bg-dark-500" />
      </div>
      <div className="flex justify-center m-5">
        <Skeleton className="h-3 w-[250px] bg-dark-500" />
      </div>
      <div className="flex flex-col">
        <Skeleton className="h-3 w-[70px] bg-dark-500" />
        <Skeleton className="h-11 bg-dark-500 mt-0.5" />
      </div>
      <div className="flex flex-col mt-5">
        <Skeleton className="h-3 w-[70px] bg-dark-500" />
        <Skeleton className="h-11 bg-dark-500 mt-0.5" />
      </div>
      <Skeleton className="h-14 bg-dark-500 mt-5" />
    </div>
  );
};

export default LoadingResetPassword;
