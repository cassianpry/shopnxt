"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCreateWishList } from "@/app/services/wishlist/mutation";
import { BsHeart, BsHeartFill } from "react-icons/bs";

interface WishlistHeartButtonProps {
  productId: string;
  slug: string;
  isWishListed: boolean;
  userId?: string;
  onToggle: (slug: string) => void;
}

export function WishlistHeartButton({
  productId,
  slug,
  isWishListed,
  userId,
  onToggle,
}: WishlistHeartButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const addWishList = useCreateWishList();

  const handleClick = () => {
    if (status === "loading") return;

    if (status !== "authenticated" || !userId) {
      router.push("/sign-in");
      return;
    }

    if (isWishListed) {
      router.push(`/profile/${userId}/wishlist`);
      return;
    }

    addWishList.mutate({ user: userId, product: productId });
    onToggle(slug);
  };

  const isLoading = status === "loading";

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`absolute top-2 right-2 z-10 p-1.5 rounded-full bg-dark-400/80 hover:bg-dark-400 transition-all duration-200 opacity-0 group-hover:opacity-100 ${
        isLoading ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      aria-label={
        isWishListed ? "Na lista de desejos" : "Adicionar à lista de desejos"
      }
    >
      {isWishListed ? (
        <BsHeartFill className="w-4 h-4 text-accent" />
      ) : (
        <BsHeart className="w-4 h-4 text-text-body" />
      )}
    </button>
  );
}
