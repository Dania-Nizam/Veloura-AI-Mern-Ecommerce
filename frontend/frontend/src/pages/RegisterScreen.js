import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/actions/userActions"; 
import { Loader2, AlertCircle, User, Mail, Lock, ShieldPlus, ArrowRight } from "lucide-react";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(register(name, email, password));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd] relative overflow-hidden px-6 py-12">
      {/* ☁️ Soft Light Background Accents */}
      <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-blue-500/[0.03] rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/[0.03] rounded-full blur-[100px]"></div>

      <div className="w-full max-w-[480px] relative">
        {/* Registration Badge */}
        <div className="flex justify-center mb-10">
          <div className="bg-white px-5 py-2 rounded-full border border-slate-100 flex items-center gap-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <ShieldPlus className="text-blue-600" size={15} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">New Node Registration</span>
          </div>
        </div>

        <div className="bg-white rounded-[3.5rem] border border-slate-100 p-10 md:p-14 shadow-[0_50px_100px_rgba(0,0,0,0.04)] relative overflow-hidden group">
          {/* Top Decorative Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600/10 via-blue-600 to-blue-600/10 opacity-40"></div>

          <div className="relative">
            <header className="text-center mb-12">
              <h2 className="text-4xl font-[1000] text-slate-950 tracking-tighter mb-3 italic uppercase leading-none">
                Create <span className="text-blue-600">Identity</span>
              </h2>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.15em]">Initialize your core credentials</p>
            </header>

            {/* Error Message Styling */}
            {error && (
              <div className="mb-8 p-5 bg-red-50 border border-red-100 text-red-600 flex items-center gap-4 rounded-2xl animate-shake">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-tight">{error}</p>
              </div>
            )}
            
            <form onSubmit={submitHandler} className="space-y-7">
              {/* Full Name Input */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Full Name</label>
                <div className="relative group/input">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Enter full name"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:border-blue-200 focus:bg-white focus:shadow-xl focus:shadow-blue-500/5 outline-none transition-all font-bold text-slate-950 placeholder:text-slate-300"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Email Protocol</label>
                <div className="relative group/input">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-600 transition-colors" size={18} />
                  <input 
                    type="email" 
                    placeholder="operator@nexus.core"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:border-blue-200 focus:bg-white focus:shadow-xl focus:shadow-blue-500/5 outline-none transition-all font-bold text-slate-950 placeholder:text-slate-300"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Secure Passphrase</label>
                <div className="relative group/input">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-600 transition-colors" size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:border-blue-200 focus:bg-white focus:shadow-xl focus:shadow-blue-500/5 outline-none transition-all font-bold text-slate-950 placeholder:text-slate-300"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-6 rounded-[2rem] font-[1000] text-[10px] uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-[0.98] mt-10 group/btn flex items-center justify-center gap-4 ${
                  loading 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    : "bg-slate-950 text-white hover:bg-blue-600 shadow-slate-950/20"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Synchronizing...
                  </>
                ) : (
                  <>
                    Register Node
                    <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-14 pt-10 border-t border-slate-50 text-center">
              <p className="text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase">
                Already registered? <Link to="/login" className="text-blue-600 hover:underline underline-offset-8 transition-all ml-2">Sign In Here</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Status Indicators */}
        <div className="mt-10 flex justify-between items-center px-6 opacity-20">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-[9px] font-black text-slate-950 uppercase tracking-widest">Encrypted Node</span>
            </div>
            <span className="text-[9px] font-black text-slate-950 uppercase tracking-[0.4em] italic underline decoration-blue-500/50">V.4.0.0-REG</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;