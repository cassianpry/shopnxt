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
  oldPrice?: number | string;
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
  _id: string;
  product: string;
  name: string;
  price: number;
  quantity: number;
  productImage: string;
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
  items?: OrderItemProps[];
  cartProducts?: ProductProps[];
  totalPrice?: number;
  status?: "pending" | "paid" | "fulfilled" | "cancelled" | "refunded";
  userId?: string;
  orderId?: string;
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: string;
  coupon?: string;
  discountAmount?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function isUserProps(user: unknown): user is UserProps {
  return !!user && typeof user === "object" && "role" in user;
}
