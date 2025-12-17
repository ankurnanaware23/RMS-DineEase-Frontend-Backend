import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useRestaurantData } from "@/hooks/useRestaurantData";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function OverallPerformance() {
  const { stats, orders, loading } = useRestaurantData();

  if (loading || !stats) {
    return <div>Loading...</div>;
  }

  const metrics = [
    {
      title: "Revenue",
      value: `₹${stats.totalEarnings.toFixed(2)}`,
      change: "12%",
      changeType: "decrease",
      color: "bg-blue-600",
    },
    {
      title: "Outbound Clicks",
      value: "10,342",
      change: "16%",
      changeType: "increase",
      color: "bg-green-500",
    },
    {
      title: "Total Customer",
      value: stats.totalCustomers.toString(),
      change: "10%",
      changeType: "increase",
      color: "bg-yellow-500",
    },
    {
      title: "Event Count",
      value: stats.eventCount.toString(),
      change: "10%",
      changeType: "decrease",
      color: "bg-red-500",
    },
  ];

  const salesData = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    const existingEntry = acc.find(entry => entry.date === date);
    if (existingEntry) {
      existingEntry.sales += order.totalAmount;
    } else {
      acc.push({ date, sales: order.totalAmount });
    }
    return acc;
  }, [] as { date: string; sales: number }[]);

  return (
    <div className="p-4 space-y-8 max-w-7xl mx-auto">
      {/* Overall Performance Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Overall Performance</h2>
            <p className="text-sm text-muted-foreground">A summary of your restaurant's overall performance.</p>
          </div>
          <Button variant="outline" size="sm">Last 1 Month ⌄</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index} className={`${metric.color} text-white`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm">{metric.title}</p>
                    <p className="text-3xl font-bold">{metric.value}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    {metric.changeType === "increase" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{metric.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sales Details Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
