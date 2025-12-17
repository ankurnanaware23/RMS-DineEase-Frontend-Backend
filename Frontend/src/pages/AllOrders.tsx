import { useRestaurantData } from '@/hooks/useRestaurantData';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AllOrders() {
  const { orders } = useRestaurantData();

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground">All Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Card key={order.id} className="bg-card border-border">
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
                      <div className={`w-2 h-2 ${order.status === 'Ready' ? 'bg-restaurant-green' : 'bg-restaurant-yellow'} rounded-full`}></div>
                      <span className={`text-sm ${order.status === 'Ready' ? 'text-restaurant-green' : 'text-restaurant-yellow'}`}>{order.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}