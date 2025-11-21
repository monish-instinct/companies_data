import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import StripeDemo from "./pages/StripeDemo";
import Wishlist from "./pages/Wishlist";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Offers from "./pages/Offers";
import HelpSupport from "./pages/HelpSupport";
import Notifications from "./pages/Notifications";
import AboutUs from "./pages/AboutUs";
import TermsAndPolicies from "./pages/TermsAndPolicies";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/order/:id/confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
            <Route path="/order/:id/track" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/account/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/account/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/help" element={<HelpSupport />} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/terms" element={<TermsAndPolicies />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/pay/stripe-demo" element={<StripeDemo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;