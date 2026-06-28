import axios from 'axios';
import Swal from 'sweetalert2';
import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
} from "../constants/userConstants";

// --- Utility for Sleek Toast (Terminal/Dark Style) ---
const showToast = (title, icon = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#0a0d14', // Your sleek dark background
    color: '#fff',
  });

  Toast.fire({
    iconHtml: icon === 'success' 
      ? '<div style="color: #3b82f6;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>'
      : undefined,
    icon: icon !== 'success' ? icon : undefined,
    title: `<span style="font-family: system-ui; font-weight: 800; font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase;">${title}</span>`,
    customClass: {
      popup: 'rounded-xl border border-white/10 shadow-2xl',
    }
  });
};

// --- Register Action ---
export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post('/api/users/register', { name, email, password }, config);

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
    showToast('Node Registered Successfully');
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch({ type: USER_REGISTER_FAIL, payload: message });
    showToast(message, 'error');
  }
};

// --- Login Action ---
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post('/api/users/login', { email, password }, config);

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
    showToast('Session Initialized');
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch({ type: USER_LOGIN_FAIL, payload: message });
    showToast(message, 'error');
  }
};

// --- Logout Action (Replacing the big white modal) ---
export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: 'USER_LOGOUT' });
  // Add any other reset constants here (e.g., USER_DETAILS_RESET)
  
  showToast('Session Terminated', 'info');
  
  // Optional: Redirect to login
  // window.location.href = '/login';
};

// --- Update Profile Action ---
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'USER_UPDATE_PROFILE_REQUEST' });

    const { userLogin: { userInfo } } = getState();

    // Double check token availability
    if (!userInfo || !userInfo.token) {
      throw new Error("Authorization failed. Please login again.");
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // Note: URL matches your previous failed requests
    const { data } = await axios.put(`http://localhost:5000/api/users/profile`, user, config);

    dispatch({ type: 'USER_UPDATE_PROFILE_SUCCESS', payload: data });
    dispatch({ type: 'USER_LOGIN_SUCCESS', payload: data }); 

    localStorage.setItem('userInfo', JSON.stringify(data));
    showToast('Profile Parameters Updated');

  } catch (error) {
    const message = error.response?.data?.message || error.message;
    
    // Agar token expire ho jaye toh auto-logout bhi trigger kar sakte hain
    if (message.includes('Not authorized') || message.includes('token failed')) {
      dispatch(logout());
    }

    dispatch({
      type: 'USER_UPDATE_PROFILE_FAIL',
      payload: message,
    });
    showToast(message, 'error');
  }
};