import React from "react";
import { Skeleton } from "../ui/skeleton";
import LoadingProductCarousel from "./LoadingProductCarousel";

const LoadingHome = () => {
  return (
    <div className="flex flex-col space-x-4 mb-10">
      <div className="flex flex-row gap-3 justify-center items-center">
        <Skeleton className="h-10 w-52 bg-gray-500" />
        <Skeleton className="h-4 w-32 bg-gray-500" />
        <Skeleton className="h-4 w-32 bg-gray-500" />
      </div>
      <div className="flex pt-5">
        <LoadingProductCarousel />
      </div>
      <div className="flex items-center justify-center gap-2 pt-10">
        <div className="flex flex-col justify-start items-start">
          <Skeleton className="h-[250px] w-[150px] rounded-xl bg-gray-500 mb-3" />
          <Skeleton className="h-2 w-[100px] bg-gray-500 mb-1" />
          <Skeleton className="h-2 w-[90px] bg-gray-500" />
        </div>
        <div className="flex flex-col justify-start items-start">
          <Skeleton className="h-[250px] w-[150px] rounded-xl bg-gray-500 mb-3" />
          <Skeleton className="h-2 w-[100px] bg-gray-500 mb-1" />
          <Skeleton className="h-2 w-[90px] bg-gray-500" />
        </div>
        <div className="flex flex-col justify-start items-start">
          <Skeleton className="h-[250px] w-[150px] rounded-xl bg-gray-500 mb-3" />
          <Skeleton className="h-2 w-[100px] bg-gray-500 mb-1" />
          <Skeleton className="h-2 w-[90px] bg-gray-500" />
        </div>
        <div className="flex flex-col justify-start items-start">
          <Skeleton className="h-[250px] w-[150px] rounded-xl bg-gray-500 mb-3" />
          <Skeleton className="h-2 w-[100px] bg-gray-500 mb-1" />
          <Skeleton className="h-2 w-[90px] bg-gray-500" />
        </div>
      </div>
      <div className="flex justify-center mt-10 gap-5">
        <div className="flex flex-col">
          <Skeleton className="h-[200px] w-[300px] rounded-xl bg-gray-500 mb-3" />
          <Skeleton className="h-2 w-[200px] bg-gray-500 mb-1" />
          <Skeleton className="h-2 w-[90px] bg-gray-500" />
          <div className="flex justify-start mt-3 gap-10">
            <Skeleton className="h-8 w-[100px] bg-gray-500" />
            <Skeleton className="h-8 w-[100px] bg-gray-500" />
          </div>
        </div>
        <div className="flex flex-col">
          <Skeleton className="h-[200px] w-[300px] rounded-xl bg-gray-500 mb-3" />
          <Skeleton className="h-2 w-[200px] bg-gray-500 mb-1" />
          <Skeleton className="h-2 w-[90px] bg-gray-500" />
          <div className="flex justify-start mt-3 gap-10">
            <Skeleton className="h-8 w-[100px] bg-gray-500" />
            <Skeleton className="h-8 w-[100px] bg-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingHome;
