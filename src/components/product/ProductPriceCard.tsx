"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UseQueryResult } from "@tanstack/react-query";
import { ProductProps } from "@/types/index.d";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";

export function ProductPriceCard({
  products,
  title,
}: {
  products: ProductProps[];
  title: string;
}) {
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const screenSize = windowSize > 1024;

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.addEventListener("resize", handleResize);
    };
  }, []);

  const settings = {
    infinite: false,
    speed: 200,
    slidesToShow: screenSize ? 6 : 3,
    slidesToScroll: screenSize ? 6 : 3,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="w-3/4 m-auto">
      <div className="mt-20">
        <h1 className="text-dark400_light900 font-semibold mb-2 pl-2">
          {title}
        </h1>
        <Slider {...settings}>
          {products.map((product: ProductProps) => (
            <Link
              href={`/products/${product.slug}`}
              key={product._id}
              className="flex pr-2"
            >
              <div className="background-light800_dark300 text-dark400_light900">
                <div
                  className="flex relative h-48 w-36 lg:h-72 lg:w-44 justify-center items-center hover:brightness-50"
                  //style={{ aspectRatio: 70 / 45 }}
                >
                  <Image
                    className="rounded-md"
                    src={product.productImage}
                    priority
                    fill
                    sizes="(max-width:176px)"
                    quality={100}
                    alt=""
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="text-sm font-normal ">
                  <p className="overflow-hidden break-words max-w-48">
                    {product.name}
                  </p>

                  <p>
                    {parseFloat(product.price).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </Slider>
      </div>
    </div>
  );
}

function NextArrow(props: { onClick?: any }) {
  const { onClick } = props;
  return (
    <div className="block text-xl text-center rounded-full p-1 transition duration-300 ease-in-out bg-gray-300 cursor-pointer absolute -top-5 transform -translate-y-1/2 right-2">
      <BsChevronCompactRight
        className="cursor-pointer"
        size={11}
        onClick={onClick}
      />
    </div>
  );
}

function PrevArrow(props: { onClick?: any }) {
  const { onClick } = props;
  return (
    <div className="block text-xl text-center rounded-full p-1 transition duration-300 ease-in-out bg-gray-300 cursor-pointer absolute -top-5 transform -translate-y-1/2 right-7">
      <BsChevronCompactLeft
        className="cursor-pointer"
        size={11}
        onClick={onClick}
      />
    </div>
  );
}
