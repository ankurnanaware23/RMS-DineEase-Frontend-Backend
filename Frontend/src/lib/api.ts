import { Table, Order, MenuItem, Category, Customer } from "@/types";

import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export default api;

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const signIn = async (credentials: any) => {
  const response = await fetch(`${API_BASE_URL}/user/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error("Sign in failed");
  }
  return response.json();
};

export const signUp = async (userData: any) => {
  const response = await fetch(`${API_BASE_URL}/user/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data?.email?.[0] ||
      data?.detail ||
      "Sign up failed";
    throw new Error(message);
  }
  return data;
};

export const updateProfile = (data: any) => {
  const token = localStorage.getItem("accessToken");

  return fetch("/api/user/profile/", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

type TableApi = {
  id: number | string;
  table_number: string;
  seats: number;
  status: "Available" | "Booked" | "Occupied";
  customer_name?: string | null;
  booking_time?: string | null;
};

type CategoryApi = {
  id: number;
  name: string;
};

type DishApi = {
  id: number;
  name: string;
  description: string;
  price: string | number;
  category: number;
  is_veg: boolean;
};

type OrderItemApi = {
  id: number;
  dish: number;
  dish_name: string;
  quantity: number;
  price: string | number;
};

type OrderApi = {
  id: number;
  table: number | null;
  customer_name: string;
  status: "Pending" | "In Progress" | "Ready" | "Completed" | "Cancelled";
  order_type: "Dine In" | "Takeaway";
  created_at: string;
  total_amount: string | number;
  items: OrderItemApi[];
};

const toTimeString = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return date.toLocaleString([], { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
};

const toBookingDateTime = (time: string | undefined) => {
  if (!time) return null;
  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return date.toISOString();
};

const mapTableFromApi = (table: TableApi): Table => ({
  id: String(table.id),
  number: Number.parseInt(String(table.table_number), 10),
  status: table.status,
  customer: table.customer_name || undefined,
  seats: table.seats,
  reservationTime: table.booking_time ? toTimeString(table.booking_time) : undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const mapTableToApi = (
  data: Partial<Omit<Table, "id" | "createdAt" | "updatedAt">>
) => {
  const payload: Record<string, unknown> = {};

  if (data.number !== undefined) payload.table_number = String(data.number);
  if (data.seats !== undefined) payload.seats = data.seats;
  if (data.status !== undefined) payload.status = data.status;
  if (data.customer !== undefined) payload.customer_name = data.customer ?? null;
  if (data.reservationTime !== undefined) {
    payload.booking_time = data.reservationTime
      ? toBookingDateTime(data.reservationTime)
      : null;
  }

  return payload;
};

const mapCategoryFromApi = (category: CategoryApi): Category => ({
  id: String(category.id),
  name: category.name,
});

const mapDishFromApi = (dish: DishApi): MenuItem => ({
  id: String(dish.id),
  name: dish.name,
  price: Number(dish.price),
  category: "",
  categoryId: dish.category,
  description: dish.description,
  available: true,
  preparationTime: 20,
  isVeg: dish.is_veg,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const mapOrderFromApi = (order: OrderApi, tables: Table[]): Order => {
  const table = tables.find(item => item.id === String(order.table));
  const tableNumber = table ? table.number : 0;
  const customerInitials = order.customer_name
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .join('');

  return {
    id: String(order.id),
    customerName: order.customer_name,
    customerInitials,
    tableNumber,
    tableId: order.table ? String(order.table) : undefined,
    items: order.items.map(item => ({
      id: String(item.id),
      dishId: String(item.dish),
      name: item.dish_name,
      price: Number(item.price),
      quantity: item.quantity,
      category: '',
    })),
    status: order.status,
    totalAmount: Number(order.total_amount),
    createdAt: new Date(order.created_at),
    updatedAt: new Date(order.created_at),
    orderType: order.order_type,
  };
};

export const getTables = async (): Promise<Table[]> => {
  const response = await api.get(`${API_BASE_URL}/tables/`);
  return response.data.map(mapTableFromApi);
};

export const addTable = async (
  tableData: Omit<Table, "id" | "createdAt" | "updatedAt">
): Promise<Table> => {
  const response = await api.post(
    `${API_BASE_URL}/tables/`,
    mapTableToApi(tableData)
  );
  return mapTableFromApi(response.data);
};

export const updateTable = async (
  tableId: string,
  updates: Partial<Omit<Table, "id" | "createdAt" | "updatedAt">>
): Promise<Table> => {
  const response = await api.patch(
    `${API_BASE_URL}/tables/${tableId}/`,
    mapTableToApi(updates)
  );
  return mapTableFromApi(response.data);
};

export const deleteTable = async (tableId: string): Promise<void> => {
  await api.delete(`${API_BASE_URL}/tables/${tableId}/`);
};

export const bookTable = async (
  tableId: string,
  customerName: string,
  reservationDateTime: string
): Promise<Table> => {
  const bookingTime = new Date(reservationDateTime).toISOString();

  const response = await api.post(`${API_BASE_URL}/tables/${tableId}/book/`, {
    customer_name: customerName,
    booking_time: bookingTime,
  });

  return mapTableFromApi(response.data);
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get(`${API_BASE_URL}/categories/`);
  return response.data.map(mapCategoryFromApi);
};

export const getMenuItems = async (): Promise<MenuItem[]> => {
  const response = await api.get(`${API_BASE_URL}/dishes/`);
  return response.data.map(mapDishFromApi);
};

export const addMenuItem = async (
  itemData: Omit<MenuItem, "id" | "createdAt" | "updatedAt">
): Promise<MenuItem> => {
  const payload = {
    name: itemData.name,
    description: itemData.description || "",
    price: itemData.price,
    category: itemData.categoryId,
    is_veg: itemData.isVeg ?? true,
  };
  const response = await api.post(`${API_BASE_URL}/dishes/`, payload);
  return mapDishFromApi(response.data);
};

export const addCategory = async (
  categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">
): Promise<Category> => {
  const response = await api.post(`${API_BASE_URL}/categories/`, {
    name: categoryData.name,
  });
  return mapCategoryFromApi(response.data);
};

export const getOrders = async (tables: Table[]): Promise<Order[]> => {
  const response = await api.get(`${API_BASE_URL}/orders/`);
  return response.data.map((order: OrderApi) => mapOrderFromApi(order, tables));
};

export const addOrder = async (
  orderData: Omit<Order, "id" | "createdAt" | "updatedAt">
): Promise<Order> => {
  const payload = {
    table: orderData.tableId ? Number(orderData.tableId) : null,
    customer_name: orderData.customerName,
    status: orderData.status,
    order_type: orderData.orderType,
    items: orderData.items.map(item => ({
      dish: Number(item.dishId || item.id),
      quantity: item.quantity,
    })),
  };

  try {
    const response = await api.post(`${API_BASE_URL}/orders/`, payload);
    return mapOrderFromApi(response.data, []);
  } catch (error: any) {
    if (error?.response?.data) {
      console.error('Order create error:', error.response.data);
    }
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
): Promise<void> => {
  await api.patch(`${API_BASE_URL}/orders/${orderId}/`, { status });
};

export const updateOrderItems = async (
  orderId: string,
  items: { dishId: string; quantity: number }[]
): Promise<Order> => {
  const payload = {
    items: items.map(item => ({
      dish: Number(item.dishId),
      quantity: item.quantity,
    })),
  };

  const response = await api.patch(`${API_BASE_URL}/orders/${orderId}/`, payload);
  return mapOrderFromApi(response.data, []);
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  await api.delete(`${API_BASE_URL}/orders/${orderId}/`);
};

// Customers are still mocked for now.

let initialCustomers: Customer[] = [
  {
    id: "1",
    name: "Ankur Nanaware",
    email: "ankur@example.com",
    phone: "123-456-7890",
    totalOrders: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    phone: "098-765-4321",
    totalOrders: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCustomers = async (): Promise<Customer[]> => {
  await sleep(500);
  return initialCustomers;
};
