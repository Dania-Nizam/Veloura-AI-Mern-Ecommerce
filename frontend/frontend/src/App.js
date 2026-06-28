import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatAgent from './components/ChatAgent';

// Pages
import Home from "./pages/Home";
import RegisterScreen from "./pages/RegisterScreen";
import Login from "./pages/Login";
import CartScreen from "./pages/CartScreen";
import ShippingScreen from "./pages/ShippingScreen";
import PlaceOrderScreen from "./pages/PlaceOrderScreen";
import PaymentScreen from "./pages/PaymentScreen";
import OrdersScreen from "./pages/OrdersScreen";
import OrderDetailsScreen from "./pages/OrderDetailsScreen";
import AdminDashboard from "./pages/AdminDashboard";
import WishlistScreen from "./pages/WishlistScreen";
import TrackOrder from "./pages/TrackOrder";
import ProductScreen from './pages/ProductScreen';
import ProfileScreen from "./pages/ProfileScreen";
import BestSellerScreen from './pages/BestSellerScreen';
import ElectronicsScreen from './pages/ElectronicScreen';
import FashionScreen from './pages/FashionScreen';
import HotDealsScreen from './pages/HotdealScreen';
import FragranceScreen from './pages/Fragrances';
import JewelryScreen from './pages/Jwelery';
import WatchScreen from './pages/Watch';
import BagScreen from './pages/Bag';
import SearchScreen from "./pages/Search";
import ShoeScreen from './pages/Shoes';
import CheckoutForm from "./components/CheckoutForm";
import PersonalCareScreen from './pages/Personalcare';
import MensClothingScreen from './pages/MensCloth';
import AccessoriesScreen from './pages/Accessories';
import WomensClothingScreen from "./pages/womens-cloths";
import CheckoutScreen from "./pages/Checkout";
// Scroll to Top Utility
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout Handler: Checks if current page is admin
// Layout Handler: Checks if current page is admin
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Hide Navbar on Admin pages */}
      {!isAdminPage && <Navbar />}

      <main className="w-full m-0 p-0 overflow-hidden flex-grow">
        {children}
      </main>

      {/* ✅ FIXED: Purana ChatAgent ab admin page par hide ho jayega */}
      {!isAdminPage && <ChatAgent />}

      {/* Hide Footer on Admin pages */}
      {!isAdminPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/shipping" element={<ShippingScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/my-orders" element={<OrdersScreen />} />
          <Route path="/order/:id" element={<OrderDetailsScreen />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/wishlist" element={<WishlistScreen />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path='/profile' element={<ProfileScreen />} />
          <Route path="/products" element={<BestSellerScreen />} />
          <Route path="/electronics" element={<ElectronicsScreen />} />
          <Route path="/fashion" element={<FashionScreen />} />
          <Route path="/offers" element={<HotDealsScreen />} />
          <Route path="/fragrances" element={<FragranceScreen />} />
          <Route path="/jewelry" element={<JewelryScreen />} />
          <Route path="/watches" element={<WatchScreen />} />
          <Route path="/bags" element={<BagScreen />} />
          <Route path="/search/:keyword" element={<SearchScreen />} />
          <Route path="/shoes" element={<ShoeScreen />} />
          // App.js ke routes mein ye change karein
          <Route path="/checkout" element={<CheckoutScreen />} />
          <Route path="/product/:id" element={<ProductScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/track-order/:id" element={<TrackOrder />} />
          <Route path="/care" element={<PersonalCareScreen />} />
          <Route path="/mens-clothing" element={<MensClothingScreen />} />
          <Route path="/womens-cloths" element={<WomensClothingScreen/>} />
          <Route path="/accessories" element={<AccessoriesScreen/>} />



        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;