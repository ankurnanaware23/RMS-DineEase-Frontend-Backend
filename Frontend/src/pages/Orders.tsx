import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRestaurantData } from '@/hooks/useRestaurantData';
import { AddOrderForm } from '@/components/forms/AddOrderForm';
import { Order } from '@/types';

export default function Orders() {
  const navigate = useNavigate();
  const { 
    orders, 
    menuItems, 
    tables, 
    addOrder, 
    updateOrderStatus, 
    getOrdersByStatus 
  } = useRestaurantData();
  const [activeFilter, setActiveFilter] = useState("All");

  const orderStatuses = [
    { label: "All", active: activeFilter === "All" },
    { label: "Pending", active: activeFilter === "Pending" },
    { label: "In Progress", active: activeFilter === "In Progress" },
    { label: "Ready", active: activeFilter === "Ready" },
    { label: "Completed", active: activeFilter === "Completed" },
  ];

  const filteredOrders = activeFilter === "All" ? orders : getOrdersByStatus(activeFilter as Order['status']);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-restaurant-orange';
      case 'In Progress':
        return 'bg-restaurant-blue';
      case 'Ready':
        return 'bg-restaurant-green';
      case 'Completed':
        return 'bg-muted';
      case 'Cancelled':
        return 'bg-restaurant-red';
      default:
        return 'bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'In Progress':
        return <Clock className="h-4 w-4" />;
      case 'Ready':
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="text-restaurant-blue"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 flex-wrap">
          {orderStatuses.map((status) => (
            <Button
              key={status.label}
              variant={status.active ? "default" : "outline"}
              size="sm"
              className={status.active ? "bg-muted text-foreground" : "border-border"}
              onClick={() => setActiveFilter(status.label)}
            >
              {status.label} ({status.label === "All" ? orders.length : getOrdersByStatus(status.label as Order['status']).length})
            </Button>
          ))}
        </div>
      </div>

      {/* Add Order Button */}
      <div className="mb-4">
        <AddOrderForm 
          onAddOrder={addOrder}
          menuItems={menuItems}
          tables={tables}
        />
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="bg-card border-border hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {/* Order Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {order.customerInitials}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{order.customerName}</div>
                    <div className="text-xs text-muted-foreground">ID: {order.id}</div>
                  </div>
                </div>
                <Badge className={`${getStatusColor(order.status)} text-white flex items-center gap-1`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </Badge>
              </div>

              {/* Order Details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="text-foreground font-medium">{order.orderType}</span>
                </div>
                {order.orderType === 'Dine In' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Table:</span>
                    <span className="text-foreground font-medium">Table {order.tableNumber}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="text-foreground font-medium">{order.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items:</span>
                  <span className="text-foreground font-medium">{order.items.length} items</span>
                </div>
              </div>

              {/* Order Total and Actions */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">₹{order.totalAmount}</span>
                </div>
                
                {/* Status Update Buttons */}
                <div className="flex gap-2">
                  {order.status === 'Pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusUpdate(order.id, 'In Progress')}
                      className="bg-restaurant-blue hover:bg-restaurant-blue/90 text-white flex-1"
                    >
                      Start Cooking
                    </Button>
                  )}
                  {order.status === 'In Progress' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusUpdate(order.id, 'Ready')}
                      className="bg-restaurant-green hover:bg-restaurant-green/90 text-white flex-1"
                    >
                      Mark Ready
                    </Button>
                  )}
                  {order.status === 'Ready' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusUpdate(order.id, 'Completed')}
                      className="bg-muted hover:bg-muted/90 text-foreground flex-1"
                    >
                      Mark Completed
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No orders found for the selected filter.</p>
        </div>
      )}
    </div>
  );
}
