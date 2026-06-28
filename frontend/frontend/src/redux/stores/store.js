import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../slices/cartSlice'; // ✨ Path aligned properly to slices
import wishlistReducer from '../slices/wishlistSlice';
import { userRegisterReducer, userLoginReducer } from '../reducers/userReducers';

// 🔐 Local storage se logged-in user ki details nikalen taake page reload par crash na ho
const userInfoFromStorage = (() => {
  try {
    const item = localStorage.getItem('userInfo');
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
})();

console.log("🏪 Store initialized with Cart and User state!");

export const store = configureStore({
  reducer: {
    cart: cartReducer,           // 🔥 LINKED CORRECTLY: Ab undefined ka error nahi aayega
    wishlist: wishlistReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
  },
  // ✨ FIXED: User login state hydration from local storage saved
  preloadedState: {
    userLogin: { userInfo: userInfoFromStorage },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;