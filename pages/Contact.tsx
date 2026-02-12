
import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, User, CheckCircle } from 'lucide-react';
import { ContactInfo, Inquiry } from '../types';

interface ContactProps {
  contact: ContactInfo;
  onAddInquiry: (inquiry: Inquiry) => void;
}

const Contact: React.FC<ContactProps> = ({ contact, onAddInquiry }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;

    const newInquiry: Inquiry = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      message: formData.message,
      date: new Date().toLocaleString()
    };

    onAddInquiry(newInquiry);
    setFormData({ name: '', phone: '', message: '' });
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-bg-base transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16 space-y-3">
          <p className="text-brand-lime text-[10px] font-black tracking-[0.5em] uppercase opacity-60">Connect With Us</p>
          <h1 className="text-4xl md:text-5xl font-black text-theme-base tracking-tighter uppercase">GET IN TOUCH</h1>
          <p className="urdu-text text-theme-base/30 text-xl md:text-2xl font-bold">رابطہ کریں</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="glass-panel p-10 rounded-[2.5rem] space-y-12">
              <div className="space-y-10">
                <div className="flex gap-5 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-brand-lime/10 flex items-center justify-center text-brand-lime shadow-lg border border-theme-base/10 shrink-0">
                    <Phone className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-theme-base/20 text-[9px] uppercase font-black tracking-widest">Call Center</p>
                    <p className="text-theme-base text-xl font-black tracking-tight">{contact.phone}</p>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-brand-lime/10 flex items-center justify-center text-brand-lime shadow-lg border border-theme-base/10 shrink-0">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-theme-base/20 text-[9px] uppercase font-black tracking-widest">Our Presence</p>
                    <p className="text-theme-base text-lg font-bold leading-tight">{contact.address}</p>
                  </div>
                </div>


              </div>


            </div>
          </div>

          <div className="glass-panel p-10 rounded-[2.5rem] relative overflow-hidden">
            {isSent ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                <CheckCircle className="w-20 h-20 text-brand-lime" />
                <h2 className="text-2xl font-black text-theme-base uppercase tracking-tighter">Inquiry Sent!</h2>
                <p className="urdu-text text-brand-lime text-xl">آپ کا پیغام وصول ہو گیا ہے۔ ہم جلد رابطہ کریں گے۔</p>
              </div>
            ) : (
              <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-black tracking-widest text-theme-base/30 ml-1">Your Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-white/20 rounded-2xl px-12 py-4 text-black placeholder:text-gray-400 focus:outline-none focus:border-brand-lime transition-all text-sm shadow-inner"
                      placeholder="Full name..."
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-black tracking-widest text-theme-base/30 ml-1">Your Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-white/20 rounded-2xl px-12 py-4 text-black placeholder:text-gray-400 focus:outline-none focus:border-brand-lime transition-all text-sm shadow-inner"
                      placeholder="+92..."
                    />
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-black tracking-widest text-theme-base/30 ml-1">Order / Inquiry Details</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-white/20 rounded-2xl px-6 py-4 text-black placeholder:text-gray-400 focus:outline-none focus:border-brand-lime transition-all resize-none text-sm shadow-inner"
                    placeholder="List products and sizes needed..."
                  ></textarea>
                </div>
                <button type="submit" className="w-full py-5 bg-theme-base text-bg-base font-black uppercase tracking-widest rounded-2xl hover:bg-brand-lime transition-all transform hover:scale-[1.01] text-xs shadow-xl">
                  Send Inquiry Now
                </button>
                <p className="urdu-text text-theme-base/20 text-center text-base mt-6">ہم آپ سے جلد ہی رابطہ کریں گے۔</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
