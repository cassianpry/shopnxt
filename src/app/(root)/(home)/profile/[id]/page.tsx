"use client";
import React from "react";
import { useSession } from "next-auth/react";
import ProfileForm from "@/components/form/ProfileForm";

import { redirect } from "next/navigation";
import { UserProps } from "@/types/index.d";
import LoadingProfile from "@/components/loadings/LoadingProfile";

const ProfileEditPage = () => {
  const { data, status } = useSession();

  if (status === "unauthenticated") {
    return redirect("/sign-in");
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-24 pb-16">
      <h1 className="text-4xl text-center font-bold tracking-tight sm:text-6xl text-text-high mb-8">
        Perfil de usuário
      </h1>
      {status === "loading" ? (
        <LoadingProfile />
      ) : data ? (
        <ProfileForm user={data?.user as UserProps} />
      ) : null}
    </div>
  );
};

export default ProfileEditPage;
