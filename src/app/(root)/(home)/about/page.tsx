/* eslint-disable react/no-unescaped-entities */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MdArrowForward } from "react-icons/md";
import { perks } from "@/constants";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function About() {
  return (
    <>
      <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl text-dark400_light900">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Sua loja com os melhores&nbsp;
          <span className="text-blue-600">jogos digitais</span>.
        </h1>
        <p className="mt-6 text-lg max-w-prose text-muted-foreground">
          Bem-vindo à "BitWorld", sua experiência definitiva em jogos digitais!
          Nossa loja é um paraíso virtual para todos os entusiastas de jogos,
          onde a paixão pela jogabilidade encontra a conveniência da tecnologia
          digital.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link href="/">
            <Button variant="ghost" className="hover:text-blue-600">
              Explorar Jogos&nbsp;&nbsp;
              <MdArrowForward className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
      <section className="bg-blue-950 flex items-center justify-center w-full">
        <MaxWidthWrapper className="py-10 ">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 ">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="text-center md:flex md:items-start md:text-left lg:block lg:text-center hover:bg-blue-900 rounded-md py-5 transition-all duration-300 ease-in-out"
              >
                <div className="md:flex-shrink-0 flex justify-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-900">
                    {<perk.icon className="w-10 h-10 text-light-800" />}
                  </div>
                </div>
                <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                  <h2 className="text-2xl font-medium text-light-900">
                    {perk.title}
                  </h2>
                  <p className="mt-3 text-md text-light-800 ">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
