import React from "react";
import { Skeleton } from "../ui/skeleton";

const LoadingProductCarousel = () => {
  return (
    <div className="max-w-[1100px] m-auto pt-5 relative">
      <div className="h-[320px]">
        <Skeleton className="h-[300px] w-[500px] rounded-xl bg-gray-500" />
      </div>
      <div className="flex text-2xl cursor-pointer justify-center mx-1 gap-2">
        <Skeleton className="h-8 w-[70px] bg-gray-500" />
        <Skeleton className="h-8 w-[70px] bg-gray-500" />
        <Skeleton className="h-8 w-[70px] bg-gray-500" />
        <Skeleton className="h-8 w-[70px] bg-gray-500" />
        <Skeleton className="h-8 w-[70px] bg-gray-500" />
      </div>
    </div>
  );
};

export default LoadingProductCarousel;
