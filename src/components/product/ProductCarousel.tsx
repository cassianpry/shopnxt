"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import {
  IoMdAddCircleOutline,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import { ProductProps } from "@/types/index.d";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateWishList } from "@/app/services/wishlist/mutation";
import LoadingProductCarousel from "../loadings/LoadingProductCarousel";
import ThumbnailItem from "./ThumbnailItem";

interface ProductCarouselProps {
  userId?: string;
  products: ProductProps[];
  wishList?: ProductProps[];
  isLoading?: boolean;
  isWishListed: string[];
  setIsWishListed: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  userId,
  products,
  isLoading,
  isWishListed,
  setIsWishListed,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const query = useQueryClient();

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === products.length! - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? products.length! - 1 : prev - 1
    );
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    if (isHovered) return;

    const duration = 5000;
    const startTime = Date.now();

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
    }, 50);

    const slideTimeout = window.setTimeout(() => {
      setCurrentIndex((prev) => (prev === products.length! - 1 ? 0 : prev + 1));
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(slideTimeout);
    };
  }, [currentIndex, isHovered, products.length]);

  const addWishList = useCreateWishList();

  const addToWishList = async (user: string, product: string, slug: string) => {
    try {
      addWishList.mutate({ user, product });
      setIsWishListed([...isWishListed, slug]);
      await query.invalidateQueries({ queryKey: ["wishlists"] });
    } catch (error) {
      console.log(error);
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <>
      {isLoading ? (
        <LoadingProductCarousel />
      ) : (
        <div
          className="flex gap-0 max-w-[1400px] mx-auto relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden group"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Left panel: main banner */}
          <div className="flex-1 relative overflow-hidden">
            <Link href={`/products/${products[currentIndex].slug}`}>
              <Image
                className="h-full w-full object-cover brightness-[0.6] transition-all duration-500"
                src={products[currentIndex].productImage}
                width={1000}
                height={562}
                alt={products[currentIndex].name}
                priority
              />
            </Link>
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-dark-900/80 to-transparent">
              <h2 className="text-text-high text-2xl sm:text-3xl lg:text-4xl font-bold font-spaceGrotesk mb-2">
                {products[currentIndex].name}
              </h2>
              <p className="text-text-body text-sm sm:text-base max-w-xl mb-4 line-clamp-2">
                {products[currentIndex].shortDescription}
              </p>
              <div className="flex gap-3">
                <Button asChild className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-md px-6 py-2 text-sm transition-colors">
                  <Link href={`/products/${products[currentIndex].slug}`}>Compre já</Link>
                </Button>
                {isWishListed.includes(products[currentIndex].slug!) ? (
                  <Link
                    href={{
                      pathname: `/profile/${userId}/wishlist`,
                      query: { id: userId },
                    }}
                  >
                    <Button className="border border-dark-500 text-text-body hover:text-text-high rounded-md px-4 py-2 text-sm transition-colors">
                      <IoMdCheckmarkCircleOutline className="w-4 h-4 mr-1" />
                      Na lista
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="border border-dark-500 text-text-body hover:text-text-high rounded-md px-4 py-2 text-sm transition-colors"
                    onClick={() =>
                      addToWishList(
                        userId!,
                        products[currentIndex]._id!,
                        products[currentIndex].slug!
                      )
                    }
                  >
                    <IoMdAddCircleOutline className="w-4 h-4 mr-1" />
                    Lista de desejos
                  </Button>
                )}
              </div>
            </div>
            {/* Prev/Next arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark-400/60 hover:bg-dark-400 flex items-center justify-center text-text-high opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <BsChevronCompactLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark-400/60 hover:bg-dark-400 flex items-center justify-center text-text-high opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <BsChevronCompactRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right panel: vertical thumbnail strip */}
          <div className="hidden lg:block w-[200px] shrink-0 bg-dark-300 overflow-y-auto">
            <div className="flex flex-col">
              {products.map((product: ProductProps, index: number) => (
                <ThumbnailItem
                  key={product._id}
                  product={product}
                  isActive={index === currentIndex}
                  progress={progress}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
          {/* Mobile dots */}
          <div className="flex lg:hidden justify-center gap-2 mt-4">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-accent" : "bg-dark-500"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};
