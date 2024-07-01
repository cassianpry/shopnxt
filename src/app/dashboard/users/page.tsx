"use client";
import { useUser, useUsers } from "@/app/services/users/queries";
import Pagination from "@/components/Pagination";
import UsersRow from "@/components/dashboard/users/UsersRow";
import UserForm from "@/components/form/UserForm";
import SearchBar from "@/components/search/SearchBar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchParamsProps, UserProps } from "@/types/index.d";
import React, { useState } from "react";

function Users({ searchParams }: SearchParamsProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState("");

  const users = useUsers({
    searchQuery: searchParams.query,
    page: (searchParams.page ? +searchParams.page : 1).toString(),
    pageSize: (searchParams.pageSize || 10).toString(),
  });
  const user = useUser(userId);

  return (
    <>
      <div>
        <h1 className="h1-bold text-dark100_light900 pt-12">Usuários</h1>
        <Separator orientation="horizontal" className="bg-light-400" />

        <div className="w-full">
          <div className="items-center py-4 text-dark400_light900">
            <div className="flex justify-start gap-3 pb-4">
              <SearchBar route="/dashboard/users" />
            </div>
            {users?.data?.users?.length > 0 && !users?.isFetching ? (
              <div className="flex mx-auto border rounded-md mt-1 text-dark400_light900">
                <Table>
                  <TableHeader>
                    <TableRow className="text-light-700 bg-blue-900">
                      <TableHead className="w-[100px]">_id</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(users?.data?.users as UserProps[])?.map((user) => (
                      <UsersRow
                        key={user._id}
                        user={user}
                        isFetching={users?.isFetching}
                        setIsOpen={setIsOpen}
                        setUserId={setUserId}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : users?.data?.users?.length === 0 && !users.isFetching ? (
              <div className="text-light400_light500 pt-10">
                Nenhum usuário cadastrado.
              </div>
            ) : (
              <div>
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
              </div>
            )}
            <div className="flex items-center justify-between space-x-2 py-4 text-dark300_light700">
              <div className="flex-1 text-sm text-muted-foreground">
                {searchParams.query !== undefined &&
                users?.data?.users !== undefined ? (
                  <>
                    <span className="font-semibold text-md">
                      Total de usuários encontrados:
                    </span>
                    &nbsp;
                    {users?.data?.users.length}
                  </>
                ) : users?.data?.users !== undefined ? (
                  <>
                    <span className="font-semibold text-md">
                      Total de usuário cadastrados:
                    </span>
                    &nbsp;
                    {users?.data?.totalUsers}
                  </>
                ) : (
                  ""
                )}
              </div>
              <Pagination
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={users?.data?.isNext}
                total={users?.data?.totalUsers ?? 0}
              />
            </div>
          </div>
        </div>

        <UserForm isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
      </div>
    </>
  );
}

export default Users;
