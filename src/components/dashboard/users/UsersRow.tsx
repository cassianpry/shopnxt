import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { UserProps } from "@/types/index.d";
import React from "react";
import { MdDeleteForever, MdEdit } from "react-icons/md";

interface UsersRowProps {
  user: UserProps;
  isFetching: boolean;
  setUserId: (arg0: string) => void;
  setIsOpen: (arg0: boolean) => void;
}

function UsersRow({ user, isFetching, setUserId, setIsOpen }: UsersRowProps) {
  const renderTableCell = (content: React.ReactNode) => (
    <TableCell>
      {isFetching ? <Skeleton className="h-3 w-auto bg-gray-500" /> : content}
    </TableCell>
  );

  return (
    <TableRow key={user._id} className="hover:background-light800_dark400">
      {renderTableCell(user._id)}
      {renderTableCell(user.name)}
      {renderTableCell(user.email)}
      {renderTableCell(user.role)}
      <TableCell className=" flex text-right justify-center gap-2">
        <div className="p-0.5 rounded-full  hover:bg-slate-400 cursor-pointer">
          {isFetching ? (
            <Skeleton className="h-5 w-5 bg-gray-500" />
          ) : (
            <MdEdit
              className="w-5 h-5 text-yellow-500"
              onClick={() => {
                setUserId(user._id!);
                setIsOpen(true);
              }}
            />
          )}
        </div>
        <div className="p-0.5 rounded-full  hover:bg-slate-400 cursor-pointer">
          {isFetching ? (
            <Skeleton className="h-5 w-5 bg-gray-500" />
          ) : (
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
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

export default UsersRow;
