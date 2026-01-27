
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Menu from "@/pages/Menu";
import Orders from "@/pages/Orders";
import Tables from "@/pages/Tables";
import AllDishes from "@/pages/AllDishes";
import AllOrders from "@/pages/AllOrders";
import OverallPerformance from "@/pages/OverallPerformance";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { Toaster } from "sonner";


export default function App() {
  return (
    <Router>
     {/* <Toaster /> */}
     <Toaster richColors position="bottom-right" />
      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* Private routes */}
        <Route path="/" element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="menu" element={<Menu />} />
            <Route path="orders" element={<Orders />} />
            <Route path="tables" element={<Tables />} />
            <Route path="all-dishes" element={<AllDishes />} />
            <Route path="all-orders" element={<AllOrders />} />
            <Route path="overall-performance" element={<OverallPerformance />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}



// ------------------------------------------------
//  this bellow given lines are only for testing purpose


// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { Layout } from "@/components/Layout";
// import Dashboard from "@/pages/Dashboard";
// import Menu from "@/pages/Menu";
// import Orders from "@/pages/Orders";
// import Tables from "@/pages/Tables";
// import AllDishes from "@/pages/AllDishes";
// import AllOrders from "@/pages/AllOrders";
// import OverallPerformance from "@/pages/OverallPerformance";
// import NotFound from "@/pages/NotFound";
// import Profile from "@/pages/Profile";
// import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";
// import { Toaster } from "sonner";

// export default function App() {
//   return (
//     <Router>
//       <Toaster />
//       <Routes>
//         {/* Auth pages (still accessible) */}
//         <Route path="/signin" element={<SignIn />} />
//         <Route path="/signup" element={<SignUp />} />

//         {/* App pages (NO AUTH for now) */}
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Navigate to="/dashboard" replace />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="menu" element={<Menu />} />
//           <Route path="orders" element={<Orders />} />
//           <Route path="tables" element={<Tables />} />
//           <Route path="all-dishes" element={<AllDishes />} />
//           <Route path="all-orders" element={<AllOrders />} />
//           <Route path="overall-performance" element={<OverallPerformance />} />
//           <Route path="profile" element={<Profile />} />
//         </Route>

//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Router>
//   );
// }


