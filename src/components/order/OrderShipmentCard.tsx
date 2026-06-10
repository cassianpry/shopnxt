import { OrderProps } from "@/types/index.d";
import React from "react";

function OrderShipmentCard({ order }: { order: OrderProps }) {
  return (
    <>
      <div className="flex flex-col justify-between mt-5 border">
        <p className="font-bold ml-3 mt-3">Endereço de envio</p>
        <p className="ml-3">{order.name}</p>
        <p className="ml-3 capitalize">{order.address}</p>
        <p className="ml-3 capitalize">{order.postalCode}</p>
        <div className="flex justify-start mb-3">
          <span className="ml-3 capitalize">{order.city}</span>
          <p>&nbsp;&nbsp;&nbsp;-</p>
          <span className="ml-3 uppercase">{order.state}</span>
        </div>
      </div>
      <div className="flex flex-col justify-between mt-5 border">
        <p className="font-bold ml-3 mt-3">Endereço de cobrança</p>
        <p className="ml-3">{order.name}</p>
        <p className="ml-3 capitalize">{order.billingAddress}</p>
        <p className="ml-3 capitalize">{order.billingPostalCode}</p>
        <div className="flex justify-start mb-3">
          <span className="ml-3 capitalize">{order.billingCity}</span>
          <p>&nbsp;&nbsp;&nbsp;-</p>
          <span className="ml-3 uppercase">{order.billingState}</span>
        </div>
      </div>
    </>
  );
}

export default OrderShipmentCard;
