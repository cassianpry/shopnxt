import Image from "next/image";
import React from "react";
import not_found from "@/public/assets/images/404.svg";

const Notfound = () => {
  return (
    <div className="bg-blue-900 text-center w-full min-h-screen">
      <h1 className="h1-bold text-light-900 pt-40">
        Parece que essa pagina não existe.
      </h1>
      <h3 className="h2-bold text-light-850 mt-5">
        Tenha certeza que digitou o endereço corretamente e tente novamente.
      </h3>

      <div className="flex justify-center">
        <Image
          className="justify-center"
          src={not_found}
          alt="404"
          width={700}
          height={700}
          priority
        />
      </div>
    </div>
  );
};

export default Notfound;
