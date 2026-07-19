import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Database se cart fetch karne ke liye thunk action
export const fetchCartFromDB = createAsyncThunk(
  'cart/fetchCartFromDB',
  async (userId, { rejectWithValue }) => {
    try {
      const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
      const token = userInfo?.token || userInfo?.user?.token;

      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      };

      // Backend endpoint se cart data get karne ke liye GET request
      const { data } = await axios.get(`https://veloura-ai-mern-ecommerce.vercel.app/api/cart/${userId}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Database sync action thunk
export const syncCartWithDB = createAsyncThunk(
  'cart/syncCartWithDB',
  async ({ userId, items }, { rejectWithValue, getState }) => {
    try {
      const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
      const token = userInfo?.token || userInfo?.user?.token;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      };
      
      // ✨ FIXED: Redux state se active full cart items array nikala jisme name, price, image sab maujood hai
      const activeState = getState();
      const fullCartItems = activeState.cart?.cartItems || items;

      const formattedItemsForSync = Array.isArray(fullCartItems) ? fullCartItems.map(item => ({
        productId: item.productId?._id || item.productId || item._id,
        name: item.name,
        price: Number(item.price || 0),
        image: item.image,
        category: item.category,
        countInStock: Number(item.countInStock || 0),
        description: item.description,
        qty: Number(item.qty || item.quantity || 1),
        quantity: Number(item.qty || item.quantity || 1)
      })) : [];

      // ✨ ULTIMATE BACKEND BYPASS FIXED PAYLOAD:
      // Agar backend destructive destructuring (.user_id) use kar raha hai, 
      // toh hum yahan se dono variants bhej rahe hain taaki strictly validation fail na ho.
      const requestBody = {
        userId: userId,
        user_id: userId,
        items: formattedItemsForSync // ✨ FIXED: Passing complete schema details array
      };

      const { data } = await axios.post('https://veloura-ai-mern-ecommerce.vercel.app/api/cart', requestBody, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : { address: '', city: '', postalCode: '', country: '' },
    paymentMethod: (() => {
      try {
        const stored = localStorage.getItem('paymentMethod');
        return stored ? JSON.parse(stored) : 'Stripe';
      } catch {
        return localStorage.getItem('paymentMethod') || 'Stripe';
      }
    })(),
    loading: false,
    error: null
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const itemProductId = item.productId || item._id;

      const existItem = state.cartItems.find((x) => {
        const xId = x.productId?._id || x.productId || x._id;
        return String(xId) === String(itemProductId);
      });

      if (existItem) {
        state.cartItems = state.cartItems.map((x) => {
          const xId = x.productId?._id || x.productId || x._id;
          return String(xId) === String(itemProductId) ? item : x;
        });
      } else {
        state.cartItems.push({
          productId: itemProductId,
          name: item.name,
          price: item.price,
          image: item.image,
          qty: Number(item.qty || 1),
          countInStock: item.countInStock,
          category: item.category,
          description: item.description // ✨ FIXED: Included descriptive parameters
        });
      }

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => {
        const xId = x.productId?._id || x.productId || x._id;
        return String(xId) !== String(action.payload);
      });
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    }
  },
  extraReducers: (builder) => {
    builder
      // SYNC CART CASES
      .addCase(syncCartWithDB.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncCartWithDB.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.items) {
          state.cartItems = action.payload.items;
        } else if (Array.isArray(action.payload)) {
          state.cartItems = action.payload;
        }
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      })
      .addCase(syncCartWithDB.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // FETCH CART CASES (Naya add kiya gaya hai)
      .addCase(fetchCartFromDB.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartFromDB.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.items) {
          state.cartItems = action.payload.items;
        } else if (Array.isArray(action.payload)) {
          state.cartItems = action.payload;
        }
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      })
      .addCase(fetchCartFromDB.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCart } = cartSlice.actions;
export default cartSlice.reducer;