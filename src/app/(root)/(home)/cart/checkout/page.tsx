"use client";

import UserCheckoutForm from "@/components/form/UserCheckoutForm";
import Loading from "@/components/loading";
import { UserProps } from "@/types/index.d";
import { useSession } from "next-auth/react";


const Checkout = () => {
  const { data } = useSession();

  return (
    <div className="bg-dark-100 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-24 pb-16">
        {data?.user ? (
          <UserCheckoutForm user={data.user as UserProps} />
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default Checkout;
