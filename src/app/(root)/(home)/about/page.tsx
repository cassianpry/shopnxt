/* eslint-disable react/no-unescaped-entities */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MdArrowForward } from "react-icons/md";
import { perks } from "@/constants";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function About() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-24 pb-16">
      <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl text-text-high">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Sua loja com os melhores&nbsp;
          <span className="text-accent">jogos digitais</span>.
        </h1>
        <p className="mt-6 text-lg max-w-prose text-text-body">
          Bem-vindo à "BitWorld", sua experiência definitiva em jogos digitais!
          Nossa loja é um paraíso virtual para todos os entusiastas de jogos,
          onde a paixão pela jogabilidade encontra a conveniência da tecnologia
          digital.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link href="/">
            <Button variant="ghost" className="hover:text-accent">
              Explorar Jogos&nbsp;&nbsp;
              <MdArrowForward className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
      <section className="bg-dark-200 flex items-center justify-center w-full rounded-xl">
        <MaxWidthWrapper className="py-10 ">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 ">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="text-center md:flex md:items-start md:text-left lg:block lg:text-center hover:bg-dark-400 rounded-md py-5 transition-all duration-300 ease-in-out"
              >
                <div className="md:flex-shrink-0 flex justify-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-dark-400">
                    {<perk.icon className="w-10 h-10 text-text-body" />}
                  </div>
                </div>
                <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                  <h2 className="text-2xl font-medium text-text-high">
                    {perk.title}
                  </h2>
                  <p className="mt-3 text-md text-text-body ">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
