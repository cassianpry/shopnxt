"use client";
import React, { useState, use } from "react";
import GenreForm from "@/components/form/GenreForm";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdAddCircleOutline, MdDeleteForever, MdEdit } from "react-icons/md";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/search/SearchBar";
import NewGenreForm from "@/components/form/NewGenreForm";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useGenres } from "@/app/services/genres/queries";
import { SearchParamsProps } from "@/types/index.d";
import Pagination from "@/components/Pagination";

interface GenresProps {
  data: {
    genre: [
      {
        _id: string;
        name: string;
        slug: string;
      }
    ];
  };
}

const Genres = (props: SearchParamsProps) => {
  const searchParams = use(props.searchParams);
  const [editGenre, setEditGenre] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const newGenres = useGenres({
    searchQuery: searchParams.query,
    page: (searchParams.page ? +searchParams.page : 1).toString(),
    pageSize: (searchParams.pageSize || 10).toString(),
  });

  // const getGenre = async (genreId: string) => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/genre/${genreId}`
  //     );
  //     const genre = await response.json();
  //     setGenre(genre);
  //   } catch (error) {
  //     console.error("Error fetching genres:", error);
  //   }
  // };

  const handleGenre = (id: React.SetStateAction<string>) => {
    setEditGenre(id);
    setIsOpen(true);
  };

  // useEffect(() => {
  //   if (editGenre) {
  //     getGenre(editGenre);
  //   }
  // }, [editGenre]);

  if (newGenres.isLoading) {
    return (
      <section>
        <h1 className="h1-bold text-dark100_light900"></h1>
        <div className="my-12 pt-5 flex flex-wrap gap-5 items-center space-x-4">
          <div className="flex flex-col space-y-2 justify-center items-center gap-3">
            <Skeleton className="h-4 w-[350px] bg-gray-500" />
            <Skeleton className="h-4 w-[350px] bg-gray-500" />
            <Skeleton className="h-4 w-[350px] bg-gray-500" />
            <Skeleton className="h-4 w-[350px] bg-gray-500" />
            <Skeleton className="h-4 w-[350px] bg-gray-500" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="text-dark100_light900">
      <h1 className="h1-bold pt-12">Gêneros</h1>
      <Separator orientation="horizontal" className="bg-light-400" />
      <div className="w-full">
        <div className="items-center py-4">
          <div className="flex justify-start gap-3 pb-4">
            <SearchBar route="/dashboard/genres" />
            <Button
              type="button"
              className="focus:shadow-outline flex items-center justify-center rounded-lg py-7 font-semibold text-lg tracking-wide text-light-900 transition-all duration-300 ease-in-out bg-blue-900 hover:bg-blue-600"
              onClick={() => setIsNew(true)}
            >
              <MdAddCircleOutline className="h-5 w-5" />
              <span className="ml-3">Novo gênero</span>
            </Button>
          </div>

          {newGenres.data.genre !== undefined ? (
            <div className="border rounded-md mt-1 text-dark400_light900">
              <Table>
                <TableHeader>
                  <TableRow className="text-dark400_light900">
                    <TableHead className="w-[100px]">_id</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(newGenres as GenresProps).data?.genre?.map((genre) => (
                    <TableRow
                      key={genre._id}
                      className="hover:background-light700_dark400"
                    >
                      <TableCell className="font-medium">
                        {newGenres.isFetching ? (
                          <Skeleton className="h-3 w-auto bg-gray-500" />
                        ) : (
                          genre._id
                        )}
                      </TableCell>
                      <TableCell>
                        {newGenres.isFetching ? (
                          <Skeleton className="h-3 w-auto bg-gray-500" />
                        ) : (
                          genre.slug
                        )}
                      </TableCell>
                      <TableCell className="capitalize">
                        {newGenres.isFetching ? (
                          <Skeleton className="h-3 w-auto bg-gray-500" />
                        ) : (
                          genre.name
                        )}
                      </TableCell>
                      <TableCell className=" flex text-right justify-center gap-2">
                        <div className="p-0.5 rounded-full  hover:bg-slate-400 cursor-pointer justify-between">
                          {newGenres.isFetching ? (
                            <Skeleton className="h-5 w-5 rounded-md bg-gray-500" />
                          ) : (
                            <MdEdit
                              className="w-5 h-5 text-yellow-500"
                              onClick={() => handleGenre(genre._id)}
                            />
                          )}
                        </div>
                        <div className="p-0.5 rounded-full  hover:bg-slate-400 cursor-pointer justify-center">
                          {newGenres.isFetching ? (
                            <Skeleton className="h-5 w-5 rounded-md bg-gray-500" />
                          ) : (
                            <MdDeleteForever
                              className="w-5 h-5 text-red-500"
                              onClick={() =>
                                toast({
                                  className: "bg-red-600 text-light-800",
                                  duration: 1500,
                                  variant: "destructive",
                                  title: "Excluir gênero.",
                                  description: "Gênero excluído: {genre name}",
                                })
                              }
                            />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-light400_light500 pt-10">
              Nenhum gênero cadastrado.
            </div>
          )}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {searchParams.query !== undefined &&
              newGenres.data.genre !== undefined ? (
                <>
                  <span className="font-semibold text-md">
                    Total de gêneros encontrados:
                  </span>
                  &nbsp;
                  {newGenres.data.genre.length}
                </>
              ) : newGenres.data.genre !== undefined ? (
                <>
                  <span className="font-semibold text-md">
                    Total de gêneros cadastrados:
                  </span>
                  &nbsp;
                  {newGenres.data.genre.length}
                </>
              ) : (
                ""
              )}
            </div>
            <Pagination
              pageNumber={searchParams?.page ? +searchParams.page : 1}
              isNext={newGenres.data?.isNext}
              total={newGenres?.data?.totalGenres ?? 0}
            />
          </div>
        </div>
      </div>
      <GenreForm isOpen={isOpen} setIsOpen={setIsOpen} genre={editGenre} />

      <NewGenreForm isNew={isNew} setIsNew={setIsNew} />
    </div>
  );
};

export default Genres;
