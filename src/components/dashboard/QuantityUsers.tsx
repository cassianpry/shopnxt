import { UserProps } from "@/types/index.d";
import React from "react";
import { MdPeopleAlt } from "react-icons/md";
import { Skeleton } from "../ui/skeleton";
import moment from "moment";
import { growUsersPercentage } from "@/lib/utils";

interface QuantityUsersProps {
  users: UserProps[];
  isLoading: boolean;
}

const QuantityUsers: React.FC<QuantityUsersProps> = ({ users, isLoading }) => {
  //Total sales based on current month
  const currentMonthUsers = users?.filter((user) => moment(user?.createdAt));

  const usersPercentage = growUsersPercentage(users);

  return (
    <div className="rounded-xl border dark:border-gray-700 background-light800_dark300 shadow">
      <div className="flex flex-row items-center justify-between space-y-0 m-3 md:gap-10">
        <h3 className="tracking-tight body-semibold">Usuários Cadastrados</h3>
        <MdPeopleAlt className="h-4 w-4 base-regular" />
      </div>
      <div className="m-3 items-center justify-center">
        <div className="h3-semibold">
          {isLoading ? (
            <Skeleton className="h-4 w-[50px] bg-gray-500" />
          ) : (
            +currentMonthUsers.length
          )}
        </div>
        <div>
          {isLoading ? (
            <div className="pt-1">
              <Skeleton className="h-4 w-[50px] bg-gray-500" />
            </div>
          ) : (
            <div className="small-regular">
              {!Number.isNaN(usersPercentage) ? (
                <p className="small-regular text-gray-500">
                  +{usersPercentage} % desde o ultimo mês
                </p>
              ) : (
                "0% desde o ultimo mês"
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuantityUsers;
