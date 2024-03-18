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
  searchParams: Record<string, string>;
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
  [x: string]: any;
  isPending?: boolean;
  _id: string;
  name: string;
  slug: string;
}

export interface FormGenreValues {
  _id?: string;
  name: string;
}

export interface ProductProps {
  [x: string]: any;
  [key: number]: string | number | any;
  length?: number;
  data: any;
  _id?: string;
  name: string;
  slug?: string;
  description: string;
  shortDescription: string;
  about: string;
  productImage: any;
  genres: string[];
  developer: string;
  publisher: string;
  system: string;
  processor: string;
  memory: string;
  storage: string;
  graphicCard: string;
  price: string;
}

export interface UserProps {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  address: string;
  postalCode: string;
  phone: string;
  city: string;
  state: string;
  role: string;
  createdAt?: Date;
  length?: number;
}

export interface FormUserProps {
  user?: UseQueryResult<UserProps>;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen?: boolean;
}

export interface OrderProps {
  _id?: string;
  name: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  state: string;
  phone: string;
  cardNumber: string;
  expireDate: string;
  cvv: string;
  checkAddress: boolean;
  billingAddress: string;
  billingPostalCode: string;
  billingState: string;
  billingCity: string;
  cartProducts: ProductProps[];
  orderNum?: string;
  totalPrice: number;
  createdAt?: Date;
}
