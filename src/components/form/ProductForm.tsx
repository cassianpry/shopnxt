"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ProductFormSchema } from "@/lib/actions/validations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MdAutorenew, MdSave } from "react-icons/md";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "../ui/textarea";
import { MultiSelect } from "../ui/multi-select";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Editor } from "@tinymce/tinymce-react";
import {
  useCreateProduct,
  useUpdateProduct,
} from "@/app/services/product/mutations";

import { useGenres } from "@/app/services/genres/queries";
import { useProduct } from "@/app/services/product/queries";
import { useTheme } from "@/context/ThemeProvider";
import { Checkbox } from "../ui/checkbox";

const ProductForm = () => {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const id: string | "" = searchParams.get("id") || "";
  const createNewProduct = useCreateProduct();
  const updateExistingProduct = useUpdateProduct();
  const query: string | "" = searchParams.get("query") || "";
  const genres = useGenres({ searchQuery: query });
  const product = useProduct(id);
  const editorRef = useRef(null);
  const { mode } = useTheme();

  const [uploading, setUploading] = useState(false);

  const [productImage, setProductImage] = useState<string | ArrayBuffer | null>(
    null
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      about: "",
      productImage: "",
      genres: [],
      developer: "",
      publisher: "",
      system: "",
      processor: "",
      memory: "",
      storage: "",
      graphicCard: "",
      price: "",
      active: true,
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
    try {
      //Update Product

      if (product.data._id) {
        const image = await uploadImage();
        if (image !== false && image !== 500) {
          values.productImage = image.secure_url;
        }
        //@ts-ignore
        updateExistingProduct.mutate({ ...values });
      } else {
        //   //New product
        const image = await uploadImage();
        if (image !== false && image !== 500) {
          values.productImage = image.secure_url;
          //@ts-ignore
          createNewProduct.mutate(values);
        } else {
          return null;
        }
      }
    } catch (error) {
      toast({
        className: "bg-red-600 text-light-800",
        title: "Entre em contato com o suporte",
        description: error + " informe esse erro ao suporte",
      });
    }
  };

  const uploadImage = async () => {
    setUploading(true);
    try {
      if (!productImage) {
        return false;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product/upload`,
        {
          method: "POST",
          body: JSON.stringify({ image: productImage }),
        }
      );
      const res = await response.json();
      if (response.ok === false) {
        toast({
          className: "bg-yellow-600 text-light-800",
          title: "Erro ao hospedar a imagem",
          description: `Tipo de imagem invalido!! Apenas imagens são aceitas. ${res}`,
          duration: 5000,
        });
        setUploading(false);
        return response.status;
      } else {
        toast({
          className: "bg-green-600 text-light-800",
          title: "Transferência de Imagem",
          description: "Imagem hospedada com sucesso",
        });
        setUploading(false);
        return res;
      }
    } catch (error) {
      setUploading(false);
      console.log(error);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProductImage(reader.result);
      };
    }
    setImagePreview(URL.createObjectURL(e.target.files![0]));
  };

  useEffect(() => {
    if (!product.isLoading && product) {
      form.reset({
        _id: product.data._id,
        name: product.data.name || "",
        productImage: product.data.productImage || "",
        description: product.data.description || "",
        shortDescription: product.data.shortDescription || "",
        about: product.data.about || "",
        genres: [],
        developer: product.data.developer || "",
        publisher: product.data.publisher || "",
        system: product.data.system || "",
        processor: product.data.processor || "",
        memory: product.data.memory || "",
        storage: product.data.storage || "",
        graphicCard: product.data.graphicCard || "",
        price: product.data.price || "",
        active: product.data.active || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.isLoading, form.reset]);

  console.log("FORM ERROR=>", form.formState.errors);

  return (
    <div className="w-full mx-auto max-w-7xl container">
      <p className="my-5 text-red-600">
        *
        <span className="text-slate-800 dark:text-slate-300">
          &nbsp;todos os campos são obrigatórios
        </span>
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pt-2 text-dark400_light700  w-[50%]"
        >
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt={imagePreview}
              width={300}
              height={300}
            />
          ) : product.data?.productImage ? (
            <Image
              src={product.data?.productImage}
              alt={product.data?.productImage}
              width={300}
              height={300}
            />
          ) : (
            ""
          )}
          {/* Image */}
          <FormField
            control={form.control}
            name="productImage"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="text-md font-medium">
                  <span className="text-red-600">*</span>&nbsp;Imagem
                </FormLabel>
                <FormMessage className="text-red-600" />
                <FormControl>
                  <Input
                    className="background-light800_dark300"
                    type="file"
                    disabled={
                      createNewProduct.isPending ||
                      updateExistingProduct.isPending ||
                      uploading
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    onChange={(e) => {
                      field.onChange(e.target.files);
                      handleImageChange(e);
                    }}
                  />
                </FormControl>
                <FormDescription className="text-slate-600 dark:text-slate-400"></FormDescription>
              </FormItem>
            )}
          />

          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="text-md font-medium">
                  <span className="text-red-600">*</span>&nbsp;Nome
                </FormLabel>
                <FormMessage className="text-red-600" />
                <FormControl>
                  <Input
                    className="background-light800_dark300"
                    type="text"
                    placeholder="Nome do produto. ex: Street Fighter II"
                    disabled={
                      createNewProduct.isPending ||
                      updateExistingProduct.isPending ||
                      uploading
                    }
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-slate-600 dark:text-slate-400">
                  Entre 3 a 50 caracteres.
                </FormDescription>
              </FormItem>
            )}
          />

          {/* Short Description */}
          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-medium">
                  <span className="text-red-600">*</span>&nbsp; Breve descrição
                </FormLabel>
                <FormMessage className="text-red-600" />
                <FormControl>
                  <Input
                    className="background-light800_dark300"
                    disabled={
                      createNewProduct.isPending ||
                      updateExistingProduct.isPending ||
                      uploading
                    }
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-slate-600 dark:text-slate-400">
                  Uma breve descrição do jogo..
                </FormDescription>
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-medium">
                  <span className="text-red-600">*</span>&nbsp;Descrição
                </FormLabel>
                <FormMessage className="text-red-600" />
                <FormControl>
                  <Textarea
                    className="no-focus paragraph-regular background-light800_dark300 light-border-2 min-h-[200px] border"
                    {...field}
                    disabled={
                      createNewProduct.isPending ||
                      updateExistingProduct.isPending ||
                      uploading
                    }
                  />
                </FormControl>
                <FormDescription className="text-slate-600 dark:text-slate-400">
                  Descrição completa do jogo..
                </FormDescription>
              </FormItem>
            )}
          />
          {/* About */}
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  <span className="text-red-600">*</span>&nbsp;Sobre o jogo
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) =>
                      //@ts-ignore
                      (editorRef.current = editor)
                    }
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    initialValue={"" || product.data?.about}
                    init={{
                      height: 350,
                      language: "pt_BR",
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      menubar: "edit view insert format tools table",
                      toolbar:
                        "undo redo | blocks | codesample " +
                        "bold italic forecolor image | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist",
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>
                <FormDescription className="text-slate-600 dark:text-slate-400">
                  Inclua tudo relacionado ao jogo (história, enredo, premiações,
                  etc...)
                </FormDescription>
                <FormMessage className="text-red-600 italic" />
              </FormItem>
            )}
          />

          {/* Genre */}

          <FormField
            control={form.control}
            name="genres"
            render={({ field: { ...field } }) => (
              <FormItem>
                <FormLabel className="text-md font-medium">
                  <span className="text-red-600">*</span>
                  &nbsp;Gênero&nbsp;-&nbsp;
                  {product.data ? (
                    <span className="text-slate-300">
                      Atuais:&nbsp;
                      {product.data?.genres?.map(
                        (genre: { _id: React.Key; name: string }) => (
                          <span key={genre._id}>{genre.name + " "}</span>
                        )
                      )}
                    </span>
                  ) : (
                    ""
                  )}
                </FormLabel>
                <MultiSelect
                  className="background-light800_dark300 text-dark400_light700"
                  placeholder={"Selecione o(s) gênero(s)..."}
                  //@ts-ignore
                  selected={field.value}
                  //@ts-ignore
                  options={genres.data?.genre || []}
                  {...field}
                />

                <FormMessage className="text-red-600" />

                <FormDescription className="text-slate-600 dark:text-slate-400">
                  Selecione o gênero do jogo.
                </FormDescription>
              </FormItem>
            )}
          />

          {/* Developer */}
          <div className="flex items-center gap-4">
            <FormField
              control={form.control}
              name="developer"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormLabel className="text-md font-medium">
                    <span className="text-red-600">*</span>&nbsp;Desenvolvedor
                  </FormLabel>
                  <FormMessage className="text-red-600" />
                  <FormControl>
                    <Input
                      className="background-light800_dark300"
                      placeholder="Capcom"
                      type="text"
                      disabled={
                        createNewProduct.isPending ||
                        updateExistingProduct.isPending ||
                        uploading
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-600 dark:text-slate-400"></FormDescription>
                </FormItem>
              )}
            />
            {/* Publisher */}
            <FormField
              control={form.control}
              name="publisher"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormLabel className="text-md font-medium">
                    <span className="text-red-600">*</span>&nbsp;Editora
                  </FormLabel>
                  <FormMessage className="text-red-600" />
                  <FormControl>
                    <Input
                      className="background-light800_dark300"
                      placeholder="Capcom"
                      type="text"
                      disabled={
                        createNewProduct.isPending ||
                        updateExistingProduct.isPending ||
                        uploading
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-600 dark:text-slate-400"></FormDescription>
                </FormItem>
              )}
            />
          </div>
          {/* System */}
          <div className="flex max-xl:flex-col md:items-start gap-4">
            <FormField
              control={form.control}
              name="system"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormLabel className="text-md font-medium">
                    <span className="text-red-600">*</span>&nbsp;Sistema
                    Operacional
                  </FormLabel>
                  <FormMessage className="text-red-600" />
                  <FormControl>
                    <Input
                      className="max-xl:w-[480px] background-light800_dark300"
                      placeholder="Windows Linux MacOS"
                      type="text"
                      disabled={
                        createNewProduct.isPending ||
                        updateExistingProduct.isPending ||
                        uploading
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-600 dark:text-slate-400"></FormDescription>
                </FormItem>
              )}
            />
            {/* Processor */}
            <FormField
              control={form.control}
              name="processor"
              render={({ field }) => (
                <FormItem className="grow">
                  <FormLabel className="text-md font-medium">
                    <span className="text-red-600">*</span>&nbsp;Processador
                  </FormLabel>
                  <FormMessage className="text-red-600" />
                  <FormControl>
                    <Input
                      className="max-xl:w-[480px] background-light800_dark300"
                      placeholder="Intel/AMD"
                      type="text"
                      disabled={
                        createNewProduct.isPending ||
                        updateExistingProduct.isPending ||
                        uploading
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-600 dark:text-slate-400"></FormDescription>
                </FormItem>
              )}
            />
          </div>
          {/* Memory */}
          <div className="flex max-xl:flex-col">
            <div className="flex flex-row">
              <FormField
                control={form.control}
                name="memory"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-md font-medium">
                      <span className="text-red-600">*</span>&nbsp;Memória
                    </FormLabel>
                    <FormMessage className="text-red-600" />
                    <div className="flex items-center">
                      <FormControl>
                        <Input
                          className="w-[25%] background-light800_dark300"
                          placeholder="16"
                          type="text"
                          disabled={
                            createNewProduct.isPending ||
                            updateExistingProduct.isPending ||
                            uploading
                          }
                          {...field}
                        />
                      </FormControl>
                      <span>&nbsp;GB</span>
                    </div>
                    <FormDescription className="text-slate-600 dark:text-slate-400"></FormDescription>
                  </FormItem>
                )}
              />
              {/* Storage */}
              <FormField
                control={form.control}
                name="storage"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormLabel className="text-md font-medium">
                      <span className="text-red-600">*</span>
                      &nbsp;Armazenamento
                    </FormLabel>
                    <FormMessage className="text-red-600" />
                    <div className="flex items-center">
                      <FormControl>
                        <Input
                          className="w-[30%] background-light800_dark300"
                          placeholder="240"
                          type="text"
                          disabled={
                            createNewProduct.isPending ||
                            updateExistingProduct.isPending ||
                            uploading
                          }
                          {...field}
                        />
                      </FormControl>
                      <span>&nbsp;GB</span>
                    </div>
                    <FormDescription className="text-slate-600 dark:text-slate-400"></FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex gap-5">
            {/* Graphics */}
            <FormField
              control={form.control}
              name="graphicCard"
              render={({ field }) => (
                <FormItem className="grow max-xl:mt-5">
                  <FormLabel className="text-md font-medium">
                    <span className="text-red-600">*</span>&nbsp;Placa Gráfica
                  </FormLabel>
                  <FormMessage className="text-red-600" />
                  <FormControl>
                    <Input
                      className="background-light800_dark300"
                      placeholder="Nvidia GeForce GTX 960 / AMD Radeon 580RX"
                      type="text"
                      disabled={
                        createNewProduct.isPending ||
                        updateExistingProduct.isPending ||
                        uploading
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-600 dark:text-slate-400"></FormDescription>
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="max-xl:mt-5">
                  <FormLabel className="text-md font-medium">
                    <span className="text-red-600">*</span>&nbsp;Preço
                  </FormLabel>
                  <FormMessage className="text-red-600" />
                  <FormControl>
                    <Input
                      className="background-light800_dark300 w-20"
                      placeholder="R$ 200,00"
                      type="text"
                      disabled={
                        createNewProduct.isPending ||
                        updateExistingProduct.isPending ||
                        uploading
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-600 dark:text-slate-400"></FormDescription>
                </FormItem>
              )}
            />

            {/* Staus */}
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Ativo</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={
              createNewProduct.isPending ||
              updateExistingProduct.isPending ||
              uploading
            }
            className="bg-blue-900 text-light-850 text-md p-6 hover:bg-blue-600"
          >
            {createNewProduct.isPending ||
            updateExistingProduct.isPending ||
            uploading ? (
              <>
                <MdAutorenew className="w-5 h-5 mr-2 animate-spin" />
                <p className="animate-pulse">
                  {product?.data?._id
                    ? "Alterando o produto..."
                    : "Cadastrando o produto..."}
                </p>
              </>
            ) : (
              <>
                <MdSave className="w-5 h-5 mr-2" />
                {product?.data?._id ? "Alterar produto" : "Cadastrar produto"}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;
