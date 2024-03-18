"use client";
import ProductForm from "@/components/form/ProductForm";
import { Separator } from "@/components/ui/separator";
import React from "react";

function EditProduct() {
  return (
    <div>
      <h1 className="h1-bold mt-20 text-dark100_light900">
        Alteração do produto
      </h1>
      <Separator orientation="horizontal" className="bg-light-400" />

      <div className="flex justify-start gap-3 mt-5">
        <ProductForm />
      </div>
    </div>
  );
}

export default EditProduct;
