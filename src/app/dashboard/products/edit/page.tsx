"use client";
import ProductForm from "@/components/form/ProductForm";
import { Separator } from "@/components/ui/separator";
import React from "react";

function EditProduct() {
  return (
    <div>
      <h1 className="text-text-high text-2xl font-bold font-spaceGrotesk mt-20">
        Alteração do produto
      </h1>
      <Separator orientation="horizontal" className="bg-dark-400" />

      <div className="flex justify-start gap-3 mt-5">
        <ProductForm />
      </div>
    </div>
  );
}

export default EditProduct;
