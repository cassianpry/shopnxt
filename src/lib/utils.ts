import { OrderProps, UserProps } from "@/types/index.d";
import { type ClassValue, clsx } from "clsx";
import moment from "moment";
import qs from "query-string";
import { twMerge } from "tailwind-merge";

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export const paginate = (
  totalRecords: number,
  itemsPerPage: number,
  pageNumber: number
) => {
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  if (pageNumber < 1 || pageNumber > totalPages) {
    return {
      totalPages: 0,
      currentPage: 0,
      items: [],
      error: "Número de página inválido.",
    };
  }

  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalRecords);

  const itemsToShow = Array.from(
    { length: endIndex - startIndex },
    (_, index) => startIndex + index + 1
  );

  const newTotalPages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );
  return {
    newTotalPages,
    currentPage: pageNumber,
    items: itemsToShow,
    error: null,
  };
};

export const growUsersPercentage = (users: UserProps[]): number => {
  //Total sales based on last month
  const lastMonthUsers = users?.filter((user) =>
    moment(user?.createdAt).isSame(moment().subtract(1, "month"), "month")
  );

  //Total sales based on current month
  const currentMonthUsers = users?.filter((user) =>
    moment(user?.createdAt).isSame(moment(), "month")
  );

  // Calculates sales percentage (last month - atual month)
  if (lastMonthUsers?.length === 0) {
    const usersPercentage =
      (currentMonthUsers?.length / currentMonthUsers?.length) * 100;
    return usersPercentage;
  }
  const usersPercentage =
    ((currentMonthUsers?.length - lastMonthUsers?.length) /
      lastMonthUsers?.length) *
    100;
  return usersPercentage;
};

export const calculateTotalMonthOrders = (orders: OrderProps[]): number => {
  //Check if orders exists
  if (!orders || !orders.length) {
    return 0;
  }

  //Filter actual orders
  const currentMonth = moment().month();
  const currentYear = moment().year();

  const currentMonthOrders = orders?.filter(
    (order) =>
      moment(order?.createdAt).month() === currentMonth &&
      moment(order?.createdAt).year() === currentYear
  );

  //Calculate total value of order (actual month)
  const totalOrdersValue = currentMonthOrders?.reduce(
    (total, order) => total + order?.totalPrice,
    0
  );
  return totalOrdersValue;
};

const calculateTotal = (orders: OrderProps[]): number => {
  const total = orders?.reduce((total, order) => total + order?.totalPrice, 0);
  return total;
};

export const growPercentage = (orders: OrderProps[]): number => {
  const OrdersFromPreviousMonth = (orders: OrderProps[]) => {
    const firstDayLastMonth = moment().subtract(1, "months").startOf("month");
    const firstDayCurrMonth = moment().startOf("month");

    const ordersFromMonth = orders?.filter((order) =>
      moment(order.createdAt).isBetween(
        firstDayLastMonth,
        firstDayCurrMonth,
        "day",
        "[]"
      )
    );
    return ordersFromMonth;
  };

  const currentTotalMonthOrder = calculateTotalMonthOrders(orders);
  const previousMonthOrders = OrdersFromPreviousMonth(orders);
  const previousTotalMonthOrders = calculateTotal(previousMonthOrders);

  if (previousTotalMonthOrders === 0) {
    const totalGrowPercentage =
      (currentTotalMonthOrder / currentTotalMonthOrder) * 100;
    return totalGrowPercentage;
  }

  const totalGrowPercentage =
    ((currentTotalMonthOrder - previousTotalMonthOrders) /
      previousTotalMonthOrders) *
    100;

  return totalGrowPercentage;
};
