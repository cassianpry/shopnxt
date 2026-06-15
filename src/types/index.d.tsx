import { UseQueryResult } from "@tanstack/react-query";

export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
  menus?: {
    title: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

export interface SearchParamsProps {
  searchParams: Promise<Record<string, string>>;
}

export interface FormGenreProps {
  genre: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

export interface OrderModalProps {
  orderId: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

export interface GenreProps {
  _id?: string;
  name: string;
  slug: string;
}

export interface FormGenreValues {
  _id?: string;
  name: string;
}

export interface ProductProps {
  _id?: string;
  name: string;
  slug?: string;
  description: string;
  shortDescription: string;
  about: string;
  productImage: string;
  genres: { _id: string; name: string }[];
  developer: string;
  publisher: string;
  system: string;
  processor: string;
  memory: string;
  storage: string;
  graphicCard: string;
  price: number | string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRegisterProps {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface UserProps {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  address?: string;
  postalCode?: string;
  phone?: string;
  city?: string;
  state?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormUserProps {
  user?: UseQueryResult<UserProps>;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen?: boolean;
}

export interface OrderItemProps {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderProps {
  _id?: string;
  orderNum?: string;
  user?: string;
  name: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  state: string;
  phone: string;
  billingAddress: string;
  billingPostalCode: string;
  billingState: string;
  billingCity: string;
  items: OrderItemProps[];
  totalPrice: number;
  status: "pending" | "paid" | "fulfilled" | "cancelled" | "refunded";
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: string;
  coupon?: string;
  discountAmount?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GameKeyProps {
  _id?: string;
  product: string;
  key: string;
  status: "available" | "sold" | "revoked";
  order?: string;
  assignedAt?: string;
  createdAt?: string;
}

export interface LibraryProductProps {
  product: string;
  keys: string[];
  purchasedAt: string;
  orderNum: string;
}

export interface LibraryProps {
  _id?: string;
  user: string;
  products: LibraryProductProps[];
  createdAt?: string;
}

export interface ReviewProps {
  _id?: string;
  user: string;
  product: string;
  rating: number;
  title?: string;
  body?: string;
  createdAt?: string;
}

export interface CouponProps {
  _id?: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minPurchase?: number;
  validFrom?: string;
  validUntil?: string;
  usageLimit?: number;
  usedCount?: number;
  active: boolean;
  createdAt?: string;
}

export interface CartItemProps {
  product: string;
  price: number;
}

export interface CartProps {
  _id?: string;
  user: string;
  items: CartItemProps[];
  createdAt?: string;
  updatedAt?: string;
}
