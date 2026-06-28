import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../redux/actions/userActions';
import Swal from 'sweetalert2';
import {
  Camera, User, Mail, Lock, Loader,
  ShieldCheck, Zap, Fingerprint
} from 'lucide-react';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile) || {};
  const { loading: loadingUpdate } = userUpdateProfile;

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setImage(userInfo.image);
    }
  }, [userInfo]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'mystore_preset');

    setUploading(true);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dokvuglhy/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      setImage(data.secure_url);
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({
      id: userInfo._id,
      name,
      email,
      image,
      password
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden px-6 py-20 bg-gradient-to-br from-[#f7f2ec] via-[#efe7dd] to-[#ffffff] antialiased">

      {/* 🌫️ Background Blobs (Hero Style Match) */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="container mx-auto max-w-5xl relative z-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8 mt-8">

          <div className="text-center md:text-left space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 tracking-tight">
              User <span className="italic font-normal opacity-60">Terminal</span>
            </h1>

            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 justify-center md:justify-start">
              <ShieldCheck size={14} className="text-slate-400" />
              Identity Management System
            </p>
          </div>

          {/* Account Status Badge */}
          <div className="px-6 py-3 bg-white/40 backdrop-blur-md border border-white/40 rounded-full shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
              <Zap size={12} className="text-slate-500" /> Account Active
            </span>
          </div>

        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* LEFT COLUMN - AVATAR CARD */}
          <div className="lg:col-span-4">
            <div className="bg-white/20 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/40 text-center shadow-lg">

              <div className="relative inline-block mb-6">
                <div className="w-40 h-40 rounded-[2rem] overflow-hidden border border-white/50 shadow-md">
                  <img
                    src={image || `https://ui-avatars.com/api/?name=${name}`}
                    className="w-full h-full object-cover"
                    alt="profile"
                  />
                </div>

                <label className="absolute -bottom-2 -right-2 bg-black p-3.5 rounded-xl text-white cursor-pointer hover:scale-105 border border-black transition shadow-md">
                  <Camera size={16} />
                  <input type="file" className="hidden" onChange={uploadFileHandler} />
                </label>
              </div>

              {uploading && (
                <div className="text-xs text-slate-500 font-bold flex items-center justify-center gap-2 mb-4 animate-pulse">
                  <Loader className="animate-spin" size={13} />
                  Uploading Assets...
                </div>
              )}

              <h3 className="text-xl font-bold text-slate-900 font-serif tracking-wide">
                {name}
              </h3>

              <p className="text-slate-400 text-[11px] font-medium tracking-normal mt-1 break-all">
                {email}
              </p>

            </div>
          </div>

          {/* RIGHT COLUMN - SECURE FORM */}
          <div className="lg:col-span-8">
            <div className="bg-white/20 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/40 shadow-xl">

              <div className="flex items-center gap-4 mb-10 border-b border-slate-200/40 pb-5">
                <div className="p-2.5 bg-white/50 backdrop-blur-md rounded-xl border border-white/40 shadow-sm text-slate-700">
                  <Fingerprint size={18} />
                </div>
                <h3 className="font-bold tracking-wide uppercase text-xs text-slate-400">
                  Bio Parameters
                </h3>
              </div>

              <form onSubmit={submitHandler} className="space-y-5">

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 bg-white/40 backdrop-blur-md border border-white/40 rounded-xl font-semibold text-xs tracking-wide text-slate-800 outline-none focus:border-white/80 transition shadow-sm"
                    placeholder="Name"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 bg-white/40 backdrop-blur-md border border-white/40 rounded-xl font-semibold text-xs tracking-wide text-slate-800 outline-none focus:border-white/80 transition shadow-sm"
                    placeholder="Email"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-1">Security Key (Password)</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-white/40 backdrop-blur-md border border-white/40 rounded-xl font-semibold text-xs tracking-wide text-slate-800 outline-none focus:border-white/80 transition shadow-sm"
                    placeholder="Leave blank to maintain key"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loadingUpdate}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] border border-black hover:bg-white hover:text-black flex items-center justify-center gap-2 transition-all duration-300 shadow-md disabled:opacity-50"
                  >
                    {loadingUpdate ? (
                      <Loader className="animate-spin" size={15} />
                    ) : (
                      <>
                        Commit Changes <Zap size={13} />
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfileScreen;