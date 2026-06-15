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
import GameKey from "@/database/gamekey.model";
import Library from "@/database/library.model";
import Review from "@/database/review.model";
import Coupon from "@/database/coupon.model";
import Cart from "@/database/cart.model";

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
  it("creates an order with auto-generated orderNum and default status", async () => {
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
      items: [],
      totalPrice: 100,
    });
    expect(order.orderNum).toBeDefined();
    expect(order.status).toBe("pending");
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

describe("GameKey Model", () => {
  it("creates a game key with available status", async () => {
    const product = await Product.create({
      name: "Key Game", slug: "key-game", productImage: "img.jpg",
      description: "desc", shortDescription: "short", about: "about",
      genres: [], developer: "Dev", publisher: "Pub",
      system: "Win", processor: "i5", memory: "8GB", storage: "50GB",
      graphicCard: "GTX", price: 29.99, active: true,
    });
    const key = await GameKey.create({
      product: product._id,
      key: "XXXXX-XXXXX-XXXXX",
    });
    expect(key.status).toBe("available");
    expect(key.key).toBe("XXXXX-XXXXX-XXXXX");
  });

  it("enforces unique key", async () => {
    const product = await Product.create({
      name: "Key Game 2", slug: "key-game-2", productImage: "img.jpg",
      description: "desc", shortDescription: "short", about: "about",
      genres: [], developer: "Dev", publisher: "Pub",
      system: "Win", processor: "i5", memory: "8GB", storage: "50GB",
      graphicCard: "GTX", price: 29.99, active: true,
    });
    await GameKey.create({ product: product._id, key: "DUPLICATE-KEY" });
    await expect(
      GameKey.create({ product: product._id, key: "DUPLICATE-KEY" })
    ).rejects.toThrow();
  });
});

describe("Library Model", () => {
  it("creates a library entry for a user", async () => {
    const user = await User.create({ name: "Lib User", email: "lib@email.com" });
    const product = await Product.create({
      name: "Lib Game", slug: "lib-game", productImage: "img.jpg",
      description: "desc", shortDescription: "short", about: "about",
      genres: [], developer: "Dev", publisher: "Pub",
      system: "Win", processor: "i5", memory: "8GB", storage: "50GB",
      graphicCard: "GTX", price: 29.99, active: true,
    });
    const library = await Library.create({
      user: user._id,
      products: [{ product: product._id, keys: ["KEY-123"], orderNum: "12345" }],
    });
    expect(library.products).toHaveLength(1);
    expect(library.products[0].keys[0]).toBe("KEY-123");
  });
});

describe("Review Model", () => {
  it("creates a review with rating", async () => {
    const user = await User.create({ name: "Rev User", email: "rev@email.com" });
    const product = await Product.create({
      name: "Rev Game", slug: "rev-game", productImage: "img.jpg",
      description: "desc", shortDescription: "short", about: "about",
      genres: [], developer: "Dev", publisher: "Pub",
      system: "Win", processor: "i5", memory: "8GB", storage: "50GB",
      graphicCard: "GTX", price: 29.99, active: true,
    });
    const review = await Review.create({
      user: user._id,
      product: product._id,
      rating: 5,
      title: "Great game",
      body: "Really enjoyed it",
    });
    expect(review.rating).toBe(5);
  });

  it("enforces one review per user per product", async () => {
    const user = await User.create({ name: "Rev User 2", email: "rev2@email.com" });
    const product = await Product.create({
      name: "Rev Game 2", slug: "rev-game-2", productImage: "img.jpg",
      description: "desc", shortDescription: "short", about: "about",
      genres: [], developer: "Dev", publisher: "Pub",
      system: "Win", processor: "i5", memory: "8GB", storage: "50GB",
      graphicCard: "GTX", price: 29.99, active: true,
    });
    await Review.create({ user: user._id, product: product._id, rating: 4 });
    await expect(
      Review.create({ user: user._id, product: product._id, rating: 3 })
    ).rejects.toThrow();
  });
});

describe("Coupon Model", () => {
  it("creates a percentage coupon", async () => {
    const coupon = await Coupon.create({
      code: "SAVE10",
      discountType: "percentage",
      discountValue: 10,
    });
    expect(coupon.code).toBe("SAVE10");
    expect(coupon.usedCount).toBe(0);
  });

  it("enforces unique coupon code", async () => {
    await Coupon.create({ code: "UNIQUE", discountType: "fixed", discountValue: 5 });
    await expect(
      Coupon.create({ code: "UNIQUE", discountType: "fixed", discountValue: 10 })
    ).rejects.toThrow();
  });
});

describe("Cart Model", () => {
  it("creates a cart for a user", async () => {
    const user = await User.create({ name: "Cart User", email: "cart@email.com" });
    const product = await Product.create({
      name: "Cart Game", slug: "cart-game", productImage: "img.jpg",
      description: "desc", shortDescription: "short", about: "about",
      genres: [], developer: "Dev", publisher: "Pub",
      system: "Win", processor: "i5", memory: "8GB", storage: "50GB",
      graphicCard: "GTX", price: 29.99, active: true,
    });
    const cart = await Cart.create({
      user: user._id,
      items: [{ product: product._id, price: 29.99 }],
    });
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].price).toBe(29.99);
  });
});
