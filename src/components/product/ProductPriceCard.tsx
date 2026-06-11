"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ProductProps } from "@/types/index.d";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export function ProductPriceCard({
  products,
  title,
}: {
  products: ProductProps[];
  title: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const formatPrice = (value: string) =>
    parseFloat(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="relative group/carousel">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-dark-400/80 text-text-body hover:text-text-high hover:bg-dark-400 opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 -ml-4"
        aria-label="Anterior"
      >
        <MdChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-dark-400/80 text-text-body hover:text-text-high hover:bg-dark-400 opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 -mr-4"
        aria-label="Próximo"
      >
        <MdChevronRight className="w-6 h-6" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product: ProductProps) => (
          <Link
            href={`/products/${product.slug}`}
            key={product._id}
            className="group snap-start shrink-0 w-[180px] sm:w-[200px]"
          >
            <div className="bg-dark-300 border border-dark-400 rounded-lg overflow-hidden transition-all duration-300 hover:border-accent/50 hover:translate-y-[-2px] hover:shadow-lg">
              <div className="relative aspect-[3/4]">
                <Image
                  src={product.productImage}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-300 group-hover:brightness-50"
                  sizes="200px"
                />
              </div>
              <div className="p-3">
                <p className="text-text-high text-sm font-medium truncate">
                  {product.name}
                </p>
                <p className="text-text-high font-bold mt-1">
                  {product.price === "0"
                    ? "Gratuito"
                    : formatPrice(product.price)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
