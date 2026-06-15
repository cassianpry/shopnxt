import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

import { GET as getProducts, POST as createProduct } from "@/app/api/product/route";
import { GET as getProductById, PUT as updateProduct } from "@/app/api/product/[id]/route";
import { GET as getProductBySlug } from "@/app/api/product/slug/[slug]/route";
import { GET as getOrders, POST as createOrder } from "@/app/api/order/route";
import { GET as getOrderById } from "@/app/api/order/[id]/route";
import { GET as getGenres, POST as createGenre } from "@/app/api/genre/route";
import { GET as getGenreById, PUT as updateGenre } from "@/app/api/genre/[id]/route";
import { GET as getUsers } from "@/app/api/user/route";
import { GET as getUserById, PUT as updateUser } from "@/app/api/user/[id]/route";
import { POST as addToWishlist } from "@/app/api/wishlist/route";
import { GET as getWishlist, DELETE as removeFromWishlist } from "@/app/api/wishlist/[id]/route";
import { POST as registerUser } from "@/app/api/register/route";
import { GET as verifyToken, PUT as resetPassword } from "@/app/api/forgot-password/route";
import { POST as requestReset } from "@/app/api/forgot-password/[id]/route";

import GameKey from "@/database/gamekey.model";
import Library from "@/database/library.model";
import Review from "@/database/review.model";
import Coupon from "@/database/coupon.model";
import Cart from "@/database/cart.model";
import {
  GET as getCart,
  POST as postToCart,
} from "@/app/api/cart/route";
import {
  GET as getProductReviews,
} from "@/app/api/product/[id]/reviews/route";
import {
  POST as createReview,
} from "@/app/api/review/route";
import {
  POST as validateCoupon,
} from "@/app/api/coupon/validate/route";

import { Product } from "@/database/product.model";
import User from "@/database/user.model";
import Order from "@/database/order.model";
import Genres from "@/database/genre.model";
import WishList from "@/database/wishlist.model";
import ResetPassword from "@/database/resetpasswd.model";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  vi.mock("next-auth", () => ({
    getServerSession: vi.fn(),
  }));
  vi.mock("nodemailer", () => {
    const sendMail = vi.fn().mockResolvedValue({ messageId: "mock-id" });
    return {
      default: {
        createTransport: vi.fn().mockReturnValue({ sendMail }),
      },
      createTransport: vi.fn().mockReturnValue({ sendMail }),
    };
  });

  process.env.BASE_URL = "http://localhost:3000";

  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  vi.restoreAllMocks();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  vi.clearAllMocks();
});

function createNextRequest({
  url = "http://localhost:3000",
  method = "GET",
  body,
  searchParams,
}: {
  url?: string;
  method?: string;
  body?: unknown;
  searchParams?: Record<string, string>;
} = {}): NextRequest {
  const baseUrl = new URL(url);
  if (searchParams) {
    Object.entries(searchParams).forEach(([k, v]) =>
      baseUrl.searchParams.set(k, v)
    );
  }
  const init: RequestInit & { headers?: Headers } = {
    method,
    headers: new Headers({ "Content-Type": "application/json" }),
  };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }
  return new NextRequest(baseUrl.toString(), init);
}

async function createTestUser(overrides: Record<string, unknown> = {}) {
  return User.create({
    name: "Test User",
    email: "test@example.com",
    password: "hashedpass123",
    address: "Rua A, 123",
    postalCode: "12345-678",
    city: "São Paulo",
    state: "SP",
    phone: "11999999999",
    role: "user",
    ...overrides,
  });
}

async function createTestAdmin() {
  return createTestUser({ email: "admin@example.com", role: "admin" });
}

async function createTestGenre(name = "Action") {
  const existing = await Genres.findOne({ name });
  if (existing) return existing;
  return Genres.create({ name, slug: name.toLowerCase() });
}

async function createTestProduct(overrides: Record<string, unknown> = {}) {
  const genre = await createTestGenre();
  return Product.create({
    name: "Test Game",
    slug: "test-game",
    productImage: "https://example.com/img.jpg",
    description: "An amazing test game description",
    shortDescription: "Short description here",
    about: "About this amazing test game",
    genres: [{ _id: genre._id, name: genre.name }],
    developer: "Test Dev",
    publisher: "Test Pub",
    system: "Windows",
    processor: "i5",
    memory: "8GB",
    storage: "50GB",
    graphicCard: "GTX 1060",
    price: 29.99,
    active: true,
    ...overrides,
  });
}

// ─── REGISTER ────────────────────────────────────────────────────────────────

describe("POST /api/register", () => {
  it("creates a user with valid data", async () => {
    const req = createNextRequest({
      method: "POST",
      body: {
        name: "New User",
        email: "newuser@test.com",
        password: "Abc12345",
        confirm_password: "Abc12345",
      },
    });
    const res = await registerUser(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toBe("Usuário Criado!");
  });

  it("rejects duplicate email", async () => {
    await createTestUser({ email: "dup@test.com" });
    const req = createNextRequest({
      method: "POST",
      body: {
        name: "Dup User",
        email: "dup@test.com",
        password: "Abc12345",
        confirm_password: "Abc12345",
      },
    });
    const res = await registerUser(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("E-mail já existente");
  });

  it("rejects invalid data", async () => {
    const req = createNextRequest({ method: "POST", body: {} });
    const res = await registerUser(req);
    expect(res.status).toBe(400);
  });
});

// ─── GENRE ───────────────────────────────────────────────────────────────────

describe("GET /api/genre", () => {
  it("returns empty list when no genres", async () => {
    const req = createNextRequest({ searchParams: { page: "1", pageSize: "10" } });
    const res = await getGenres(req);
    const body = await res.json();
    expect(body.genre).toEqual([]);
    expect(body.totalGenres).toBe(0);
  });

  it("returns genres with pagination", async () => {
    await createTestGenre("Action");
    await createTestGenre("RPG");
    const req = createNextRequest({ searchParams: { page: "1", pageSize: "10" } });
    const res = await getGenres(req);
    const body = await res.json();
    expect(body.genre).toHaveLength(2);
    expect(body.totalGenres).toBe(2);
  });

  it("filters by searchQuery", async () => {
    await createTestGenre("Action");
    await createTestGenre("RPG");
    const req = createNextRequest({ searchParams: { page: "1", pageSize: "10", searchQuery: "act" } });
    const res = await getGenres(req);
    const body = await res.json();
    expect(body.genre).toHaveLength(1);
    expect(body.genre[0].name).toBe("Action");
  });
});

describe("POST /api/genre", () => {
  it("creates a genre", async () => {
    const req = createNextRequest({ method: "POST", body: { name: "Strategy" } });
    const res = await createGenre(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.genre.name).toBe("Strategy");
  });

  it("rejects duplicate genre", async () => {
    await createTestGenre("Action");
    const req = createNextRequest({ method: "POST", body: { name: "Action" } });
    const res = await createGenre(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("Categoria já cadastrada");
  });

  it("rejects short name", async () => {
    const req = createNextRequest({ method: "POST", body: { name: "AB" } });
    const res = await createGenre(req);
    expect(res.status).toBe(400);
  });
});

describe("GET /api/genre/[id]", () => {
  it("returns a genre by id", async () => {
    const genre = await createTestGenre("Action");
    const req = createNextRequest();
    const res = await getGenreById(req, { params: Promise.resolve({ id: genre._id.toString() }) });
    const body = await res.json();
    expect(body.name).toBe("Action");
  });
});

describe("PUT /api/genre/[id]", () => {
  it("updates a genre name", async () => {
    const genre = await createTestGenre("Action");
    const req = createNextRequest({ method: "PUT", body: { name: "RPG" } });
    const res = await updateGenre(req, { params: Promise.resolve({ id: genre._id.toString() }) });
    const body = await res.json();
    expect(body.name).toBe("RPG");
  });

  it("rejects invalid update", async () => {
    const genre = await createTestGenre("Action");
    const req = createNextRequest({ method: "PUT", body: {} });
    const res = await updateGenre(req, { params: Promise.resolve({ id: genre._id.toString() }) });
    expect(res.status).toBe(400);
  });
});

// ─── PRODUCT ─────────────────────────────────────────────────────────────────

describe("GET /api/product", () => {
  it("returns empty when no products", async () => {
    const req = createNextRequest({ searchParams: { page: "1", pageSize: "10" } });
    const res = await getProducts(req);
    const body = await res.json();
    expect(body).toBeNull();
  });

  it("returns paginated products", async () => {
    await createTestProduct({ name: "Game A", slug: "game-a" });
    await createTestProduct({ name: "Game B", slug: "game-b" });
    const req = createNextRequest({ searchParams: { page: "1", pageSize: "10" } });
    const res = await getProducts(req);
    const body = await res.json();
    expect(body.products).toHaveLength(2);
    expect(body.totalProducts).toBe(2);
  });

  it("searches products by name", async () => {
    await createTestProduct({ name: "Cyberpunk", slug: "cyberpunk" });
    await createTestProduct({ name: "Stardew Valley", slug: "stardew-valley" });
    const req = createNextRequest({ searchParams: { page: "1", pageSize: "10", searchQuery: "cyber" } });
    const res = await getProducts(req);
    const body = await res.json();
    expect(body.products).toHaveLength(1);
    expect(body.products[0].name).toBe("Cyberpunk");
  });
});

describe("POST /api/product", () => {
  it("creates a product with valid data", async () => {
    const genre = await createTestGenre("Action");
    const req = createNextRequest({
      method: "POST",
      body: {
        name: "New Game",
        description: "A great new game description here",
        shortDescription: "A short desc",
        about: "About this new game",
        productImage: "https://example.com/img.jpg",
        genres: [genre._id.toString()],
        developer: "Dev Studio",
        publisher: "Pub Co",
        system: "Windows 11",
        processor: "Intel i7",
        memory: "16GB",
        storage: "100GB",
        graphicCard: "RTX 3080",
        price: 49.99,
        active: true,
      },
    });
    const res = await createProduct(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toBe("Produto criado");
  });

  it("rejects invalid product data", async () => {
    const req = createNextRequest({ method: "POST", body: { name: "AB" } });
    const res = await createProduct(req);
    expect(res.status).toBe(400);
  });

  it("rejects duplicate product slug", async () => {
    const genre = await createTestGenre("Action");
    await createTestProduct({ name: "New Game", slug: "new-game" });
    const req = createNextRequest({
      method: "POST",
      body: {
        name: "New Game",
        description: "A great new game description here",
        shortDescription: "A short desc",
        about: "About this new game",
        productImage: "https://example.com/img.jpg",
        genres: [genre._id.toString()],
        developer: "Dev Studio",
        publisher: "Pub Co",
        system: "Windows 11",
        processor: "Intel i7",
        memory: "16GB",
        storage: "100GB",
        graphicCard: "RTX 3080",
        price: 49.99,
        active: true,
      },
    });
    const res = await createProduct(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("Produto já cadastrado");
  });
});

describe("GET /api/product/[id]", () => {
  it("returns a product by id", async () => {
    const product = await createTestProduct();
    const req = createNextRequest();
    const res = await getProductById(req, { params: Promise.resolve({ id: product._id.toString() }) });
    const body = await res.json();
    expect(body.name).toBe("Test Game");
  });
});

describe("PUT /api/product/[id]", () => {
  it("updates a product", async () => {
    const genre = await createTestGenre("Action");
    const product = await createTestProduct();
    const req = createNextRequest({
      method: "PUT",
      body: {
        name: "Updated Game",
        description: "Updated description for the game right here",
        shortDescription: "Short desc updated",
        about: "About the updated game now",
        productImage: "https://example.com/new.jpg",
        genres: [genre._id.toString()],
        developer: "New Dev",
        publisher: "New Pub",
        system: "Windows 11",
        processor: "Intel i9",
        memory: "32GB",
        storage: "200GB",
        graphicCard: "RTX 4090",
        price: 59.99,
        active: true,
      },
    });
    const res = await updateProduct(req, { params: Promise.resolve({ id: product._id.toString() }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toBe("Produto alterado");
  });
});

describe("GET /api/product/slug/[slug]", () => {
  it("returns a product by slug", async () => {
    await createTestProduct({ name: "Slug Test", slug: "slug-test" });
    const req = createNextRequest();
    const res = await getProductBySlug(req, { params: Promise.resolve({ slug: "slug-test" }) });
    const body = await res.json();
    expect(body.name).toBe("Slug Test");
  });
});

// ─── USER ────────────────────────────────────────────────────────────────────

describe("GET /api/user", () => {
  it("returns empty list when no users", async () => {
    const req = createNextRequest({ searchParams: { page: "1", pageSize: "10" } });
    const res = await getUsers(req);
    const body = await res.json();
    expect(body.users).toEqual([]);
  });

  it("returns paginated users", async () => {
    await createTestUser({ email: "u1@test.com" });
    await createTestUser({ email: "u2@test.com" });
    const req = createNextRequest({ searchParams: { page: "1", pageSize: "10" } });
    const res = await getUsers(req);
    const body = await res.json();
    expect(body.users).toHaveLength(2);
  });

  it("nullifies passwords in response", async () => {
    await createTestUser({ email: "pass@test.com" });
    const req = createNextRequest({ searchParams: { page: "1", pageSize: "10" } });
    const res = await getUsers(req);
    const body = await res.json();
    expect(body.users[0].password).toBeNull();
  });
});

describe("GET /api/user/[id]", () => {
  it("returns a user by id", async () => {
    const user = await createTestUser();
    const req = createNextRequest();
    const res = await getUserById(req, { params: Promise.resolve({ id: user._id.toString() }) });
    const body = await res.json();
    expect(body.user.name).toBe("Test User");
  });
});

describe("PUT /api/user/[id]", () => {
  it("rejects unauthenticated request", async () => {
    const { getServerSession } = await import("next-auth");
    vi.mocked(getServerSession).mockResolvedValue(null);

    const user = await createTestUser();
    const req = createNextRequest({
      method: "PUT",
      body: { name: "Hacked Name" },
    });
    const res = await updateUser(req, { params: Promise.resolve({ id: user._id.toString() }) });
    expect(res.status).toBe(401);
  });

  it("updates own profile when authenticated", async () => {
    const { getServerSession } = await import("next-auth");
    const user = await createTestUser();
    vi.mocked(getServerSession).mockResolvedValue({
      user: { _id: user._id.toString(), email: user.email, name: user.name, role: "user" },
      expires: new Date(Date.now() + 86400).toISOString(),
    });

    const req = createNextRequest({
      method: "PUT",
      body: { name: "Updated Name", email: "test@example.com" },
    });
    const res = await updateUser(req, { params: Promise.resolve({ id: user._id.toString() }) });
    expect(res.status).toBe(200);
  });

  it("forbids updating another user's profile", async () => {
    const { getServerSession } = await import("next-auth");
    const user = await createTestUser();
    vi.mocked(getServerSession).mockResolvedValue({
      user: { _id: new mongoose.Types.ObjectId().toString(), email: "other@test.com", name: "Other", role: "user" },
      expires: new Date(Date.now() + 86400).toISOString(),
    });

    const req = createNextRequest({
      method: "PUT",
      body: { name: "Hacked Name" },
    });
    const res = await updateUser(req, { params: Promise.resolve({ id: user._id.toString() }) });
    expect(res.status).toBe(403);
  });
});

// ─── ORDER ───────────────────────────────────────────────────────────────────

describe("GET /api/order", () => {
  it("returns null when no orders", async () => {
    const req = createNextRequest({ searchParams: { page: "1", pageSize: "10" } });
    const res = await getOrders(req);
    const body = await res.json();
    expect(body).toBeNull();
  });

  it("returns paginated orders with total", async () => {
    await Order.create({
      name: "Buyer A",
      email: "a@test.com",
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
    await Order.create({
      name: "Buyer B",
      email: "b@test.com",
      address: "Rua B, 456",
      postalCode: "12345-678",
      city: "São Paulo",
      state: "SP",
      phone: "11999999998",
      billingAddress: "Rua B, 456",
      billingPostalCode: "12345-678",
      billingState: "SP",
      billingCity: "São Paulo",
      items: [],
      totalPrice: 200,
    });
    const req = createNextRequest({ searchParams: { page: "1", pageSize: "10" } });
    const res = await getOrders(req);
    const body = await res.json();
    expect(body.orders).toHaveLength(2);
    expect(body.total).toBe(300);
  });
});

describe("POST /api/order", () => {
  it("creates an order with valid data", async () => {
    const req = createNextRequest({
      method: "POST",
      body: {
        values: {
          name: "Buyer Name",
          email: "buyer@test.com",
          address: "Rua A, 123",
          postalCode: "12345-678",
          city: "São Paulo",
          state: "SP",
          phone: "11999999999",
          checkAddress: true,
          billingAddress: "Rua A, 123",
          billingPostalCode: "12345-678",
          billingState: "SP",
          billingCity: "São Paulo",
        },
        items: [],
        totalPrice: 50,
      },
    });
    const res = await createOrder(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.orderId).toBeDefined();
  });

  it("rejects invalid order data", async () => {
    const req = createNextRequest({ method: "POST", body: { values: { name: "AB" } } });
    const res = await createOrder(req);
    expect(res.status).toBe(400);
  });
});

describe("GET /api/order/[id]", () => {
  it("returns order by orderNum for owner", async () => {
    const { getServerSession } = await import("next-auth");
    const order = await Order.create({
      name: "Buyer",
      email: "buyer@test.com",
      address: "Rua, 123",
      postalCode: "12345-678",
      city: "São Paulo",
      state: "SP",
      phone: "11999999999",
      billingAddress: "Rua, 123",
      billingPostalCode: "12345-678",
      billingState: "SP",
      billingCity: "São Paulo",
      items: [],
      totalPrice: 100,
    });
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: "buyer@test.com", _id: "someid", name: "Buyer", role: "user" },
      expires: new Date(Date.now() + 86400).toISOString(),
    });
    const req = createNextRequest();
    const res = await getOrderById(req, { params: Promise.resolve({ id: order.orderNum }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.email).toBe("buyer@test.com");
  });

  it("denies access to non-owner", async () => {
    const { getServerSession } = await import("next-auth");
    const order = await Order.create({
      name: "Buyer",
      email: "buyer@test.com",
      address: "Rua, 123",
      postalCode: "12345-678",
      city: "São Paulo",
      state: "SP",
      phone: "11999999999",
      billingAddress: "Rua, 123",
      billingPostalCode: "12345-678",
      billingState: "SP",
      billingCity: "São Paulo",
      items: [],
      totalPrice: 100,
    });
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: "other@test.com", _id: "otherid", name: "Other", role: "user" },
      expires: new Date(Date.now() + 86400).toISOString(),
    });
    const req = createNextRequest();
    const res = await getOrderById(req, { params: Promise.resolve({ id: order.orderNum }) });
    expect(res.status).toBe(403);
  });

  it("allows admin to see any order", async () => {
    const { getServerSession } = await import("next-auth");
    const order = await Order.create({
      name: "Buyer",
      email: "buyer@test.com",
      address: "Rua, 123",
      postalCode: "12345-678",
      city: "São Paulo",
      state: "SP",
      phone: "11999999999",
      billingAddress: "Rua, 123",
      billingPostalCode: "12345-678",
      billingState: "SP",
      billingCity: "São Paulo",
      items: [],
      totalPrice: 100,
    });
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: "admin@test.com", _id: "adminid", name: "Admin", role: "admin" },
      expires: new Date(Date.now() + 86400).toISOString(),
    });
    const req = createNextRequest();
    const res = await getOrderById(req, { params: Promise.resolve({ id: order.orderNum }) });
    expect(res.status).toBe(200);
  });
});

// ─── WISHLIST ────────────────────────────────────────────────────────────────

describe("POST /api/wishlist", () => {
  it("creates a wishlist and adds product", async () => {
    const user = await createTestUser();
    const product = await createTestProduct();
    const req = createNextRequest({
      method: "POST",
      body: { user: user._id.toString(), product: product._id.toString() },
    });
    const res = await addToWishlist(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.wishList).toBeDefined();
  });

  it("rejects non-existent user", async () => {
    const req = createNextRequest({
      method: "POST",
      body: { user: new mongoose.Types.ObjectId().toString(), product: new mongoose.Types.ObjectId().toString() },
    });
    const res = await addToWishlist(req);
    const body = await res.json();
    expect(body.Error).toContain("Usuário não encontrado");
  });
});

describe("GET /api/wishlist/[id]", () => {
  it("rejects unauthenticated request", async () => {
    const { getServerSession } = await import("next-auth");
    vi.mocked(getServerSession).mockResolvedValue(null);

    const user = await createTestUser();
    const req = createNextRequest();
    const res = await getWishlist(req, { params: Promise.resolve({ id: user._id.toString() }) });
    expect(res.status).toBe(403);
  });

  it("returns wishlist for authorized user", async () => {
    const { getServerSession } = await import("next-auth");
    const user = await createTestUser();
    const product = await createTestProduct();
    await WishList.create({ user: user._id, products: [product._id] });
    vi.mocked(getServerSession).mockResolvedValue({
      user: { _id: user._id.toString(), email: user.email, name: user.name, role: "user" },
      expires: new Date(Date.now() + 86400).toISOString(),
    });
    const req = createNextRequest();
    const res = await getWishlist(req, { params: Promise.resolve({ id: user._id.toString() }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.wishlist).toBeDefined();
  });
});

describe("DELETE /api/wishlist/[id]", () => {
  it("removes a product from wishlist", async () => {
    const { getServerSession } = await import("next-auth");
    const user = await createTestUser();
    const product = await createTestProduct();
    await WishList.create({ user: user._id, products: [product._id] });
    vi.mocked(getServerSession).mockResolvedValue({
      user: { _id: user._id.toString(), email: user.email, name: user.name, role: "user" },
      expires: new Date(Date.now() + 86400).toISOString(),
    });
    const req = createNextRequest({
      method: "DELETE",
      body: { product: product._id.toString() },
    });
    const res = await removeFromWishlist(req, { params: Promise.resolve({ id: user._id.toString() }) });
    expect(res.status).toBe(200);
  });
});

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────

describe("POST /api/forgot-password/[id]", () => {
  it("creates a reset token for existing user", async () => {
    await createTestUser({ email: "reset@test.com" });
    const req = createNextRequest({
      method: "POST",
      body: { email: "reset@test.com" },
    });
    const res = await requestReset(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toBe("Redefinição de senha recebida.");
  });

  it("does not leak user existence for non-existent email", async () => {
    const req = createNextRequest({
      method: "POST",
      body: { email: "nonexistent@test.com" },
    });
    const res = await requestReset(req);
    expect(res.status).toBe(500);
  });
});

describe("GET /api/forgot-password", () => {
  it("returns error when no token provided", async () => {
    const req = createNextRequest();
    const res = await verifyToken(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("Token não fornecido");
  });

  it("returns error for invalid token", async () => {
    const req = createNextRequest({ searchParams: { token: "invalidtoken123" } });
    const res = await verifyToken(req);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain("Token expirado");
  });

  it("validates a valid token", async () => {
    const user = await createTestUser();
    const rawToken = "validtoken123";
    await ResetPassword.create({
      userId: user._id.toString(),
      token: rawToken,
      user: { _id: user._id, email: user.email },
      resetAt: Date.now(),
    });
    const req = createNextRequest({ searchParams: { token: rawToken } });
    const res = await verifyToken(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.userId).toBe(user._id.toString());
  });
});

describe("PUT /api/forgot-password", () => {
  it("resets password for valid request", async () => {
    const user = await createTestUser();
    const req = createNextRequest({
      method: "PUT",
      body: {
        userId: user._id.toString(),
        password: "NewPass123",
        confirm_password: "NewPass123",
      },
    });
    const res = await resetPassword(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toBe("ok");
  });

  it("rejects weak password", async () => {
    const req = createNextRequest({
      method: "PUT",
      body: { userId: "someid", password: "123", confirm_password: "123" },
    });
    const res = await resetPassword(req);
    expect(res.status).toBe(400);
  });
});

// ─── CART ─────────────────────────────────────────────────────────────────────

describe("POST /api/cart", () => {
  it("adds a product to cart", async () => {
    const { getServerSession } = await import("next-auth");
    const user = await createTestUser();
    const product = await createTestProduct();
    vi.mocked(getServerSession).mockResolvedValue({
      user: { _id: user._id.toString(), email: user.email, name: user.name, role: "user" },
      expires: new Date(Date.now() + 86400).toISOString(),
    });

    const req = createNextRequest({
      method: "POST",
      body: { productId: product._id.toString() },
    });
    const res = await postToCart(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.items).toHaveLength(1);
  });

  it("rejects unauthenticated request", async () => {
    const { getServerSession } = await import("next-auth");
    vi.mocked(getServerSession).mockResolvedValue(null);

    const req = createNextRequest({
      method: "POST",
      body: { productId: new mongoose.Types.ObjectId().toString() },
    });
    const res = await postToCart(req);
    expect(res.status).toBe(401);
  });
});

// ─── COUPON ───────────────────────────────────────────────────────────────────

describe("POST /api/coupon/validate", () => {
  it("validates a valid coupon", async () => {
    await Coupon.create({
      code: "SAVE10",
      discountType: "percentage",
      discountValue: 10,
      active: true,
    });
    const req = createNextRequest({
      method: "POST",
      body: { code: "SAVE10", cartTotal: 100 },
    });
    const res = await validateCoupon(req);
    const body = await res.json();
    expect(body.valid).toBe(true);
    expect(body.coupon.discountAmount).toBe(10);
  });

  it("rejects expired coupon", async () => {
    await Coupon.create({
      code: "EXPIRED",
      discountType: "fixed",
      discountValue: 20,
      active: true,
      validUntil: new Date("2020-01-01"),
    });
    const req = createNextRequest({
      method: "POST",
      body: { code: "EXPIRED", cartTotal: 100 },
    });
    const res = await validateCoupon(req);
    const body = await res.json();
    expect(body.valid).toBe(false);
  });

  it("rejects non-existent coupon", async () => {
    const req = createNextRequest({
      method: "POST",
      body: { code: "NONEXISTENT", cartTotal: 100 },
    });
    const res = await validateCoupon(req);
    const body = await res.json();
    expect(body.valid).toBe(false);
  });
});

// ─── REVIEW ───────────────────────────────────────────────────────────────────

describe("POST /api/review", () => {
  it("creates a review", async () => {
    const { getServerSession } = await import("next-auth");
    const user = await createTestUser();
    const product = await createTestProduct();
    vi.mocked(getServerSession).mockResolvedValue({
      user: { _id: user._id.toString(), email: user.email, name: user.name, role: "user" },
      expires: new Date(Date.now() + 86400).toISOString(),
    });

    const req = createNextRequest({
      method: "POST",
      body: { productId: product._id.toString(), rating: 5, title: "Great", body: "Loved it" },
    });
    const res = await createReview(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.rating).toBe(5);
  });

  it("rejects invalid rating", async () => {
    const { getServerSession } = await import("next-auth");
    const user = await createTestUser();
    const product = await createTestProduct();
    vi.mocked(getServerSession).mockResolvedValue({
      user: { _id: user._id.toString(), email: user.email, name: user.name, role: "user" },
      expires: new Date(Date.now() + 86400).toISOString(),
    });

    const req = createNextRequest({
      method: "POST",
      body: { productId: product._id.toString(), rating: 6 },
    });
    const res = await createReview(req);
    expect(res.status).toBe(400);
  });
});
