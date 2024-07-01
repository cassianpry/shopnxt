import React, { useState } from "react";
import { Button } from "./ui/button";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { formUrlQuery, paginate } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  pageNumber: number;
  isNext: boolean | undefined;
  total: number;
}

const Pagination = ({ pageNumber, isNext, total }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const result = paginate(total, 10, pageNumber);

  const handleNavigation = (direction: string, page: number) => {
    // const nextPageNumber =
    //   direction === "prev" ? pageNumber - 1 : pageNumber + 1;
    let nextPageNumber;

    switch (direction) {
      case "prev":
        nextPageNumber = result.currentPage - 1;
        break;
      case "next":
        nextPageNumber = result.currentPage + 1;
        break;
      case "page":
        nextPageNumber = page;
        break;
      default:
        return;
    }

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    if (!isNext && pageNumber === 1) {
      return null;
    }

    router.push(newUrl);
  };

  return (
    <div className="flex justify-center items-center gap-2 text-dark400_light900">
      {(!isNext && result.currentPage === 1) || result.error ? (
        <></>
      ) : (
        <>
          <Button
            disabled={result.currentPage === 1}
            onClick={() => handleNavigation("prev", result.currentPage)}
            className="flex items-center justify-center rounded-md font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300 ease-in-out"
          >
            <BsChevronCompactLeft className="w-4 h-4" />
            Anterior
          </Button>
          {result.newTotalPages?.map((page) => (
            <div key={page} className="body-medium text-dark200_light800">
              {page === result.currentPage ? (
                <Button
                  disabled={!isNext || page === result.currentPage}
                  className={`flex items-center justify-center rounded-md  bg-blue-900 text-light-700 px-4`}
                >
                  {pageNumber}
                </Button>
              ) : (
                <Button
                  className="flex items-center justify-center rounded-md  hover:bg-blue-900 hover:text-light-700 px-4"
                  onClick={() => handleNavigation("page", page)}
                >
                  {page}
                </Button>
              )}
            </div>
          ))}
          <Button
            disabled={!isNext}
            onClick={() => handleNavigation("next", result.currentPage)}
            className="flex items-center justify-center rounded-md font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300 ease-in-out"
          >
            Próximo
            <BsChevronCompactRight className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export default Pagination;
