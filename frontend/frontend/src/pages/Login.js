import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/actions/userActions'; 
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) navigate('/');
  }, [navigate, userInfo]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: error,
        background: '#fff',
        color: '#111',
      });
    }
  }, [error]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden px-6 py-20 bg-gradient-to-br from-[#f7f2ec] via-[#efe7dd] to-[#ffffff] text-[#1d1d1f] antialiased">

      {/* 🌫️ Gentle Ambient Blobs (Matched with cart system) */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-200/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-[460px] relative z-10">

        {/* Top pill badge */}
        <div className="flex justify-center mb-4">
          <div className="bg-white/40 backdrop-blur-md border border-white/40 px-5 py-1.5 rounded-full shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck size={13} className="text-slate-800" />
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-500">
                Secure Access Node
              </span>
            </div>
          </div>
        </div>

        {/* LOGIN CARD (FLAT GLASS PAPER AESTHETIC) */}
        <div className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-xl p-8 md:p-12">

          {/* Identity Platform Meta */}
          <div className="text-center mb-10">
            <div className="w-14 h-14 mx-auto bg-black rounded-2xl flex items-center justify-center shadow-lg mb-4 border border-black">
              <LogIn size={20} className="text-white" />
            </div>

            <h2 className="text-3xl font-bold font-serif text-slate-900 tracking-tight">
              MY<span className="italic font-normal opacity-60">Store</span>
            </h2>

            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-2">
              Authentication Required
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={submitHandler} className="space-y-5">

            {/* EMAIL INPUT FIELD */}
            <div>
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 block pl-1">
                Identity
              </label>

              <div className="relative mt-2">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full pl-13 pr-5 py-4 rounded-xl bg-white/40 backdrop-blur-md border border-white/40 focus:outline-none focus:border-black/40 focus:ring-4 focus:ring-black/5 text-sm text-slate-900 transition-all font-medium placeholder:text-slate-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD INPUT FIELD */}
            <div>
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 block pl-1">
                Security Key
              </label>

              <div className="relative mt-2">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-13 pr-12 py-4 rounded-xl bg-white/40 backdrop-blur-md border border-white/40 focus:outline-none focus:border-black/40 focus:ring-4 focus:ring-black/5 text-sm text-slate-900 transition-all font-medium placeholder:text-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* ACTION DISPATCH BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] border border-black hover:bg-white hover:text-black flex items-center justify-center gap-2 transition-all duration-300 shadow-md group disabled:opacity-50"
              >
                {loading ? (
                  <span>Processing Verification...</span>
                ) : (
                  <>
                    <span>Execute Login</span>
                    <ArrowRight size={13} className="transition group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Register Redirect Segment */}
          <div className="text-center mt-8 border-t border-slate-200/40 pt-6">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              New user?{' '}
              <Link to="/register" className="text-black hover:underline ml-1 font-extrabold transition-colors">
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;