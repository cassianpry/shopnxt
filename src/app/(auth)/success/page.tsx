import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { MdArrowForward, MdOutlineCheckCircle } from "react-icons/md";

const Success = () => {
  return (
    <main className="flex flex-row mx-auto items-center justify-center mt-16 mb-32">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-center">
          <MdOutlineCheckCircle className="text-green-600 w-48 h-48" />
          <h1 className="font-bold text-4xl pb-10">
            E-mail enviado com sucesso!
          </h1>
        </div>
        <div className="flex flex-col gap-3">
          <p>
            Você irá receber um e-mail de confirmação com os detalhes para
            redefinir a sua senha
          </p>

          <Link
            href="/"
            className="focus:shadow-outline p-3 flex items-center justify-center rounded-md font-semibold text-sm transition-all duration-300 ease-in-out"
          >
            <MdArrowForward className="w-4 h-4" />
            <span>&nbsp;&nbsp;Ir para a pagina principal</span>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Success;
