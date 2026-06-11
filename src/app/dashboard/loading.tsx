import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section>
      <h1 className="text-text-high text-2xl font-bold font-spaceGrotesk mb-6"></h1>
      <div className="mb-12 mt-11 flex flex-wrap gap-5 items-center space-x-4">
        <div className="flex flex-col space-y-2 justify-center items-center">
          <Skeleton className="h-4 w-[250px] bg-dark-400" />
          <Skeleton className="h-4 w-[250px] bg-dark-400" />
          <Skeleton className="h-4 w-[250px] bg-dark-400" />
          <Skeleton className="h-4 w-[250px] bg-dark-400" />
          <Skeleton className="h-4 w-[250px] bg-dark-400" />
        </div>
      </div>
    </section>
  );
};

export default Loading;
