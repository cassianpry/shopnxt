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
    <TableCell className="text-text-body">
      {isFetching ? <Skeleton className="h-3 w-auto bg-dark-400" /> : content}
    </TableCell>
  );

  return (
    <TableRow key={user._id} className="border-b border-dark-400 hover:bg-dark-400">
      {renderTableCell(user._id)}
      {renderTableCell(user.name)}
      {renderTableCell(user.email)}
      {renderTableCell(user.role)}
      <TableCell className="flex text-right justify-center gap-2">
        <div className="p-0.5 rounded-full hover:bg-dark-600 cursor-pointer">
          {isFetching ? (
            <Skeleton className="h-5 w-5 bg-dark-400" />
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
        <div className="p-0.5 rounded-full hover:bg-dark-600 cursor-pointer">
          {isFetching ? (
            <Skeleton className="h-5 w-5 bg-dark-400" />
          ) : (
            <MdDeleteForever
              className="w-5 h-5 text-red-500"
              onClick={() =>
                toast({
                  className: "bg-red-600 text-white",
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
