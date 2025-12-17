import { useState, useCallback, useEffect } from 'react';
import { Table, Order, MenuItem, Category, Customer, RestaurantStats } from '@/types';
import { useToast } from '@/hooks/use-toast';
import * as api from '@/lib/api';

export function useRestaurantData() {
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<RestaurantStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tablesData, ordersData, menuItemsData, categoriesData, customersData] = await Promise.all([
        api.getTables(),
        api.getOrders(),
        api.getMenuItems(),
        api.getCategories(),
        api.getCustomers(),
      ]);
      setTables(tablesData);
      setOrders(ordersData);
      setMenuItems(menuItemsData);
      setCategories(categoriesData);
      setCustomers(customersData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!loading) {
      const calculatedStats: RestaurantStats = {
        totalEarnings: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        inProgressOrders: orders.filter(order => order.status === 'In Progress').length,
        totalCustomers: customers.length,
        eventCount: 20000, // Mock data
        totalCategories: categories.length,
        totalDishes: menuItems.length,
        activeOrders: orders.filter(order => ['Pending', 'In Progress'].includes(order.status)).length,
        totalTables: tables.length,
      };
      setStats(calculatedStats);
    }
  }, [loading, orders, customers, categories, menuItems, tables]);

  const addTable = useCallback(async (tableData: Omit<Table, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTable = await api.addTable(tableData);
      setTables(prev => [...prev, newTable]);
      toast({ title: "Table Added", description: `Table ${newTable.number} has been added.` });
      fetchData(); // Refetch data
    } catch (error) {
      toast({ title: "Error", description: "Failed to add table.", variant: "destructive" });
    }
  }, [toast, fetchData]);

  const addOrder = useCallback(async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newOrder = await api.addOrder(orderData);
      setOrders(prev => [...prev, newOrder]);
      toast({ title: "Order Added", description: `Order for ${newOrder.customerName} has been added.` });
      fetchData(); // Refetch data
    } catch (error) {
      toast({ title: "Error", description: "Failed to add order.", variant: "destructive" });
    }
  }, [toast, fetchData]);

  const addMenuItem = useCallback(async (itemData: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newItem = await api.addMenuItem(itemData);
      setMenuItems(prev => [...prev, newItem]);
      toast({ title: "Menu Item Added", description: `${newItem.name} has been added.` });
      fetchData(); // Refetch data
    } catch (error) {
      toast({ title: "Error", description: "Failed to add menu item.", variant: "destructive" });
    }
  }, [toast, fetchData]);

  const addCategory = useCallback(async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newCategory = await api.addCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      toast({ title: "Category Added", description: `${newCategory.name} has been added.` });
      fetchData(); // Refetch data
    } catch (error) {
      toast({ title: "Error", description: "Failed to add category.", variant: "destructive" });
    }
  }, [toast, fetchData]);


  const getOrdersByStatus = useCallback((status?: Order['status']) => {
    return status ? orders.filter(order => order.status === status) : orders;
  }, [orders]);

  const getTablesByStatus = useCallback((status?: Table['status']) => {
    return status ? tables.filter(table => table.status === status) : tables;
  }, [tables]);

  const getMenuItemsByCategory = useCallback((category?: string) => {
    return category ? menuItems.filter(item => item.category === category) : menuItems;
  }, [menuItems]);

  return {
    tables,
    orders,
    menuItems,
    categories,
    customers,
    stats,
    loading,
    addTable,
    addOrder,
    addMenuItem,
    addCategory,
    getOrdersByStatus,
    getTablesByStatus,
    getMenuItemsByCategory,
  };
}
