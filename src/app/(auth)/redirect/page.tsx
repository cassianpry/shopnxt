"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Redirect = () => {
  const router = useRouter();
  const [timeToRedirect, setTimeToRedirect] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeToRedirect((prev) => prev - 1);
      if (timeToRedirect === 0) router.push("/sign-in");
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });
  return (
    <div className="flex-row h-[1000px] text-light-900 text-center">
      {timeToRedirect >= 0 && (
        <>
          <p>
            Seu usuário foi criado com sucesso! Aguarde enquanto te
            redirecionamos...{timeToRedirect}
          </p>
          <div className="pt-9">
            <p>
              Caso não for redirecionado&nbsp;
              <Link
                href="/sign-in"
                className="text-blue-300 hover:text-teal-400"
              >
                clique aqui
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Redirect;
