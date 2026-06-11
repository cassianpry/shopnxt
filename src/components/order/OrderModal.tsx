import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { OrderModalProps, ProductProps } from "@/types/index.d";
import { useOrder } from "@/app/services/orders/queries";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";

const OrderModal = ({ isOpen, setIsOpen, orderId }: OrderModalProps) => {
  const order = useOrder(orderId);

  if (order.isLoading) {
    return (
      <section>
        <h1 className="text-text-high text-2xl font-bold font-spaceGrotesk mb-6"></h1>
        <div className="my-12 pt-5 flex flex-wrap gap-5 items-center space-x-4">
          <div className="flex flex-col space-y-2 justify-center items-center gap-3">
            <Skeleton className="h-4 w-[350px] bg-dark-400" />
            <Skeleton className="h-4 w-[350px] bg-dark-400" />
            <Skeleton className="h-4 w-[350px] bg-dark-400" />
            <Skeleton className="h-4 w-[350px] bg-dark-400" />
            <Skeleton className="h-4 w-[350px] bg-dark-400" />
          </div>
        </div>
      </section>
    );
  }

  console.log("OrderModal==>", order.data);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex flex-col items-start sm:max-w-[725px] bg-dark-300 text-text-body">
        <DialogHeader>
          <DialogTitle className="text-text-high">
            Nº da Venda:&nbsp;
            <span className="text-accent">{order?.data?.orderNum}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex justify-start gap-4 w-full">
            <div className="">
              <Label className="text-right">Nome:</Label>
              <Input
                disabled={true}
                defaultValue={order?.data?.name}
                className="w-52"
              />
            </div>
            <div>
              <Label className="text-right">E-mail:</Label>
              <Input
                disabled={true}
                defaultValue={order?.data?.email}
                className=""
              />
            </div>
            <div>
              <Label className="text-right">Contato:</Label>
              <Input
                disabled={true}
                defaultValue={order?.data?.phone}
                className=""
              />
            </div>
          </div>
          <div className="flex justify-start gap-4">
            <div className="w-full">
              <Label htmlFor="name" className="text-right ">
                Endereço:
              </Label>
              <Input
                disabled={true}
                defaultValue={order?.data?.address}
                className="capitalize grow"
              />
            </div>
            <div>
              <Label className="text-right">CEP:</Label>
              <Input
                disabled={true}
                defaultValue={order?.data?.postalCode}
                className=""
              />
            </div>
            <div>
              <Label className="text-right ">Estado:</Label>
              <Input
                disabled={true}
                defaultValue={order?.data?.state}
                className=" uppercase"
              />
            </div>
            <div>
              <Label className="text-right ">Cidade:</Label>
              <Input
                disabled={true}
                defaultValue={order?.data?.city}
                className=" capitalize"
              />
            </div>
          </div>
          <Accordion type="single" collapsible className="no-focus">
            <AccordionItem value="item-1">
              <AccordionTrigger>Dados do pedido</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col border rounded-md">
                  <div className="flex gap-4 m-3">
                    <div className="w-full">
                      <Label className="text-right ">
                        Endereço de entrega:
                      </Label>
                      <Input
                        disabled={true}
                        defaultValue={order?.data?.billingAddress}
                        className="grow capitalize"
                      />
                    </div>
                    <div>
                      <Label className="text-right ">CEP:</Label>
                      <Input
                        disabled={true}
                        defaultValue={order?.data?.billingPostalCode}
                        className="capitalize"
                      />
                    </div>
                  </div>
                  <div className="flex gap-6 m-3">
                    <div>
                      <Label className="text-right ">Estado:</Label>
                      <Input
                        disabled={true}
                        defaultValue={order?.data?.billingState}
                        className="w-11 uppercase"
                      />
                    </div>
                    <div className="">
                      <Label className="text-right ">Cidade:</Label>
                      <Input
                        disabled={true}
                        defaultValue={order?.data?.billingCity}
                        className="max-w-52 capitalize"
                      />
                    </div>
                  </div>
                </div>
          <Separator
            orientation="horizontal"
            className="bg-dark-400 mt-5"
          />
              </AccordionContent>
              {order?.data?.cartProducts?.map((product: ProductProps) => (
                <AccordionContent key={product._id} className="flex">
                  <div className="flex flex-col justify-start">
                    <span className="font-semibold">{product.name}</span>
                    <span>
                      {parseFloat(product.price).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                </AccordionContent>
              ))}
            </AccordionItem>
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
