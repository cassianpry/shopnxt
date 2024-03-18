"use client";
import { useUser, useUsers } from "@/app/services/users/queries";
import Pagination from "@/components/Pagination";
import UserForm from "@/components/form/UserForm";
import SearchBar from "@/components/search/SearchBar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { SearchParamsProps, UserProps } from "@/types/index.d";
import React, { useState } from "react";
import { MdDeleteForever, MdEdit } from "react-icons/md";

function Users({ searchParams }: SearchParamsProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState("");

  const { data: users, isLoading } = useUsers({
    searchQuery: searchParams.query,
    page: (searchParams.page ? +searchParams.page : 1).toString(),
    pageSize: (searchParams.pageSize || 10).toString(),
  });
  const user = useUser(userId);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900 pt-12">Usuários</h1>
      <Separator orientation="horizontal" className="bg-light-400" />

      <div className="w-full">
        <div className="items-center py-4 text-dark400_light900">
          <div className="flex justify-start gap-3 pb-4">
            <SearchBar route="/dashboard/users" />
          </div>
          {users?.users?.length > 0 ? (
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
                  {(users?.users as UserProps[])?.map((user) => (
                    <TableRow
                      key={user._id}
                      className="hover:background-light800_dark400"
                    >
                      <TableCell className="font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-10">
                        {user._id}
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell className=" flex text-right justify-center gap-2">
                        <div className="p-0.5 rounded-full  hover:bg-slate-400 cursor-pointer">
                          <MdEdit
                            className="w-5 h-5 text-yellow-500"
                            onClick={() => {
                              setUserId(user._id!);
                              setIsOpen(true);
                            }}
                          />
                        </div>
                        <div className="p-0.5 rounded-full  hover:bg-slate-400 cursor-pointer">
                          <MdDeleteForever
                            className="w-5 h-5 text-red-500"
                            onClick={() =>
                              toast({
                                className: "bg-red-600 text-light-800",
                                duration: 1500,
                                variant: "destructive",
                                title: "Excluir gênero.",
                                description: "Gênero excluído: {user name}",
                              })
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-light400_light500 pt-10">
              Nenhum usuário cadastrado.
            </div>
          )}
          <div className="flex items-center justify-between space-x-2 py-4 text-dark300_light700">
            <div className="flex-1 text-sm text-muted-foreground">
              {searchParams.query !== undefined &&
              users?.users !== undefined ? (
                <>
                  <span className="font-semibold text-md">
                    Total de usuários encontrados:
                  </span>
                  &nbsp;
                  {users.users.length}
                </>
              ) : users.users !== undefined ? (
                <>
                  <span className="font-semibold text-md">
                    Total de usuário cadastrados:
                  </span>
                  &nbsp;
                  {users?.totalUsers}
                </>
              ) : (
                ""
              )}
            </div>
            <Pagination
              pageNumber={searchParams?.page ? +searchParams.page : 1}
              isNext={users?.isNext}
              total={users?.totalUsers ?? 0}
            />
          </div>
        </div>
      </div>

      <UserForm isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
    </div>
  );
}

export default Users;
