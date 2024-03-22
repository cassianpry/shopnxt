"use client";
import Loading from "@/app/dashboard/loading";
import UserCheckoutForm from "@/components/form/UserCheckoutForm";
import { UserProps } from "@/types/index.d";
import { useSession } from "next-auth/react";
import React from "react";

const Checkout = () => {
  const { data } = useSession();

  return (
    <div className="text-dark400_light900">
      {data?.user ? (
        <UserCheckoutForm user={data.user as UserProps} />
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Checkout;
