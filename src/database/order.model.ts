import { Schema, model, models } from "mongoose";

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderNum: { type: String, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
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
    items: [OrderItemSchema],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "fulfilled", "cancelled", "refunded"],
      default: "pending",
    },
    paymentMethod: { type: String },
    transactionId: { type: String },
    paidAt: { type: Date },
    coupon: { type: Schema.Types.ObjectId, ref: "Coupon" },
    discountAmount: { type: Number, default: 0 },
    notes: { type: String },
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
OrderSchema.index({ user: 1, createdAt: -1 });

const Order = models?.Order || model("Order", OrderSchema);
export default Order;
