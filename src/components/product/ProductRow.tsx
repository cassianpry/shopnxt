"use client";
import React from "react";
import { TableCell, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { toast } from "../ui/use-toast";
import { ProductProps } from "@/types/index.d";

interface ProductRowProps {
  product: ProductProps;
  isLoading: boolean;
  isFetching: boolean;
}

function ProductRow({ product, isLoading, isFetching }: ProductRowProps) {
  const renderTableCell = (className: string, content: React.ReactNode) => (
    <TableCell className={`${className}`}>
      {isFetching ? <Skeleton className="h-3 w-auto bg-dark-500" /> : content}
    </TableCell>
  );
  return (
    <TableRow
      key={product._id}
      className="hover:bg-dark-400 truncate"
    >
      {renderTableCell(
        "capitalize whitespace-nowrap overflow-hidden text-ellipsis max-w-52",
        product.name
      )}
      {renderTableCell(
        "whitespace-nowrap overflow-hidden text-ellipsis max-w-52 max-xl:hidden",
        product.shortDescription
      )}
      <TableCell className="capitalize whitespace-nowrap overflow-hidden text-ellipsis max-w-52 max-xl:hidden">
        {product?.genres?.map((g: any) => (
          <span key={g._id}>{g.name}&nbsp;</span>
        ))}
      </TableCell>
      {renderTableCell("capitalize", product.developer)}
      {renderTableCell("capitalize", product.publisher)}
      {renderTableCell(
        "",
        product.price !== "0"
          ? Number(product.price).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          : "Gratuito"
      )}

      <TableCell className="capitalize">
        {isLoading || isFetching ? (
          <Skeleton className="h-3 w-auto bg-dark-500" />
        ) : (
          <span
            className={`${
              product.active === true ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.active === true ? "Ativo" : "Inativo"}
          </span>
        )}
      </TableCell>
      <TableCell className=" flex text-right justify-center gap-2">
        {isLoading || isFetching ? (
          <Skeleton className="h-5 w-5 bg-dark-500" />
        ) : (
          <Link
            href={{
              pathname: "/dashboard/products/edit/",
              query: { id: product._id },
            }}
          >
            <div className="p-0.5 rounded-full hover:bg-slate-400 cursor-pointer">
              <MdEdit className="w-5 h-5 text-yellow-500" />
            </div>
          </Link>
        )}
        {isLoading || isFetching ? (
          <Skeleton className="h-5 w-5 bg-dark-500" />
        ) : (
          <div className="p-0.5 rounded-full hover:bg-slate-400 justify-center cursor-pointer">
            <MdDeleteForever
              className="w-5 h-5 text-red-500"
              onClick={() =>
                toast({
                  className: "bg-green-600 text-light-800",
                  duration: 1500,
                  variant: "destructive",
                  title: "Excluir produto.",
                  description: "produto excluído",
                })
              }
            />
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}

export default ProductRow;
