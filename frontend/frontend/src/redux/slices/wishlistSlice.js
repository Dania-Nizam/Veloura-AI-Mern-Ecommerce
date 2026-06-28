import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🌐 ASYNC THUNK: Sirf database sync ke liye alag se background call
export const addWishlistDB = createAsyncThunk(
  "wishlist/addWishlistDB",
  async (product, { getState, rejectWithValue }) => {
    try {
      const { userLogin } = getState();
      // Apne authentication object ke state structure ke mutabiq check karein
      const userInfo = userLogin?.userInfo || JSON.parse(localStorage.getItem('userInfo'));
      
      const config = userInfo?.token 
        ? { headers: { "Content-Type": "application/json", Authorization: `Bearer ${userInfo.token}` } } 
        : {};

      // Agar url poora nahi hai toh port specify karein 'http://localhost:5000/api/wishlist'
      const { data } = await axios.post("http://localhost:5000/api/wishlist", { productId: product._id }, config);
      return data.items || data;
    } catch (error) {
      return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlistItems: localStorage.getItem("wishlistItems")
      ? JSON.parse(localStorage.getItem("wishlistItems"))
      : [],
    loading: false,
    error: null,
  },
  reducers: {
    setWishlist: (state, action) => {
      state.wishlistItems = action.payload;
      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlistItems));
    },
    // ✨ FIX 1: Pure synchronous function ko wapas laya gaya taaki click event instantly local state update kare
    addToWishlist: (state, action) => {
      const item = action.payload;
      if (!state.wishlistItems) state.wishlistItems = [];
      
      // MERN/Python custom structures fallback dynamic tracking
      const existItem = state.wishlistItems.find(
        (x) => (x._id === item._id) || 
               (x.productId && (x.productId === item._id || x.productId._id === item._id)) ||
               (x.product && x.product === item._id)
      );
      
      if (!existItem) {
        state.wishlistItems.push(item);
      }
      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlistItems));
    },
    removeFromWishlist: (state, action) => {
      state.wishlistItems = state.wishlistItems.filter(
        (x) => x._id !== action.payload && 
               x.productId !== action.payload && 
               (!x.productId || x.productId._id !== action.payload) &&
               x.product !== action.payload
      );
      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlistItems));
    },
  },
extraReducers: (builder) => {
    builder
      .addCase(addWishlistDB.fulfilled, (state, action) => {
        
        if (action.payload && Array.isArray(action.payload) && action.payload.length > 0) {
          state.wishlistItems = action.payload;
          localStorage.setItem("wishlistItems", JSON.stringify(state.wishlistItems));
        }
        
      });
  },
});

// Reducers actions standard synchronous export
export const { setWishlist, addToWishlist, removeFromWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;