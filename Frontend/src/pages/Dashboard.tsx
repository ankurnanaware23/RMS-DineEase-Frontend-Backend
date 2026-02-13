import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, Users, Calendar, Search, TrendingUp, TrendingDown } from "lucide-react";
import { useRestaurantData } from '@/hooks/useRestaurantData';
import { AddTableForm } from '@/components/forms/AddTableForm';
import { AddOrderForm } from '@/components/forms/AddOrderForm';
import { AddCategoryForm } from '@/components/forms/AddCategoryForm';
import { AddDishForm } from '@/components/forms/AddDishForm';
import api from '@/lib/api';

export default function Dashboard() {
  const {
    tables,
    orders,
    menuItems,
    categories,
    stats,
    loading,
    addTable,
    addOrder,
    addCategory,
    addMenuItem,
    getOrdersByStatus,
  } = useRestaurantData();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserName] = useState('Guest');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get('/api/user/profile/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const { first_name, last_name } = response.data;
        setUserName(`${first_name} ${last_name}`.trim() || 'Guest');
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUserData();
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Dynamic metrics based on real data
  if (loading || !stats) {
    return <div>Loading...</div>; 
  }

  const metrics = [
    {
      title: "Today's Earning",
      value: stats.totalEarnings.toString(),
      change: "1.6%",
      changeType: "increase",
      icon: DollarSign,
      color: "bg-restaurant-green",
    },
    {
      title: "In Progress",
      value: stats.inProgressOrders.toString(),
      change: "3.6%",
      changeType: "increase",
      icon: Clock,
      color: "bg-restaurant-orange",
    },
  ];

  const itemDetails = [
    {
      title: "Total Categories",
      value: stats.totalCategories.toString(),
      change: "12%",
      color: "bg-restaurant-purple",
    },
    {
      title: "Total Dishes",
      value: stats.totalDishes.toString(),
      change: "12%",
      color: "bg-restaurant-green",
    },
    {
      title: "Active Orders",
      value: stats.activeOrders.toString(),
      change: "12%",
      color: "bg-restaurant-brown",
    },
    {
      title: "Total Tables",
      value: stats.totalTables.toString(),
      change: "",
      color: "bg-restaurant-purple",
    },
  ];

  // Filter recent orders based on search
  const recentOrders = getOrdersByStatus('Ready')
    .filter(order => 
      searchTerm === '' || 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5);

  // Calculate popular dishes from order data
  const dishCounts = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      acc[item.name] = (acc[item.name] || 0) + item.quantity;
    });
    return acc;
  }, {} as Record<string, number>);

  const popularDishes = Object.entries(dishCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count], index) => ({
      rank: (index + 1).toString().padStart(2, '0'),
      name,
      orders: count.toString(),
      image: "🍽️", // Default emoji
    }));

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good Morning, {userName}</h1>
          <p className="text-muted-foreground">Give your best services for customers 😊</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">{formatTime(currentTime)}</div>
          <div className="text-muted-foreground">{formatDate(currentTime)}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        <AddTableForm onAddTable={addTable} existingTables={tables} />
        <AddCategoryForm onAddCategory={addCategory} />
        <AddDishForm onAddDish={addMenuItem} categories={categories} />
        <div className="ml-auto flex gap-2">
          <AddOrderForm 
            onAddOrder={addOrder}
            menuItems={menuItems}
            tables={tables}
          />
          <Link to="/overall-performance">
            <Button variant="outline">Overall Performance</Button>
          </Link>
        </div>
      </div>

      {/* Today's Performance */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Today's Performance</h2>
            <p className="text-sm text-muted-foreground">A summary of your restaurant's performance for today.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {metric.title === "Today's Earning" ? `₹${metric.value}` : metric.value}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {metric.changeType === "increase" ? (
                        <TrendingUp className="h-3 w-3 text-restaurant-green" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-restaurant-red" />
                      )}
                      <span className={`text-xs ${metric.changeType === "increase" ? "text-restaurant-green" : "text-restaurant-red"}`}>
                        {metric.change} than yesterday
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center`}>
                    <metric.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Additional cards for the 4-card layout */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Total Customer</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalCustomers}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-restaurant-green" />
                    <span className="text-xs text-restaurant-green">10% than yesterday</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-restaurant-orange rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Item Details */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">Item Details</h2>
          <p className="text-sm text-muted-foreground">A summary of your restaurant's item details.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {itemDetails.map((item, index) => (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{item.title}</p>
                    <p className="text-2xl font-bold text-foreground">{item.value}</p>
                    {item.change && (
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-restaurant-green" />
                        <span className="text-xs text-restaurant-green">{item.change}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Orders and Popular Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">Recent Orders</h2>
            <Link to="/all-orders">
              <Button variant="link" className="text-restaurant-blue">View all</Button>
            </Link>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recent orders"
              className="pl-10 bg-card border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-semibold">
                        {order.customerInitials}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">{order.items.length} Items</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-restaurant-orange text-white mb-1">Table No: {order.tableNumber}</Badge>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-restaurant-green rounded-full"></div>
                          <span className="text-sm text-restaurant-green">{order.status}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Ready to serve</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Dishes */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">Popular Dishes</h2>
            <Link to="/all-dishes">
              <Button variant="link" className="text-restaurant-blue">View all</Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {popularDishes.map((dish) => (
              <Card key={dish.rank} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-muted-foreground">{dish.rank}</div>
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-lg">
                      {dish.image}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{dish.name}</div>
                      <div className="text-sm text-muted-foreground">Orders: {dish.orders}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
