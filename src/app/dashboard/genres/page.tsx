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
        <h1 className="text-text-high text-2xl font-bold font-spaceGrotesk mb-6"></h1>
        <div className="my-12 pt-5 flex flex-wrap gap-5 items-center space-x-4">
          <div className="flex flex-col space-y-2 justify-center items-center gap-3">
            <Skeleton className="h-4 w-[350px] bg-dark-400" />
            <Skeleton className="h-4 w-[350px] bg-dark-400" />
            <Skeleton className="h-4 w-[350px] bg-dark-400" />
            <Skeleton className="h-4 w-[350px] bg-dark-400" />
            <Skeleton className="h-4 w-[350px] bg-dark-400" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <div>
      <h1 className="text-text-high text-2xl font-bold font-spaceGrotesk mb-6">Gêneros</h1>
      <Separator orientation="horizontal" className="bg-dark-400" />
      <div className="w-full">
        <div className="items-center py-4">
          <div className="flex justify-start gap-3 pb-4">
            <SearchBar route="/dashboard/genres" />
            <Button
              type="button"
              className="btn-primary py-3"
              onClick={() => setIsNew(true)}
            >
              <MdAddCircleOutline className="h-5 w-5" />
              <span className="ml-2">Novo gênero</span>
            </Button>
          </div>

          {newGenres.data?.genre !== undefined ? (
            <div className="bg-dark-300 rounded-xl border border-dark-400 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-dark-400 text-text-high text-sm font-medium">
                    <TableHead className="w-[100px] text-text-high">_id</TableHead>
                    <TableHead className="text-text-high">Slug</TableHead>
                    <TableHead className="text-text-high">Nome</TableHead>
                    <TableHead className="text-center text-text-high">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newGenres.data?.genre?.map((genre) => (
                    <TableRow
                      key={genre._id}
                      className="border-b border-dark-400 text-text-body text-sm hover:bg-dark-400"
                    >
                      <TableCell className="font-medium">
                        {newGenres.isFetching ? (
                          <Skeleton className="h-3 w-auto bg-dark-400" />
                        ) : (
                          genre._id
                        )}
                      </TableCell>
                      <TableCell>
                        {newGenres.isFetching ? (
                          <Skeleton className="h-3 w-auto bg-dark-400" />
                        ) : (
                          genre.slug
                        )}
                      </TableCell>
                      <TableCell className="capitalize">
                        {newGenres.isFetching ? (
                          <Skeleton className="h-3 w-auto bg-dark-400" />
                        ) : (
                          genre.name
                        )}
                      </TableCell>
                      <TableCell className="flex text-right justify-center gap-2">
                        <div className="p-0.5 rounded-full hover:bg-dark-600 cursor-pointer justify-between">
                          {newGenres.isFetching ? (
                            <Skeleton className="h-5 w-5 rounded-md bg-dark-400" />
                          ) : (
                            <MdEdit
                              className="w-5 h-5 text-yellow-500"
                              onClick={() => handleGenre(genre._id)}
                            />
                          )}
                        </div>
                        <div className="p-0.5 rounded-full hover:bg-dark-600 cursor-pointer justify-center">
                          {newGenres.isFetching ? (
                            <Skeleton className="h-5 w-5 rounded-md bg-dark-400" />
                          ) : (
                            <MdDeleteForever
                              className="w-5 h-5 text-red-500"
                              onClick={() =>
                                toast({
                                  className: "bg-red-600 text-white",
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
            <div className="text-text-muted pt-10">
              Nenhum gênero cadastrado.
            </div>
          )}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-text-body">
              {searchParams.query !== undefined &&
              newGenres.data?.genre !== undefined ? (
                <>
                  <span className="font-semibold text-md">
                    Total de gêneros encontrados:
                  </span>
                  &nbsp;
                  {newGenres.data?.genre.length}
                </>
              ) : newGenres.data?.genre !== undefined ? (
                <>
                  <span className="font-semibold text-md">
                    Total de gêneros cadastrados:
                  </span>
                  &nbsp;
                  {newGenres.data?.genre.length}
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
