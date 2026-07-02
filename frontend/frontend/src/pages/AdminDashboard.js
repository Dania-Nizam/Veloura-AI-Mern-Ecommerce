import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import AdminChatAgent from "../components/AdminChatAgent"; 

import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  LineChart, Line
} from "recharts";
import {
  ShoppingBag, Users, TrendingUp, Package, Trash2, LogOut, ShieldCheck,
  AlertTriangle, DollarSign, CheckCircle, Clock, BarChart2, Plus, Eye
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("all"); // 'today', 'week', 'month', 'all'
  
  // 🆕 Real-world Management Modals State
  const [selectedOrder, setSelectedOrder] = useState(null);

  const itemsPerPage = 5;
  const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

  // 🎨 Luxury Hero Theme Colors for Charts
  const PIE_COLORS = ['#1f1f1f', '#8d8070', '#b5a897', '#d9cfc1'];
  const BAR_COLORS = ['#1f1f1f', '#3a3530', '#615951', '#8d8070', '#b5a897', '#d9cfc1'];

  const getAuthConfig = useCallback(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return {
      headers: { Authorization: `Bearer ${userInfo?.token}` },
    };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const config = getAuthConfig();
      
      const [orderRes, userRes, productRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/admin/orders`, config),
        axios.get(`${API_BASE}/users`, config),
        axios.get(`${API_BASE}/products`)
      ]);

      if (orderRes.status === 'fulfilled') setOrders(orderRes.value.data || []);
      if (userRes.status === 'fulfilled') setUsers(userRes.value.data || []);
      if (productRes.status === 'fulfilled') setProducts(productRes.value.data || []);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [getAuthConfig]);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, [navigate, fetchData]);

  const logoutHandler = () => {
    Swal.fire({
      title: 'Logout?',
      text: "End your current admin session?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1f1f1f',
      cancelButtonColor: '#efe7dd',
      confirmButtonText: 'Logout',
      background: '#faf7f2',
      color: '#1f1f1f'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("userInfo");
        window.location.href = "/"; 
      }
    });
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const { data } = await axios.put(`${API_BASE}/orders/${id}/status`, { status }, getAuthConfig());
      setOrders(orders.map((o) => (o._id === id ? { ...o, status: data.status } : o)));
      Swal.fire({ title: "Updated!", icon: "success", timer: 800, showConfirmButton: false, background: '#faf7f2', color: '#1f1f1f' });
    } catch (err) { Swal.fire({ title: "Error", text: "Update failed", icon: "error", background: '#faf7f2', color: '#1f1f1f' }); }
  };

  const deleteHandler = async (id, type) => {
    // Check parameters target key fallback
    const targetId = id?._id || id;
    
    const result = await Swal.fire({ 
      title: 'Are you sure?', 
      text: "You won't be able to revert this asset!",
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#1f1f1f', 
      cancelButtonColor: '#efe7dd',
      background: '#faf7f2', 
      color: '#1f1f1f' 
    });

    if (result.isConfirmed) {
      try {
        const config = getAuthConfig();
        // Dynamic endpoint builder parsing target parameters securely
        const endpoint = type === "product" ? `products/${targetId}` : type === "order" ? `orders/${targetId}` : `users/${targetId}`;
        
        await axios.delete(`${API_BASE}/${endpoint}`, config);
        
        // Exact state filter condition logic matching local context array
        if (type === "product") {
          setProducts(prev => prev.filter(item => (item._id !== targetId && item.id !== targetId)));
        }
        if (type === "order") {
          setOrders(prev => prev.filter(item => (item._id !== targetId && item.id !== targetId)));
        }
        if (type === "user") {
          setUsers(prev => prev.filter(item => (item._id !== targetId && item.id !== targetId)));
        }
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Asset completely purged from registry.',
          icon: 'success',
          confirmButtonColor: '#1f1f1f',
          background: '#faf7f2'
        });
      } catch (err) { 
        console.error("Deletion Node Crash:", err);
        Swal.fire({ 
          title: 'Error', 
          text: err.response?.data?.message || 'Action failed inside secure database block', 
          icon: 'error', 
          background: '#faf7f2', 
          color: '#1f1f1f' 
        }); 
      }
    }
  };
  
const handleAddProductPlaceholder = () => {
    Swal.fire({
      title: 'Create Luxury Artifact',
      html: `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <input id="p-name" class="swal2-input" placeholder="Product Name" style="margin: 5px 0;">
          <input id="p-price" class="swal2-input" type="number" placeholder="Price ($)" style="margin: 5px 0;">
          <input id="p-stock" class="swal2-input" type="number" placeholder="Stock Count" style="margin: 5px 0;">
          <input id="p-category" class="swal2-input" placeholder="Category (e.g., fashion, electronics)" style="margin: 5px 0;">
        </div>
      `,
      confirmButtonColor: '#1f1f1f',
      cancelButtonColor: '#efe7dd',
      showCancelButton: true,
      confirmButtonText: 'Deploy to Vault',
      background: '#faf7f2',
      color: '#1f1f1f',
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('p-name').value;
        const price = document.getElementById('p-price').value;
        const countInStock = document.getElementById('p-stock').value;
        const category = document.getElementById('p-category').value || 'fashion';
        
        if (!name || !price) {
          Swal.showValidationMessage('Name and Price are mandatory fields!');
          return false;
        }
        return { name, price, countInStock, category };
      }
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const config = getAuthConfig();
          
          // Data Object with all possible schema fields to satisfy addProduct schema constraints
          const productPayload = {
            name: result.value.name,
            price: Number(result.value.price),
            countInStock: Number(result.value.countInStock || 0),
            category: result.value.category.toLowerCase().trim(),
            image: '/images/sample.jpg',
            brand: 'Veloura Premium',
            description: 'Premium luxury artifact collection item.'
          };

          const { data } = await axios.post(
            `${API_BASE}/products/admin`, 
            productPayload,
            config
          );

          // State refresh
          setProducts((prevProducts) => [data, ...prevProducts]);

          Swal.fire({
            title: 'Artifact Saved!',
            text: 'Product successfully added to MongoDB.',
            icon: 'success',
            confirmButtonColor: '#1f1f1f',
            background: '#faf7f2',
          });
        } catch (error) {
          console.error("Payload Sync Error:", error);
          Swal.fire({
            title: 'Vault Error',
            text: error.response?.data?.message || 'Failed to add product to database.',
            icon: 'error',
            confirmButtonColor: '#1f1f1f',
            background: '#faf7f2',
          });
        }
      }
    });
  };

  const filterByDate = (orderList) => {
    if (dateFilter === "all") return orderList;
    const now = new Date();
    return orderList.filter(order => {
      const orderDate = new Date(order.createdAt);
      if (dateFilter === "today") {
        return orderDate.toDateString() === now.toDateString();
      }
      if (dateFilter === "week") {
        const diffTime = Math.abs(now - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }
      if (dateFilter === "month") {
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const filteredOrders = filterByDate(orders);

  // ✨ Analytics Computing Blocks (Brought back to solve rendering crashes)
  const chartData = filteredOrders.map((order, index) => ({
    date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sales: order.totalPrice || 0,
    fill: BAR_COLORS[index % BAR_COLORS.length]
  })).slice(-10);

  const distributionData = [
    { name: 'Stock', value: products.length },
    { name: 'Users', value: users.length },
    { name: 'Sales', value: filteredOrders.length }
  ];

  const totalSales = filteredOrders.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
  const averageOrderValue = filteredOrders.length > 0 ? (totalSales / filteredOrders.length).toFixed(2) : 0;

  const pendingOrders = filteredOrders.filter(o => o.status === "Order Placed" || o.status === "Processing").length;
  const completedOrders = filteredOrders.filter(o => o.status === "Delivered").length;
  const cancelledOrders = filteredOrders.filter(o => o.status === "Cancelled").length;

  const newCustomers = Math.floor(users.length * 0.4);
  const returningCustomers = users.length - newCustomers;
  const topProducts = [...products].sort((a, b) => b.countInStock - a.countInStock).slice(0, 5);

  const currentData = activeTab === "orders" ? filteredOrders : activeTab === "products" ? products : users;
  const filteredData = Array.isArray(currentData) ? currentData.filter((item) => (item?.name || item?.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase())) : [];
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) return <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center text-[#1f1f1f] font-serif italic text-2xl animate-pulse">Loading Luxury Command...</div>;

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1f1f1f] flex antialiased">
      
      {/* SIDEBAR */}
      <div className="w-72 bg-[#efe7dd] border-r border-black/10 flex flex-col shadow-xl fixed h-screen z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 px-3 py-4 bg-white/40 backdrop-blur-md rounded-2xl border-l-4 border-[#1f1f1f]">
            <div className="bg-[#1f1f1f] p-2.5 rounded-xl shadow-md">
              <ShieldCheck size={22} className="text-[#faf7f2]"/>
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold tracking-wide text-[#1f1f1f] leading-none">Veloura</h1>
              <span className="text-[10px] font-sans font-bold text-[#8d8070] uppercase tracking-[0.2em]">Couture Admin</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-sans font-bold text-[#8d8070] uppercase tracking-[0.3em] mb-4">Management</p>
          {[
            { id: 'orders', icon: ShoppingBag, label: 'Orders' },
            { id: 'products', icon: Package, label: 'Inventory' },
            { id: 'customers', icon: Users, label: 'Customers' },
            { id: 'analytics', icon: TrendingUp, label: 'Analytics' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }} 
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 ${
                activeTab === tab.id ? 'bg-[#1f1f1f] text-white shadow-lg' : 'hover:bg-white/40 text-[#4a423a]'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon size={18} />
                <span className="font-sans font-semibold text-sm tracking-wide">{tab.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-black/5">
          <div className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#615951] to-[#b5a897] flex items-center justify-center font-serif font-bold text-white">AD</div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-[#1f1f1f] truncate">Administrator</p>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8d8070]"></div>
                  <p className="text-[10px] font-sans text-[#8d8070] uppercase tracking-wider">Active Session</p>
                </div>
              </div>
            </div>
            <button onClick={logoutHandler} className="w-full py-2.5 bg-white/80 hover:bg-[#1f1f1f] hover:text-white text-[#1f1f1f] rounded-xl text-xs font-bold border border-black/10 transition-all flex items-center justify-center gap-2 tracking-widest">
              <LogOut size={14} /> SIGN OUT
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 ml-72">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-serif tracking-tight text-[#1f1f1f] capitalize">{activeTab}</h2>
            <p className="text-[#8d8070] font-sans text-xs mt-1 uppercase tracking-widest">Aesthetic Control Panel</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Contextual Top Utility Trigger */}
            {activeTab === "products" && (
              <button onClick={handleAddProductPlaceholder} className="bg-[#1f1f1f] hover:bg-[#333] text-white px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider flex items-center gap-2 transition-all shadow-sm">
                <Plus size={14}/> NEW ARTIFACT
              </button>
            )}

            <select 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[#efe7dd] border border-black/10 text-sm outline-none text-[#1f1f1f] font-medium focus:border-[#1f1f1f]"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="px-5 py-3 pl-11 rounded-xl bg-[#efe7dd] border border-black/10 outline-none w-72 focus:border-[#1f1f1f] text-[#1f1f1f] text-sm font-medium placeholder-[#8d8070]/60" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
              <BarChart2 size={16} className="absolute left-4 text-[#8d8070]" />
            </div>
          </div>
        </header>

        {/* Highlight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Gross Valuation", value: `$${totalSales.toFixed(0)}`, icon: DollarSign },
            { label: "Average Basket (AOV)", value: `$${averageOrderValue}`, icon: TrendingUp },
            { label: "Vault Inventory", value: `${products.length} Items`, icon: Package },
            { label: "Active Members", value: users.length, icon: Users }
          ].map((card, i) => (
            <div key={i} className="bg-white border border-black/5 p-6 rounded-2xl hover:shadow-md transition-all">
              <div className="p-3 rounded-xl bg-[#faf7f2] w-fit mb-4 text-[#1f1f1f] border border-black/5"><card.icon size={20}/></div>
              <p className="text-[#8d8070] text-[10px] font-bold uppercase tracking-[0.2em]">{card.label}</p>
              <h3 className="text-3xl font-serif font-bold text-[#1f1f1f] mt-1">{card.value}</h3>
            </div>
          ))}
        </div>

        {/* ✨ FIX: ANALYTICS PANEL BLOCK CONDITION */}
        {activeTab === "analytics" ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Order Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-black/5 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#8d8070] font-bold">Pending Actions</p>
                  <h3 className="text-2xl font-serif font-bold text-[#615951] mt-2">{pendingOrders} Orders</h3>
                </div>
                <div className="p-4 bg-[#f5efe8] text-[#1f1f1f] rounded-xl"><Clock size={22}/></div>
              </div>
              <div className="bg-white border border-black/5 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#8d8070] font-bold">Completed Shifts</p>
                  <h3 className="text-2xl font-serif font-bold text-[#8d8070] mt-2">{completedOrders} Dispatched</h3>
                </div>
                <div className="p-4 bg-[#e7dccf] text-[#1f1f1f] rounded-xl"><CheckCircle size={22}/></div>
              </div>
              <div className="bg-white border border-black/5 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#8d8070] font-bold">Revoked Invoices</p>
                  <h3 className="text-2xl font-serif font-bold text-red-700/80 mt-2">{cancelledOrders} Void</h3>
                </div>
                <div className="p-4 bg-red-50/60 text-red-800 rounded-xl"><Trash2 size={22}/></div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border border-black/5 p-8 rounded-2xl h-[400px]">
                <h3 className="text-xs font-bold text-[#1f1f1f] mb-8 uppercase tracking-widest flex items-center gap-2">
                  <BarChart2 size={16}/> Sales Revenue Flow
                </h3>
                <ResponsiveContainer width="100%" height="80%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" stroke="#8d8070" fontSize={10} />
                    <YAxis stroke="#8d8070" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #efe7dd', borderRadius: '12px', color: '#1f1f1f' }} />
                    <Line type="monotone" dataKey="sales" stroke="#1f1f1f" strokeWidth={2} dot={{ stroke: '#8d8070', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white border border-black/5 p-8 rounded-2xl h-[400px]">
                <h3 className="text-xs font-bold text-[#1f1f1f] mb-8 uppercase tracking-widest">Structural Distribution</h3>
                <ResponsiveContainer width="100%" height="80%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={distributionData}>
                    <PolarGrid stroke="#efe7dd" />
                    <PolarAngleAxis dataKey="name" stroke="#8d8070" fontSize={11} />
                    <Radar name="Count" dataKey="value" stroke="#1f1f1f" fill="#8d8070" fillOpacity={0.3} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sub Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white border border-black/5 p-8 rounded-2xl">
                <h3 className="text-xs font-bold text-[#1f1f1f] mb-6 uppercase tracking-widest">Client Analytics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-[#faf7f2] p-4 rounded-xl border border-black/5">
                    <span className="text-sm text-[#4a423a]">Total Members</span>
                    <span className="text-lg font-serif font-bold text-[#1f1f1f]">{users.length}</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#faf7f2] p-4 rounded-xl border border-black/5">
                    <span className="text-sm text-[#8d8070] font-medium">{newCustomers} New</span>
                    <span className="text-sm text-[#4a423a] font-serif font-bold">/</span>
                    <span className="text-sm text-[#615951] font-medium">{returningCustomers} Returning</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black/5 p-8 rounded-2xl">
                <h3 className="text-xs font-bold text-[#1f1f1f] mb-6 uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-700"/> Luxury Stock Deficit
                </h3>
                <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                  {products.filter(p => p.countInStock < 5).map(p => (
                    <div key={p._id} className="flex justify-between items-center bg-amber-50/60 border border-amber-200 p-3 rounded-xl">
                      <span className="text-xs font-bold text-[#1f1f1f]">{p.name}</span>
                      <span className="text-[10px] text-amber-900 font-bold px-2 py-0.5 rounded bg-white border border-amber-200">
                        {p.countInStock} Left
                      </span>
                    </div>
                  ))}
                  {products.filter(p => p.countInStock < 5).length === 0 && (
                    <p className="text-xs text-[#8d8070] italic">Vault architecture is fully stable.</p>
                  )}
                </div>
              </div>

              <div className="bg-white border border-black/5 p-8 rounded-2xl">
                <h3 className="text-xs font-bold text-[#1f1f1f] mb-6 uppercase tracking-widest">Signature Masterpieces</h3>
                <div className="space-y-3 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                  {topProducts.map((p, index) => (
                    <div key={p._id} className="flex justify-between items-center bg-[#faf7f2] border border-black/5 p-3 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-serif font-bold text-[#8d8070]">0{index + 1}</span>
                        <span className="text-xs font-semibold text-[#1f1f1f] truncate max-w-[120px]">{p.name}</span>
                      </div>
                      <span className="text-[10px] font-sans font-bold text-[#1f1f1f] bg-[#e7dccf] px-2.5 py-1 rounded">
                        Units: {p.countInStock * 2}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Premium Core Data Management Table */
          <div className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-[#efe7dd] text-[#8d8070] text-[10px] uppercase font-bold tracking-widest">
                <tr><th className="p-6">Registry Item</th><th className="p-6">Statement Valuation</th><th className="p-6">Authorization</th><th className="p-6 text-right">Operational Nodes</th></tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-[#4a423a]">
                {paginatedData.map((item) => (
                  <tr key={item?._id || Math.random()} className="hover:bg-[#faf7f2] transition-colors">
                    <td className="p-6 text-[#1f1f1f] font-semibold text-sm">
                      {item?.name || item?.user?.name || 'Anonymous'}
                      {activeTab === 'products' && item?.countInStock < 5 && (
                        <span className="ml-3 text-[10px] text-amber-900 border border-amber-200 px-2 py-0.5 rounded bg-amber-50/60">Deficit</span>
                      )}
                    </td>
                    <td className="p-6 text-sm">{activeTab === "customers" ? item?.email : `$${item?.price || item?.totalPrice || 0}`}</td>
                    <td className="p-6">
                      {activeTab === "orders" ? (
                        <select value={item.status} onChange={(e) => updateOrderStatus(item._id, e.target.value)} className="bg-[#faf7f2] text-[10px] text-[#1f1f1f] py-2 px-4 rounded-xl border border-black/10 outline-none font-medium">
                          <option value="Order Placed">Order Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${item?.countInStock < 5 ? 'text-amber-800 bg-amber-50 border border-amber-200' : 'text-neutral-700 bg-[#efe7dd]'}`}>
                          {activeTab === 'products' ? (item?.countInStock < 5 ? 'Low Vault' : 'Secured') : 'Verified'}
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        {activeTab === "orders" && (
                          <button onClick={() => setSelectedOrder(item)} className="bg-[#faf7f2] hover:bg-[#1f1f1f] p-2.5 rounded-xl transition-all text-[#8d8070] hover:text-white border border-black/5 shadow-sm">
                            <Eye size={15} />
                          </button>
                        )}
                        <button onClick={() => deleteHandler(item?._id, activeTab === 'products' ? 'product' : activeTab === 'orders' ? 'order' : 'user')} className="bg-[#faf7f2] hover:bg-[#1f1f1f] p-2.5 rounded-xl transition-all text-[#8d8070] hover:text-white border border-black/5 shadow-sm"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            <div className="p-6 bg-[#faf7f2] border-t border-black/5 flex justify-between items-center">
              <span className="text-[10px] text-[#8d8070] font-bold uppercase tracking-widest">Folio {currentPage} of {totalPages || 1}</span>
              <div className="flex gap-3">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(v => v - 1)} className="px-5 py-2 text-[10px] font-bold rounded-xl bg-white border border-black/10 disabled:opacity-30 uppercase transition-all text-[#1f1f1f]">Prev</button>
                <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(v => v + 1)} className="px-5 py-2 text-[10px] font-bold rounded-xl bg-[#1f1f1f] text-white uppercase transition-all">Next</button>
              </div>
            </div>
          </div>
        )}

        {/* 🆕 POPUP MODAL: Detailed Order Cargo Breakdowns */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-black/10 shadow-2xl">
              <h3 className="font-serif text-2xl text-[#1f1f1f] mb-2">Manifest Cargo Breakdown</h3>
              <p className="text-xs text-[#8d8070] mb-4">Token Ref: {selectedOrder._id}</p>
              
              <div className="space-y-3 mb-6 border-y border-black/5 py-4 text-sm">
                <p><strong>Customer Reference:</strong> {selectedOrder.user?.name || 'Guest checkout'}</p>
                <p><strong>Registry Status:</strong> <span className="font-bold text-amber-800">{selectedOrder.status}</span></p>
                <div className="bg-[#faf7f2] p-4 rounded-xl mt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8d8070] mb-2">Items Map</p>
                  {selectedOrder.orderItems?.map((product, idx) => (
                    <div key={idx} className="flex justify-between text-xs py-1">
                      <span>{product.name} (x{product.qty || 1})</span>
                      <span>${product.price}</span>
                    </div>
                  )) || <p className="text-xs italic text-neutral-400">No raw nested item array detected.</p>}
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-full py-3 bg-[#1f1f1f] text-white font-bold rounded-xl text-xs tracking-widest hover:bg-neutral-800 transition-colors">
                CLOSE MANIFEST
              </button>
            </div>
          </div>
        )}
      </div>

      <AdminChatAgent />
    </div>
  );
};

export default AdminDashboard;