"use client";
import { useProducts } from "@/app/services/product/queries";
import SearchBar from "@/components/search/SearchBar";
import { ProductProps, SearchParamsProps } from "@/types/index.d";
import Image from "next/image";
import Link from "next/link";
import React, { use } from "react";

function Browse(props: SearchParamsProps) {
  const searchParams = use(props.searchParams);
  const products = useProducts({ searchQuery: searchParams.query });

  return (
    <div className="bg-dark-100 min-h-screen">
      <div className="flex max-w-[1400px] mx-auto px-4 sm:px-6 gap-6 pt-24 pb-12">
        <aside className="w-56 shrink-0 hidden lg:block">
          <div className="bg-dark-300 rounded-lg p-4 mb-4">
            <h3 className="text-text-high font-medium text-sm mb-3 uppercase tracking-wider">
              Buscar
            </h3>
            <SearchBar route="/browse" />
          </div>

          <div className="bg-dark-300 rounded-lg p-4 mb-4">
            <h3 className="text-text-high font-medium text-sm mb-3 uppercase tracking-wider">
              Categoria
            </h3>
            <div className="space-y-1">
              {["Todos", "Ação", "Aventura", "Estratégia", "RPG", "Simulação"].map((cat) => (
                <p
                  key={cat}
                  className="text-text-body text-sm hover:text-text-high py-1 cursor-pointer transition-colors"
                >
                  {cat}
                </p>
              ))}
            </div>
          </div>

          <div className="bg-dark-300 rounded-lg p-4 mb-4">
            <h3 className="text-text-high font-medium text-sm mb-3 uppercase tracking-wider">
              Preço
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Mín"
                  className="w-full bg-dark-400 border border-dark-500 rounded text-sm px-3 py-1.5 text-text-high placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <span className="text-text-muted text-xs">—</span>
                <input
                  type="text"
                  placeholder="Máx"
                  className="w-full bg-dark-400 border border-dark-500 rounded text-sm px-3 py-1.5 text-text-high placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <button className="w-full bg-accent hover:bg-accent-hover text-white rounded-md px-4 py-2 text-sm font-medium transition-colors">
                Aplicar
              </button>
              <button className="w-full text-text-muted hover:text-text-high text-sm transition-colors">
                Limpar
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center mb-6">
            <h1 className="text-text-high text-2xl font-bold font-spaceGrotesk">
              Navegar
            </h1>
            {products?.data?.products && (
              <span className="text-text-muted text-sm ml-2">
                ({products.data.products.length} resultados)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-text-body hover:text-text-high transition-colors">
              Descobrir
            </Link>
            <span className="text-text-muted">/</span>
            <span className="text-accent font-medium">Navegar</span>
          </div>

          {products?.data?.products && products.data.products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.data.products.map((product: ProductProps) => (
                <div key={product._id}>
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="bg-dark-300 border border-dark-400 rounded-lg overflow-hidden transition-all duration-300 hover:border-accent/50 hover:translate-y-[-2px] hover:shadow-lg group">
                      <div className="relative aspect-[16/9]">
                        <Image
                          className="object-cover transition-all duration-300 group-hover:brightness-50"
                          src={product.productImage}
                          fill
                          priority
                          alt=""
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-text-high text-sm font-medium truncate">
                          {product.name}
                        </p>
                        {product.price === "0" ? (
                          <p className="text-text-high font-bold mt-1">Gratuito</p>
                        ) : (
                          <p className="text-text-high font-bold mt-1">
                            {parseFloat(product.price).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-text-muted text-center py-20">
              Nenhum jogo encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Browse;
