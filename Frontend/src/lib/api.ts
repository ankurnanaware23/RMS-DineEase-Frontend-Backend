import { Table, Order, MenuItem, Category, Customer } from '@/types';

// This is mock data. Once the Django backend is ready, these will be replaced with actual API calls.

let initialTables: Table[] = [
  {
    id: '1',
    number: 1,
    status: 'Booked',
    customer: 'AN',
    seats: 4,
    reservationTime: '19:30',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    number: 2,
    status: 'Available',
    seats: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    number: 3,
    status: 'Available',
    seats: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    number: 4,
    status: 'Occupied',
    customer: 'JD',
    seats: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    number: 5,
    status: 'Available',
    seats: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    number: 6,
    status: 'Booked',
    customer: 'SM',
    seats: 4,
    reservationTime: '20:00',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    number: 7,
    status: 'Available',
    seats: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    number: 8,
    status: 'Occupied',
    customer: 'RS',
    seats: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '9',
    number: 9,
    status: 'Available',
    seats: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '10',
    number: 10,
    status: 'Available',
    seats: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let initialOrders: Order[] = [
  {
    id: '1',
    customerName: 'Ankur Nanaware',
    customerInitials: 'AN',
    tableNumber: 3,
    items: [
      { id: '1', name: 'Butter Chicken', price: 320, quantity: 2, category: 'Main Course' },
      { id: '2', name: 'Naan', price: 80, quantity: 4, category: 'Bread' },
    ],
    status: 'Ready',
    totalAmount: 640,
    orderType: 'Dine In',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    customerName: 'John Doe',
    customerInitials: 'JD',
    tableNumber: 5,
    items: [
        { id: '3', name: 'Pizza', price: 450, quantity: 1, category: 'Main Course' },
        { id: '4', name: 'Coke', price: 50, quantity: 2, category: 'Beverages' },
    ],
    status: 'Ready',
    totalAmount: 550,
    orderType: 'Dine In',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    customerName: 'Jane Doe',
    customerInitials: 'JD',
    tableNumber: 2,
    items: [
        { id: '5', name: 'Salad', price: 150, quantity: 1, category: 'Starters' },
    ],
    status: 'Ready',
    totalAmount: 150,
    orderType: 'Dine In',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    customerName: 'Ankur Nanaware',
    customerInitials: 'AN',
    tableNumber: 1,
    items: [
        { id: '1', name: 'Butter Chicken', price: 320, quantity: 1, category: 'Main Course' },
    ],
    status: 'Ready',
    totalAmount: 320,
    orderType: 'Dine In',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    customerName: 'John Doe',
    customerInitials: 'JD',
    tableNumber: 4,
    items: [
        { id: '3', name: 'Pizza', price: 450, quantity: 2, category: 'Main Course' },
    ],
    status: 'Ready',
    totalAmount: 900,
    orderType: 'Dine In',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let initialMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Butter Chicken',
    price: 320,
    category: 'Main Course',
    description: 'Creamy and rich chicken curry',
    available: true,
    preparationTime: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Naan',
    price: 80,
    category: 'Bread',
    description: 'Soft and fluffy Indian bread',
    available: true,
    preparationTime: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Pizza',
    price: 450,
    category: 'Main Course',
    description: 'Cheesy and delicious pizza',
    available: true,
    preparationTime: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Coke',
    price: 50,
    category: 'Beverages',
    description: 'Refreshing cola drink',
    available: true,
    preparationTime: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
    { id: '5', name: 'Salad', price: 150, category: 'Starters', description: 'Healthy and fresh salad', available: true, preparationTime: 15, createdAt: new Date(), updatedAt: new Date() },
    { id: '6', name: 'Burger', price: 250, category: 'Main Course', description: 'Juicy and delicious burger', available: true, preparationTime: 20, createdAt: new Date(), updatedAt: new Date() },
    { id: '7', name: 'Fries', price: 100, category: 'Starters', description: 'Crispy and salty fries', available: true, preparationTime: 10, createdAt: new Date(), updatedAt: new Date() },
    { id: '8', name: 'Ice Cream', price: 120, category: 'Desserts', description: 'Cool and sweet ice cream', available: true, preparationTime: 5, createdAt: new Date(), updatedAt: new Date() },
    { id: '9', name: 'Chocolate Cake', price: 200, category: 'Desserts', description: 'Rich and moist chocolate cake', available: true, preparationTime: 30, createdAt: new Date(), updatedAt: new Date() },
    { id: '10', name: 'Coffee', price: 100, category: 'Beverages', description: 'Hot and aromatic coffee', available: true, preparationTime: 5, createdAt: new Date(), updatedAt: new Date() },
    { id: '11', name: 'Tea', price: 80, category: 'Beverages', description: 'Hot and soothing tea', available: true, preparationTime: 5, createdAt: new Date(), updatedAt: new Date() },
];

let initialCategories: Category[] = [
  {
    id: '1',
    name: 'Main Course',
    emoji: '🍗',
    color: 'bg-restaurant-orange',
    itemCount: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let initialCustomers: Customer[] = [
    {
        id: '1',
        name: 'Ankur Nanaware',
        email: 'ankur@example.com',
        phone: '123-456-7890',
        totalOrders: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '098-765-4321',
        totalOrders: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];


// Simulate API latency
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getTables = async (): Promise<Table[]> => {
  await sleep(500);
  return initialTables;
};

export const getOrders = async (): Promise<Order[]> => {
  await sleep(500);
  return initialOrders;
};

export const getMenuItems = async (): Promise<MenuItem[]> => {
  await sleep(500);
  return initialMenuItems;
};

export const getCategories = async (): Promise<Category[]> => {
  await sleep(500);
  return initialCategories;
};

export const getCustomers = async (): Promise<Customer[]> => {
  await sleep(500);
  return initialCustomers;
}

export const addTable = async (tableData: Omit<Table, 'id' | 'createdAt' | 'updatedAt'>): Promise<Table> => {
  await sleep(500);
  const newTable: Table = {
    ...tableData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  initialTables = [...initialTables, newTable];
  return newTable;
};

export const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
  await sleep(500);
  const newOrder: Order = {
    ...orderData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  initialOrders = [...initialOrders, newOrder];
  return newOrder;
};

export const addMenuItem = async (itemData: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MenuItem> => {
  await sleep(500);
  const newItem: MenuItem = {
    ...itemData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    available: true, // By default
    preparationTime: 20, // Default value
  };
  initialMenuItems = [...initialMenuItems, newItem];
  return newItem;
};

export const addCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
  await sleep(500);
  const newCategory: Category = {
    ...categoryData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    emoji: '✨', // Default emoji
    color: 'bg-restaurant-gray', // Default color
    itemCount: 0,
  };
  initialCategories = [...initialCategories, newCategory];
  return newCategory;
};
