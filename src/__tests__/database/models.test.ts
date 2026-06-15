import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import crypto from "crypto";
import User from "@/database/user.model";
import { Product } from "@/database/product.model";
import Order from "@/database/order.model";
import Genres from "@/database/genre.model";
import WishList from "@/database/wishlist.model";
import ResetPassword from "@/database/resetpasswd.model";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("User Model", () => {
  it("creates a user with required fields", async () => {
    const user = await User.create({
      name: "Test User",
      email: "test@email.com",
    });
    expect(user.name).toBe("Test User");
    expect(user.email).toBe("test@email.com");
    expect(user.role).toBe("user");
  });

  it("enforces unique email", async () => {
    await User.create({ name: "User1", email: "dup@email.com" });
    await expect(
      User.create({ name: "User2", email: "dup@email.com" })
    ).rejects.toThrow();
  });
});

describe("Product Model", () => {
  it("creates a product with required fields", async () => {
    const product = await Product.create({
      name: "Test Game",
      slug: "test-game",
      productImage: "https://example.com/img.jpg",
      description: "A full description",
      shortDescription: "Short description",
      about: "About this game",
      genres: [],
      developer: "Dev",
      publisher: "Pub",
      system: "Windows",
      processor: "i5",
      memory: "8GB",
      storage: "50GB",
      graphicCard: "GTX 1060",
      price: 29.99,
      active: true,
    });
    expect(product.slug).toBe("test-game");
    expect(product.active).toBe(true);
  });
});

describe("Order Model", () => {
  it("creates an order with auto-generated orderNum", async () => {
    const order = await Order.create({
      name: "Buyer",
      email: "buyer@email.com",
      address: "Rua A, 123",
      postalCode: "12345-678",
      city: "São Paulo",
      state: "SP",
      phone: "11999999999",
      billingAddress: "Rua A, 123",
      billingPostalCode: "12345-678",
      billingState: "SP",
      billingCity: "São Paulo",
      cartProducts: { items: [] },
      totalPrice: 100,
    });
    expect(order.orderNum).toBeDefined();
    expect(order.orderNum.length).toBeGreaterThan(0);
  });
});

describe("Genre Model", () => {
  it("creates a genre", async () => {
    const genre = await Genres.create({ name: "Action", slug: "action" });
    expect(genre.name).toBe("Action");
  });
});

describe("WishList Model", () => {
  it("creates a wishlist", async () => {
    const user = await User.create({ name: "Wish User", email: "wish@email.com" });
    const wishlist = await WishList.create({ user: user._id, products: [] });
    expect(wishlist.user.toString()).toBe(user._id.toString());
  });
});

describe("ResetPassword Model", () => {
  it("creates a reset password entry", async () => {
    const user = await User.create({ name: "Reset User", email: "reset@email.com" });
    const entry = await ResetPassword.create({
      userId: user._id,
      token: "some-token",
      user: { _id: user._id, email: user.email },
    });
    const expectedHash = crypto.createHash("sha256").update("some-token").digest("hex");
    expect(entry.token).toBe(expectedHash);
  });
});
