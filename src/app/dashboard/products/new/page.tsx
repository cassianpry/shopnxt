import ProductForm from "@/components/form/ProductForm";
import { Separator } from "@/components/ui/separator";
import React from "react";

function NewProduct() {
  return (
    <div>
      <h1 className="h1-bold mt-20 text-dark100_light900">
        Cadastro de produtos
      </h1>
      <Separator orientation="horizontal" className="bg-light-400" />
      <div className="flex justify-start gap-3 mt-5">
        <ProductForm />
      </div>
    </div>
  );
}

export default NewProduct;
