import React from "react";
import { Skeleton } from "@/src/components/ui/skeleton";
import { title } from "process";

interface LoadingProps {
  title?: string;
}

const Loading = ({ title }: LoadingProps) => {
  return (
    <section>
      <h1 className="h1-bold text-dark100_light900">{title}</h1>
      <div className="mb-12 mt-11 flex flex-wrap gap-5 items-center space-x-4">
        <Skeleton className="h-14 w-14 rounded-full bg-gray-500" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-gray-500" />
          <Skeleton className="h-4 w-[200px] bg-gray-500" />
        </div>
      </div>
      <div className="mb-12 mt-11 flex flex-wrap gap-5 items-center space-x-4">
        <Skeleton className="h-14 w-14 rounded-full bg-gray-500" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-gray-500" />
          <Skeleton className="h-4 w-[200px] bg-gray-500" />
        </div>
      </div>
      <div className="mb-12 mt-11 flex flex-wrap gap-5 items-center space-x-4">
        <Skeleton className="h-14 w-14 rounded-full bg-gray-500" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-gray-500" />
          <Skeleton className="h-4 w-[200px] bg-gray-500" />
        </div>
      </div>
      <div className="mb-12 mt-11 flex flex-wrap gap-5 items-center space-x-4">
        <Skeleton className="h-14 w-14 rounded-full bg-gray-500" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-gray-500" />
          <Skeleton className="h-4 w-[200px] bg-gray-500" />
        </div>
      </div>
      <div className="mb-12 mt-11 flex flex-wrap gap-5 items-center space-x-4">
        <Skeleton className="h-14 w-14 rounded-full bg-gray-500" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-gray-500" />
          <Skeleton className="h-4 w-[200px] bg-gray-500" />
        </div>
      </div>
    </section>
  );
};

export default Loading;
