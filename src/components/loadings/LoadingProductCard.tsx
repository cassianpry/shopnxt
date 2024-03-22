import React from "react";
import { Skeleton } from "../ui/skeleton";

const LoadingProductCard = () => {
  return (
    <div className="flex flex-col text-dark400_light900 rounded-md bg-gray-200 dark:bg-gray-700 m-5">
      <div className="flex items-start m-5 ">
        <Skeleton className="h-20 w-[150px] bg-gray-500" />
        <div className="flex flex-col ml-3 gap-3">
          <Skeleton className="h-4 w-[250px] bg-gray-500" />
          <Skeleton className="h-4 w-[150px] bg-gray-500" />
          <Skeleton className="h-4 w-[100px] bg-gray-500" />
        </div>
      </div>
      <div className="flex justify-between m-5">
        <Skeleton className="h-7 w-[70px] bg-gray-500" />
        <Skeleton className="h-7 w-[70px] bg-gray-500" />
      </div>
    </div>
  );
};

export default LoadingProductCard;
