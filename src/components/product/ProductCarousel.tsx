"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { Skeleton } from "../ui/skeleton";
import { useCreateWishList } from "@/app/services/wishlist/mutation";
import LoadingProductCarousel from "../loadings/LoadingProductCarousel";

interface ProductCarouselProps {
  userId?: string;
  products: ProductProps;
  wishList?: ProductProps[];
  isLoading?: boolean;
  isWishListed: string[];
  setIsWishListed: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  userId,
  products,
  wishList,
  isLoading,
  isWishListed,
  setIsWishListed,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const query = useQueryClient();

  const nextSlide = useCallback(() => {
    setCurrentIndex((currentIndex) =>
      currentIndex === products.length! - 1 ? 0 : currentIndex + 1
    );

    sliderRef.current!.classList.add("fade-anim");
  }, [products.length]);

  const prevSlide = () => {
    setCurrentIndex((currentIndex) =>
      currentIndex === 0 ? products.length! - 1 : currentIndex - 1
    );
    sliderRef.current!.classList.add("fade-anim");
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
    sliderRef.current!.classList.add("fade-anim");
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleAnimationEnd = () => {
    sliderRef.current!.classList.remove("fade-anim");
  };

  useEffect(() => {
    let slideInterval: number;
    if (!isHovered) {
      slideInterval = window.setInterval(nextSlide, 8000);
    }
    // const slideInterval = setInterval(nextSlide, 8000);

    const currentSliderRef = sliderRef.current;
    currentSliderRef?.addEventListener("animationend", handleAnimationEnd);

    return () => {
      clearInterval(slideInterval);
      currentSliderRef?.removeEventListener("animationend", handleAnimationEnd);
    };
  }, [wishList, products, currentIndex, nextSlide, setIsWishListed, isHovered]);

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

  return (
    <>
      {isLoading ? (
        <LoadingProductCarousel />
      ) : (
        <div
          className="max-w-[1100px] m-auto pt-5 relative text-dark400_light900 group"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={sliderRef}
            className="h-[200px] xl:h-[600px] lg:h-[450px] md:h-[350px]"
          >
            <Link href={`/products/${products[currentIndex].slug}`}>
              <Image
                className="rounded-2xl h-full w-[1100px] brightness-50"
                src={products[currentIndex].productImage}
                width={1000}
                height={600}
                alt=""
                priority
              />
            </Link>
            <div
              ref={sliderRef}
              className="absolute left-0 right-0 bottom-[5%] w-[40%] ml-10 -translate-y-10"
            >
              <div className="flex w-[55%] rounded-lg">
                <span className="text-light-900 m-1">
                  {products[currentIndex].shortDescription}
                </span>
              </div>
              <div className="flex justify-start items-center mt-3 gap-2">
                <Button
                  asChild
                  className="focus:shadow-outline flex items-center justify-center rounded-md font-semibold text-xs tracking-wide text-light-900  bg-blue-900 hover:bg-blue-600 transition-all duration-300 ease-in-out uppercase"
                >
                  <Link href={`/products/${products[currentIndex].slug}`}>
                    Compre já
                  </Link>
                </Button>

                {isWishListed.includes(products[currentIndex].slug!) ? (
                  <Link
                    href={{
                      pathname: `/profile/${userId}/wishlist`,
                      query: { id: userId },
                    }}
                  >
                    <Button className="items-center justify-center body-medium tracking-wide text-light-900 hover:text-sm transition-all duration-300 ease-in-out hover:bg-gray-600">
                      <IoMdCheckmarkCircleOutline className="h-5 w-5" />
                      <span className="uppercase">
                        &nbsp;Na lista de desejos
                      </span>
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="items-center justify-center body-medium tracking-wide text-light-900 hover:text-sm transition-all duration-300 ease-in-out hover:bg-gray-600"
                    onClick={() =>
                      addToWishList(
                        userId!,
                        products[currentIndex]._id!,
                        products[currentIndex].slug!
                      )
                    }
                  >
                    <IoMdAddCircleOutline className="w-5 h-5" />
                    &nbsp; Lista de desejos
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Left Arrow */}
          <div
            className={`hidden group-hover:block absolute top-1/2 transform -translate-y-1/2 left-1 text-xl text-center text-dark-400 rounded-full p-1 transition duration-300 ease-in-out bg-slate-100 cursor-pointer ${
              isHovered ? "opacity-35" : "opacity-0"
            }`}
          >
            <BsChevronCompactLeft
              className="cursor-pointer"
              size={15}
              onClick={prevSlide}
            />
          </div>

          {/* Right Arrow */}
          <div
            className={`hidden group-hover:block absolute top-1/2 transform -translate-y-1/2 right-1 text-xl text-center text-dark-400 rounded-full p-1 transition duration-300 ease-in-out bg-slate-100 cursor-pointer ${
              isHovered ? "opacity-35" : "opacity-0"
            }`}
          >
            <BsChevronCompactRight
              className="cursor-pointer"
              size={15}
              onClick={nextSlide}
            />
          </div>
          <div className="flex top-4 justify-center py-2">
            {products.map((slide: any, slideIndex: number) => (
              <div
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className="flex text-2xl cursor-pointer justify-center mx-1"
              >
                <Image
                  className={`${
                    currentIndex === slideIndex ? "opacity-100" : "opacity-50"
                  }`}
                  src={slide.productImage}
                  width={70}
                  height={60}
                  alt={slide.name}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
