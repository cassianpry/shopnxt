"use client";
import Image from "next/image";
import { ProductProps } from "@/types/index.d";

function ThumbnailItem({
  product,
  isActive,
  progress,
  onClick,
}: {
  product: ProductProps;
  isActive: boolean;
  progress: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-3 p-3 h-20 border-l-2 transition-colors text-left w-full ${
        isActive
          ? "border-accent bg-dark-400"
          : "border-transparent bg-dark-300 hover:bg-dark-400"
      }`}
    >
      {isActive && (
        <div
          className="absolute bottom-0 left-0 h-[3px] bg-accent transition-none"
          style={{ width: `${progress}%` }}
        />
      )}
      <div className="relative w-10 h-14 shrink-0 rounded overflow-hidden">
        <Image
          src={product.productImage}
          alt={product.name}
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>
      <span className={`text-xs leading-tight line-clamp-2 ${
        isActive ? "text-text-high" : "text-text-body"
      }`}>
        {product.name}
      </span>
    </button>
  );
}

export default ThumbnailItem;
