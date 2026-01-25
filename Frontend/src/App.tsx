
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Menu from "@/pages/Menu";
import Orders from "@/pages/Orders";
import Tables from "@/pages/Tables";
import AllDishes from "@/pages/AllDishes";
import AllOrders from "@/pages/AllOrders";
import OverallPerformance from "@/pages/OverallPerformance";
import NotFound from "@/pages/NotFound";
import Index from "./pages/Index";
import Profile from "@/pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="menu" element={<Menu />} />
          <Route path="orders" element={<Orders />} />
          <Route path="tables" element={<Tables />} />
          <Route path="all-dishes" element={<AllDishes />} />
          <Route path="all-orders" element={<AllOrders />} />
          <Route path="overall-performance" element={<OverallPerformance />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}
