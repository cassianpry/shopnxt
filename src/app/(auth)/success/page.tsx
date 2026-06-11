import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { MdArrowForward, MdOutlineCheckCircle } from "react-icons/md";

const Success = () => {
  return (
    <main className="min-h-screen bg-dark-100 flex items-center justify-center">
      <div className="bg-dark-300 border border-dark-400 rounded-xl p-8 w-full max-w-md mx-4 text-center">
        <div className="flex flex-col items-center gap-4">
          <MdOutlineCheckCircle className="text-green-400 w-16 h-16" />
          <h1 className="font-spaceGrotesk text-2xl font-bold text-text-high">
            E-mail enviado com sucesso!
          </h1>
        </div>
        <div className="flex flex-col gap-4 mt-6">
          <p className="text-text-body text-sm">
            Você irá receber um e-mail de confirmação com os detalhes para
            redefinir a sua senha
          </p>

          <Link
            href="/"
            className="w-full bg-accent hover:bg-accent-hover text-white font-semibold rounded-md px-6 py-2.5 text-sm transition-colors inline-flex items-center justify-center gap-2"
          >
            <MdArrowForward className="w-4 h-4" />
            Ir para a pagina principal
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Success;
