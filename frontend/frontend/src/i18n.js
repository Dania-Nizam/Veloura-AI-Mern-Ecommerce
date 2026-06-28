import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // --- Navbar & General ---
      "welcome": "Welcome",
      "cart": "Cart",
      "logout": "Logout",
      "logout_confirm": "Do you really want to logout?",
      "login": "Login",
      "total": "Total Amount",
      "admin_panel": "Admin Panel",
      "my_orders": "My Orders",
      "wishlist": "Wishlist",
      "wishlist_empty": "Your wishlist is empty",
      "track_order": "Track Order",

      // --- Login Page ---
      "login_title": "Welcome Back",
      "login_subtitle": "Please enter your details",
      "email_label": "Email Address",
      "password_label": "Password",
      "signin_btn": "Sign In",
      "auth_loading": "Authenticating...",
      "no_account": "Don't have an account?",
      "register": "Register",

      // --- Cart Screen ---
      "cart_title": "Your Shopping Cart",
      "empty_cart": "Your cart is empty",
      "go_back": "Go Back",
      "price": "Price",
      "quantity": "Qty",
      "subtotal": "Subtotal",
      "checkout_btn": "Proceed to Checkout",
      "remove": "Remove",

      // --- Track Order ---
      "enter_order_id": "Enter your Order ID",
      "track_btn": "Track Now",
      "order_placed": "Order Placed",
      "shipped": "Shipped",
      "out_for_delivery": "Out for Delivery",
      "delivered": "Delivered",

      // --- Footer ---
      "all_products": "All Products",
      "footer_desc": "Your trusted online store. Best quality and fast delivery are our hallmark.",
      "shop": "Shop",
      "shopping_cart": "Shopping Cart",
      "order_history": "Order History",
      "support": "Support",
      "privacy_policy": "Privacy Policy",
      "terms_conditions": "Terms & Conditions",
      "connect": "Connect",
      "rights": "All Rights Reserved"
    }
  },
  ur: {
    translation: {
      // --- Navbar & General ---
      "welcome": "خوش آمدید",
      "cart": "کارٹ",
      "logout": "لاگ آؤٹ",
      "logout_confirm": "کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟",
      "login": "لاگ ان",
      "total": "کل رقم",
      "admin_panel": "ایڈمن پینل",
      "my_orders": "میرے آرڈرز",
      "wishlist": "پسندیدہ",
      "wishlist_empty": "آپ کی پسندیدہ فہرست خالی ہے",
      "track_order": "آرڈر ٹریک کریں",

      // --- Login Page ---
      "login_title": "خوش آمدید",
      "login_subtitle": "براہ کرم اپنی تفصیلات درج کریں",
      "email_label": "ای میل ایڈریس",
      "password_label": "پاس ورڈ",
      "signin_btn": "سائن ان کریں",
      "auth_loading": "تصدیق ہو رہی ہے...",
      "no_account": "اکاؤنٹ نہیں ہے؟",
      "register": "رجسٹر کریں",

      // --- Cart Screen ---
      "cart_title": "آپ کی شاپنگ کارٹ",
      "empty_cart": "آپ کی کارٹ خالی ہے",
      "go_back": "واپس جائیں",
      "price": "قیمت",
      "quantity": "تعداد",
      "subtotal": "کل رقم",
      "checkout_btn": "چیک آؤٹ کی طرف بڑھیں",
      "remove": "ختم کریں",

      // --- Track Order ---
      "enter_order_id": "آرڈر آئی ڈی درج کریں",
      "track_btn": "ابھی ٹریک کریں",
      "order_placed": "آرڈر بک ہو گیا",
      "shipped": "روانہ کر دیا گیا",
      "out_for_delivery": "پہنچنے والا ہے",
      "delivered": "پہنچ گیا",

      // --- Footer ---
      "all_products": "تمام مصنوعات",
      "footer_desc": "آپ کا قابل اعتماد آن لائن اسٹور۔ بہترین معیار اور تیز ترسیل ہماری پہچان ہے۔",
      "shop": "دکان",
      "shopping_cart": "شاپنگ کارٹ",
      "order_history": "آرڈر کی تاریخ",
      "support": "سپورٹ",
      "privacy_policy": "رازداری کی پالیسی",
      "terms_conditions": "شرائط و ضوابط",
      "connect": "رابطہ کریں",
      "rights": "جملہ حقوق محفوظ ہیں"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;