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
  const currentMonthUsers = users?.filter((user) =>
    moment(user?.createdAt).isSame(moment(), "month")
  );

  const usersPercentage = growUsersPercentage(users);

  return (
    <div className="bg-dark-300 border border-dark-400 rounded-xl p-6">
      <div className="flex flex-row items-center justify-between space-y-0 mb-4">
        <h3 className="text-text-muted text-sm">Usuários Cadastrados</h3>
        <MdPeopleAlt className="h-5 w-5 text-accent" />
      </div>
      <div>
        <div className="text-text-high text-3xl font-bold">
          {isLoading ? (
            <Skeleton className="h-4 w-[50px] bg-dark-400" />
          ) : (
            +currentMonthUsers.length
          )}
        </div>
        <div>
          {isLoading ? (
            <div className="pt-1">
              <Skeleton className="h-4 w-[50px] bg-dark-400" />
            </div>
          ) : (
            <div className="text-xs text-text-muted">
              {!Number.isNaN(usersPercentage) ? (
                <p>
                  +{usersPercentage} % desde o ultimo mês
                </p>
              ) : (
                0
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuantityUsers;
