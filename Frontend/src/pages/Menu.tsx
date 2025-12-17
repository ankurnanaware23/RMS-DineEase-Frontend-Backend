import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Minus, ShoppingCart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const menuData = {
  Starters: {
    Veg: [
      { name: "Paneer Tikka", price: 250, quantity: 0 },
      { name: "Samosa", price: 100, quantity: 0 },
      { name: "Aloo Tikki", price: 120, quantity: 0 },
      { name: "Hara Bhara Kebab", price: 220, quantity: 0 },
      { name: "Chilli Paneer", price: 280, quantity: 0 },
      { name: "Veg Crispy", price: 260, quantity: 0 },
    ],
    "Non-Veg": [
      { name: "Chicken Tikka", price: 300, quantity: 0 },
      { name: "Tandoori Chicken", price: 350, quantity: 0 },
      { name: "Chicken 65", price: 320, quantity: 0 },
    ],
  },
  "Main Course": {
    Veg: [
      { name: "Paneer Butter Masala", price: 350, quantity: 0 },
      { name: "Dal Makhani", price: 300, quantity: 0 },
      { name: "Veg Kolhapuri", price: 320, quantity: 0 },
    ],
    "Non-Veg": [
      { name: "Butter Chicken", price: 450, quantity: 0 },
      { name: "Chicken Handi", price: 480, quantity: 0 },
      { name: "Fish Curry", price: 550, quantity: 0 },
    ],
  },
  Beverages: {
    Veg: [
      { name: "Coke", price: 50, quantity: 0 },
      { name: "Lassi", price: 80, quantity: 0 },
      { name: "Masala Chai", price: 60, quantity: 0 },
      { name: "Fresh Lime Soda", price: 70, quantity: 0 },
      { name: "Iced Tea", price: 90, quantity: 0 },
    ],
  },
  Soups: {
    Veg: [
        { name: "Tomato Soup", price: 120, quantity: 0 },
        { name: "Sweet Corn Soup", price: 140, quantity: 0 },
    ],
    "Non-Veg": [
        { name: "Manchow Soup", price: 150, quantity: 0 },
        { name: "Hot and Sour Soup", price: 160, quantity: 0 },
    ],
  },
  Desserts: {
    Veg: [
      { name: "Gulab Jamun", price: 100, quantity: 0 },
      { name: "Rasmalai", price: 120, quantity: 0 },
      { name: "Ice Cream", price: 150, quantity: 0 },
      { name: "Cheesecake", price: 250, quantity: 0 },
    ],
  },
  Pizzas: {
    Veg: [
      { name: "Margherita Pizza", price: 300, quantity: 0 },
      { name: "Veggie Supreme Pizza", price: 380, quantity: 0 },
      { name: "Farmhouse Pizza", price: 400, quantity: 0 },
    ],
    "Non-Veg": [
      { name: "Pepperoni Pizza", price: 350, quantity: 0 },
    ],
  },
  Salads: {
    Veg: [
      { name: "Green Salad", price: 150, quantity: 0 },
      { name: "Greek Salad", price: 220, quantity: 0 },
    ],
    "Non-Veg": [
      { name: "Caesar Salad", price: 200, quantity: 0 },
    ]
  },
  Breads: {
    Veg: [
        { name: "Roti", price: 20, quantity: 0 },
        { name: "Naan", price: 30, quantity: 0 },
        { name: "Garlic Naan", price: 40, quantity: 0 },
        { name: "Paratha", price: 35, quantity: 0 },
    ],
  },
  Rice: {
    Veg: [
        { name: "Steamed Rice", price: 100, quantity: 0 },
        { name: "Jeera Rice", price: 120, quantity: 0 },
        { name: "Veg Pulao", price: 180, quantity: 0 },
    ],
    "Non-Veg": [
        { name: "Chicken Biryani", price: 280, quantity: 0 },
    ],
  },
};

const categories = [
  { name: "Starters", emoji: "🔥", color: "bg-restaurant-red" },
  { name: "Main Course", emoji: "🍛", color: "bg-restaurant-purple" },
  { name: "Beverages", emoji: "🥤", color: "bg-restaurant-purple" },
  { name: "Soups", emoji: "🍲", color: "bg-restaurant-brown" },
  { name: "Desserts", emoji: "🍰", color: "bg-restaurant-blue" },
  { name: "Pizzas", emoji: "🍕", color: "bg-restaurant-green" },
  { name: "Salads", emoji: "🥗", color: "bg-restaurant-purple" },
  { name: "Breads", emoji: "🍞", color: "bg-restaurant-orange" },
  { name: "Rice", emoji: "🍚", color: "bg-restaurant-blue" },
];

const tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const VegIcon = () => (
  <div className="w-6 h-6 flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="2" ry="2" fill="none" stroke="green" strokeWidth="2"/>
      <circle cx="12" cy="12" r="6" fill="green" />
    </svg>
  </div>
);

const NonVegIcon = () => (
  <div className="w-6 h-6 flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="2" ry="2" fill="none" stroke="red" strokeWidth="2"/>
      <circle cx="12" cy="12" r="6" fill="red" />
    </svg>
  </div>
);

export default function Menu() {
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState<{ [table: string]: { [key: string]: number } }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Starters");
  const [selectedTable, setSelectedTable] = useState("1");

  const updateQuantity = (itemName: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [selectedTable]: {
        ...prev[selectedTable],
        [itemName]: Math.max(0, ((prev[selectedTable] && prev[selectedTable][itemName]) || 0) + change),
      }
    }));
  };

  const categoryItems = menuData[selectedCategory as keyof typeof menuData] || {};
  const vegItems = (categoryItems.Veg || []).filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const nonVegItems = (categoryItems["Non-Veg"] || []).filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const currentOrderItems = Object.entries((quantities[selectedTable] || {})).map(([name, quantity]) => {
    const allItems = [...(categoryItems.Veg || []), ...(categoryItems["Non-Veg"] || [])];
    const item = allItems.find(i => i.name === name);
    return { name, quantity, price: item ? item.price * quantity : 0 };
  }).filter(item => item.quantity > 0);

  const subtotal = currentOrderItems.reduce((acc, item) => acc + item.price, 0);
  const tax = subtotal * 0.0525;
  const total = subtotal + tax;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Section */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(-1)}
                className="text-restaurant-blue"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Menu</h1>
            </div>
            <div className="w-40">
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger className="bg-card border-border">
                  <SelectValue placeholder="Select Table" />
                </SelectTrigger>
                <SelectContent>
                  {tables.map(table => (
                    <SelectItem key={table} value={String(table)}>Table {table}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search in ${selectedCategory}...`}
              className="pl-10 bg-card border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {categories.map((category) => (
              <Card 
                key={category.name} 
                className={`${category.color} border-0 cursor-pointer hover:opacity-90 transition-opacity ${selectedCategory === category.name ? 'ring-2 ring-white' : ''}`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{category.emoji}</div>
                  <div className="text-white font-semibold text-sm mb-1">{category.name}</div>
                  <div className="text-white/80 text-xs">
                    {(menuData[category.name as keyof typeof menuData]?.Veg?.length || 0) + (menuData[category.name as keyof typeof menuData]?.["Non-Veg"]?.length || 0)} Items
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Menu Items */}
          <div>
            {vegItems.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <VegIcon />
                  <h2 className="text-xl font-bold text-foreground">Veg</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vegItems.map((item) => (
                    <Card key={item.name} className="bg-card border-border">
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <h3 className="font-semibold text-foreground mb-2">{item.name}</h3>
                          <div className="text-xl font-bold text-foreground">₹{item.price}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.name, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {(quantities[selectedTable] && quantities[selectedTable][item.name]) || 0}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.name, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button size="sm" className="bg-restaurant-green hover:bg-restaurant-green/90">
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {nonVegItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <NonVegIcon />
                  <h2 className="text-xl font-bold text-foreground">Non-Veg</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nonVegItems.map((item) => (
                    <Card key={item.name} className="bg-card border-border">
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <h3 className="font-semibold text-foreground mb-2">{item.name}</h3>
                          <div className="text-xl font-bold text-foreground">₹{item.price}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.name, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {(quantities[selectedTable] && quantities[selectedTable][item.name]) || 0}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.name, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button size="sm" className="bg-restaurant-green hover:bg-restaurant-green/90">
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border sticky top-4">
            <CardContent className="p-6">
              {/* Customer Info */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-semibold">
                    🍽️
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Customer Name</div>
                    <div className="text-sm text-muted-foreground">Table No: {selectedTable}</div>
                    <div className="text-xs text-muted-foreground">{new Date().toLocaleString()}</div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                  CN
                </div>
              </div>

              {/* Order Details */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-4">Order Details</h3>
                
                <div className="space-y-3">
                  {currentOrderItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-foreground">{item.name}</div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-foreground">₹{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Items({currentOrderItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
                  <span className="text-sm font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Tax(5.25%)</span>
                  <span className="text-sm font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-restaurant-blue border-restaurant-blue">
                  Print Receipt
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90">
                  Place Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}