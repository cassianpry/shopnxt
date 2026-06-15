import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    orderNum: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    phone: { type: String, required: true },
    billingAddress: { type: String, required: true },
    billingPostalCode: { type: String, required: true },
    billingState: { type: String, required: true },
    billingCity: { type: String, required: true },
    cartProducts: { type: Object, required: true },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

OrderSchema.pre("save", function () {
  if (!this.orderNum) {
    const date = new Date();
    const dateString = `${date.getDate()}${
      date.getMonth() + 1
    }${date.getFullYear()}`;
    const randomNumber = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0");
    this.orderNum = `${dateString}${randomNumber}`;
  }
});

OrderSchema.index({ email: 1 });
OrderSchema.index({ status: 1 });

const Order = models?.Order || model("Order", OrderSchema);

export default Order;
