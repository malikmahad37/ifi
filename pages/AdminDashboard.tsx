
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, X, Phone, Mail, MapPin, Globe, Package, Info, Image as ImageIcon, Type, LayoutDashboard, Inbox, Calendar, MessageSquare, Search, Edit2, CheckCircle, Star, ArrowLeft, MessageCircle, FileText } from 'lucide-react';
import { Category, ProductSeries, ContactInfo, Inquiry } from '../types';
import { migrateCategories } from '../lib/firebase';
import { INITIAL_CATEGORIES } from '../constants';

interface AdminDashboardProps {
  categories: Category[];
  onUpdate: (categories: Category[]) => void;
  contact: ContactInfo;
  onUpdateContact: (contact: ContactInfo) => void;
  inquiries: Inquiry[];
  onDeleteInquiry: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ categories, onUpdate, contact, onUpdateContact, inquiries, onDeleteInquiry }) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'inbox' | 'contact' | 'billing'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle image upload and conversion to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (value: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // State for the catalog view mode
  const [viewMode, setViewMode] = useState<'list' | 'edit-category' | 'edit-product'>('list');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Local state for editing. This is the source of truth for the UI during the session.
  const [tempCategories, setTempCategories] = useState<Category[]>(() => [...(categories || [])]);
  const [tempContact, setTempContact] = useState<ContactInfo>({ ...contact });

  // Sync temp state if initial categories change externally
  useEffect(() => {
    setTempCategories([...(categories || [])]);
  }, [categories]);

  // Persistence handler
  const saveAll = () => {
    onUpdate(tempCategories);
    onUpdateContact(tempContact);
    alert('SUCCESS: Inventory and configuration have been updated live.');
    setViewMode('list');
    setSelectedCategoryId(null);
    setSelectedProductId(null);
  };

  // Filter logic for the catalog
  const filteredCategories = useMemo(() => {
    if (!tempCategories) return [];
    if (!searchQuery) return tempCategories;
    const query = searchQuery.toLowerCase();
    return tempCategories.filter(c =>
      c?.name?.toLowerCase().includes(query) ||
      c?.nameUrdu?.includes(searchQuery) ||
      (c?.series || []).some(s => s?.name?.toLowerCase().includes(query))
    );
  }, [tempCategories, searchQuery]);

  // FIXED LOGIC WITH FUNCTIONAL STATE
  const handleRemoveCategory = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete this product group?')) {
      setTempCategories(prev => prev.filter(cat => cat.id !== id));
      if (selectedCategoryId === id) {
        setViewMode('list');
        setSelectedCategoryId(null);
      }
    }
  };

  const handleRemoveSeries = (e: React.MouseEvent, catId: string, seriesId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Permanently delete this product series?')) {
      setTempCategories(prev => prev.map(c =>
        c.id === catId ? { ...c, series: c.series.filter(s => s.id !== seriesId) } : c
      ));
      if (selectedProductId === seriesId) {
        setViewMode('edit-category');
        setSelectedProductId(null);
      }
    }
  };

  const updateCategory = (id: string, field: keyof Category, value: any) => {
    setTempCategories(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const updateSeries = (catId: string, seriesId: string, field: keyof ProductSeries, value: any) => {
    setTempCategories(prev => prev.map(c =>
      c.id === catId ? {
        ...c,
        series: c.series.map(s => s.id === seriesId ? { ...s, [field]: value } : s)
      } : c
    ));
  };

  const createCategory = () => {
    const newCat: Category = {
      id: Date.now().toString(),
      name: 'New Product Group',
      nameUrdu: 'نئی پراڈکٹ گروپ',
      image: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a1930',
      description: 'Description...',
      descriptionUrdu: 'تفصیل...',
      series: []
    };
    setTempCategories(prev => [...prev, newCat]);
    setSelectedCategoryId(newCat.id);
    setViewMode('edit-category');
  };

  const addSeriesToGroup = (catId: string) => {
    const newSeries: ProductSeries = {
      id: Date.now().toString(),
      name: 'New Item',
      nameUrdu: 'نیا آئٹم',
      image: 'https://images.unsplash.com/photo-1621905252507-b354bcadcabc',
      description: 'Specs...',
      descriptionUrdu: 'تفصیل...',
      sizes: ['M8'],
    };
    setTempCategories(prev => prev.map(c =>
      c.id === catId ? { ...c, series: [...(c.series || []), newSeries] } : c
    ));
    setSelectedCategoryId(catId);
    setSelectedProductId(newSeries.id);
    setViewMode('edit-product');
  };

  // --- INVOICE GENERATOR STATE ---
  interface InvoiceItem {
    id: string;
    description: string;
    weight: string;
    rate: string; // string key input handling
    amount: number;
  }

  const [invoiceCustomer, setInvoiceCustomer] = useState({ name: '', phone: '', address: '' });
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceDiscount, setInvoiceDiscount] = useState<number>(0);
  const [invoiceTax, setInvoiceTax] = useState<number>(0);
  const [invoiceNotes, setInvoiceNotes] = useState('');

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { id: Date.now().toString(), description: '', weight: '', rate: '', amount: 0 }
  ]);

  const updateInvoiceItem = (id: string, field: keyof InvoiceItem, value: string) => {
    setInvoiceItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === 'weight' || field === 'rate') {
        const w = parseFloat(updated.weight) || 0;
        const r = parseFloat(updated.rate) || 0;
        updated.amount = w * r;
      }
      return updated;
    }));
  };

  const addInvoiceItem = () => {
    setInvoiceItems(prev => [...prev, { id: Date.now().toString(), description: '', weight: '', rate: '', amount: 0 }]);
  };

  const removeInvoiceItem = (id: string) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const allProducts = useMemo(() => {
    // Optimization: Don't calculate if not in billing tab to save initial load time
    if (activeTab !== 'billing') return [];

    return (categories || []).flatMap(c => (c.series || []).slice(0, 100).map(s => ({ // Limit to prevent massive arrays
      label: `${c.name} - ${s.name} (${(s.sizes || []).join(', ')})`,
      value: `${c.name} - ${s.name}`
    })));
  }, [categories, activeTab]);

  const { subTotal, taxAmount, discountAmount, grandTotal } = useMemo(() => {
    const sub = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = (sub * invoiceTax) / 100;
    const total = sub + tax - invoiceDiscount;
    return { subTotal: sub, taxAmount: tax, discountAmount: invoiceDiscount, grandTotal: total };
  }, [invoiceItems, invoiceTax, invoiceDiscount]);

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-20 px-4 max-w-7xl mx-auto transition-colors duration-300">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-theme-base/10 pb-10 mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-3 text-brand-lime mb-1 animate-fade-in">
            <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
            <p className="text-[9px] md:text-[10px] font-black tracking-[0.5em] uppercase opacity-60">Control Panel</p>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-theme-base tracking-tighter uppercase leading-none">COMMAND</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] text-brand-lime uppercase tracking-widest opacity-60">Connected to Cloud</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex w-full md:w-auto bg-theme-base/5 p-1 rounded-2xl border border-theme-base/5 overflow-x-auto no-scrollbar"
        >
          {[
            { id: 'catalog', label: 'CATALOG', icon: Package },
            { id: 'inbox', label: `INBOX (${inquiries.length})`, icon: Inbox },
            { id: 'contact', label: 'BUSINESS', icon: Info },
            { id: 'billing', label: 'BILLING', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setViewMode('list'); }}
              className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${activeTab === tab.id
                ? 'bg-brand-lime text-black'
                : 'text-theme-base/40 hover:text-theme-base'
                }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </motion.div>
      </div>

      {activeTab === 'inbox' && (
        <section className="space-y-6 animate-fade-in">
          {inquiries.length === 0 ? (
            <div className="glass-panel p-20 rounded-[2.5rem] text-center">
              <Inbox className="w-10 h-10 text-theme-base/5 mx-auto mb-4" />
              <p className="text-theme-base/20 text-xs font-black uppercase tracking-widest">No messages</p>
            </div>
          ) : (
            inquiries.map((iq) => (
              <div className="glass-panel p-6 md:p-8 rounded-[2rem] border border-theme-base/5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-brand-lime font-black text-sm uppercase">{iq.name}</p>
                    <p className="text-theme-base/30 text-[9px] uppercase font-black tracking-widest">{iq.date}</p>
                  </div>
                  <button onClick={() => onDeleteInquiry(iq.id)} className="p-2 text-red-500/20 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-theme-base/5 p-5 rounded-xl text-theme-base/70 text-sm leading-relaxed border border-theme-base/5 italic">
                  "{iq.message}"
                </div>
                <div className="flex justify-between items-center pt-2">
                  <p className="text-theme-base/40 font-mono text-xs">{iq.phone}</p>

                </div>
              </div>
            ))
          )}
        </section>
      )}

      {activeTab === 'catalog' && (
        <div className="animate-fade-in">
          {viewMode === 'list' ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-[500px]">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-base/20" />
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ color: '#000000' }} // Force black text for visibility
                    className="w-full bg-input-bg border border-theme-base/10 rounded-2xl pl-14 pr-6 py-4 text-sm focus:outline-none focus:border-brand-lime/30 placeholder:text-theme-base/30"
                  />
                </div>
                <button
                  onClick={createCategory}
                  className="w-full md:w-auto flex items-center justify-center gap-3 bg-brand-lime text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-lime/10"
                >
                  <Plus className="w-5 h-5" /> ADD NEW
                </button>
              </div>

              {/* Responsive Catalog View */}
              <div className="hidden md:block card-parrot-bg rounded-[2rem] overflow-hidden border border-theme-base/5 shadow-2xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-theme-base/5 bg-theme-base/[0.01]">
                      <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-theme-base/30">PRODUCT</th>
                      <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-theme-base/30">ITEMS</th>
                      <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-theme-base/30 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-base/[0.03]">
                    <AnimatePresence mode='popLayout'>
                      {filteredCategories.map((cat, index) => (
                        <motion.tr
                          key={cat.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-theme-base/[0.01] transition-colors group"
                        >
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-4">
                              <img src={cat.image} className="w-12 h-12 rounded-lg object-cover border border-theme-base/10" />
                              <div>
                                <p className="text-theme-base font-black text-sm uppercase">{cat.name}</p>
                                <p className="urdu-text text-theme-base/50 text-sm leading-none">{cat.nameUrdu}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-4 text-theme-base/20 text-xs font-black">{(cat?.series || []).length} items</td>
                          <td className="px-8 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => { setSelectedCategoryId(cat.id); setViewMode('edit-category'); }} className="p-2.5 bg-theme-base/5 rounded-lg text-theme-base/20 hover:text-theme-base"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={(e) => handleRemoveCategory(e, cat.id)} className="p-2.5 bg-red-500/5 rounded-lg text-red-500/30 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden grid grid-cols-1 gap-4">
                {filteredCategories.map(cat => (
                  <div key={cat.id} className="glass-panel p-5 rounded-2xl border border-white/5 flex gap-4">
                    <img src={cat.image} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-grow space-y-2">
                      <div>
                        <p className="text-theme-base font-black text-sm uppercase">{cat.name}</p>
                        <p className="urdu-text text-brand-text/50 text-base leading-none">{cat.nameUrdu}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-theme-base/20 text-[10px] font-black uppercase">{(cat?.series || []).length} Series</span>
                        <div className="flex gap-2">
                          <button onClick={() => { setSelectedCategoryId(cat.id); setViewMode('edit-category'); }} className="p-2 bg-theme-base/5 rounded-lg"><Edit2 className="w-4 h-4 text-theme-base/40" /></button>
                          <button onClick={(e) => handleRemoveCategory(e, cat.id)} className="p-2 bg-red-500/5 rounded-lg"><Trash2 className="w-4 h-4 text-red-500/50" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-6">
                <button onClick={saveAll} className="flex items-center gap-3 bg-brand-lime text-black font-black uppercase tracking-widest px-10 py-4 rounded-xl shadow-2xl shadow-brand-lime/10 active:scale-95 transition-all text-[10px]">
                  <Save className="w-5 h-5" /> PUSH UPDATES LIVE
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-slide-up">
              <div className="flex items-center justify-between border-b border-theme-base/5 pb-6">
                <button onClick={() => { setViewMode('list'); setSelectedProductId(null); }} className="flex items-center gap-2 text-theme-base/30 text-[9px] font-black uppercase tracking-widest">
                  <ArrowLeft className="w-4 h-4" /> BACK TO LIST
                </button>
                <button onClick={saveAll} className="bg-brand-lime text-black px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest">SAVE</button>
              </div>

              {viewMode === 'edit-category' && selectedCategoryId && (
                <div className="glass-panel p-6 md:p-10 rounded-[2.5rem] space-y-10">
                  {tempCategories.filter(c => c.id === selectedCategoryId).map(cat => (
                    <div key={cat.id} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-theme-base/30 uppercase tracking-widest">Name (EN/UR)</label>
                          <input value={cat.name} onChange={e => updateCategory(cat.id, 'name', e.target.value)} className="w-full bg-input-bg border border-theme-base/10 rounded-xl px-5 py-4 text-theme-base font-black focus:border-brand-lime/50 transition-colors" />
                          <input dir="rtl" value={cat.nameUrdu} onChange={e => updateCategory(cat.id, 'nameUrdu', e.target.value)} className="w-full bg-input-bg border border-theme-base/10 rounded-xl px-5 py-4 text-brand-text urdu-text text-2xl focus:border-brand-lime/50 transition-colors" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-theme-base/30 uppercase tracking-widest">Cover Image</label>
                          <div className="aspect-video rounded-2xl overflow-hidden border border-theme-base/10 mb-2">
                            <img src={cat.image} className="w-full h-full object-cover" />
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (base64) => updateCategory(cat.id, 'image', base64))}
                            className="w-full bg-input-bg border border-theme-base/5 rounded-lg p-3 text-[9px] text-theme-base/30 font-mono file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-lime file:text-brand-dark hover:file:bg-brand-lime/80"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-theme-base/30 uppercase tracking-widest">Description (EN/UR)</label>
                          <textarea value={cat.description} onChange={e => updateCategory(cat.id, 'description', e.target.value)} className="w-full h-24 bg-input-bg border border-theme-base/10 rounded-xl px-5 py-4 text-theme-base text-xs font-bold resize-none focus:border-brand-lime/50 transition-colors" placeholder="Category description..." />
                          <textarea dir="rtl" value={cat.descriptionUrdu} onChange={e => updateCategory(cat.id, 'descriptionUrdu', e.target.value)} className="w-full h-24 bg-input-bg border border-theme-base/10 rounded-xl px-5 py-4 text-brand-text urdu-text text-lg resize-none focus:border-brand-lime/50 transition-colors" placeholder="زمرہ کی تفصیل..." />
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-[9px] font-black text-theme-base/30 uppercase tracking-widest">Series List</label>
                            <button onClick={() => addSeriesToGroup(cat.id)} className="text-brand-text text-[9px] font-black uppercase hover:underline">+ Add Item</button>
                          </div>
                          <div className="space-y-3">
                            {(cat?.series || []).map(s => (
                              <div key={s.id} className="flex items-center justify-between p-4 bg-input-bg/60 rounded-xl border border-theme-base/5 hover:border-theme-base/10 transition-colors">
                                <div className="flex items-center gap-3">
                                  <img src={s.image} className="w-10 h-10 rounded-lg object-cover bg-neutral-800" />
                                  <div>
                                    <p className="text-theme-base font-bold text-xs">{s.name}</p>
                                    <p className="urdu-text text-brand-text/40 text-xs leading-none">{s.nameUrdu}</p>
                                  </div>
                                </div>
                                <div className="flex gap-1.5">
                                  <button onClick={() => { setSelectedProductId(s.id); setViewMode('edit-product'); }} className="p-2 text-theme-base/20 hover:text-theme-base"><Edit2 className="w-3.5 h-3.5" /></button>
                                  <button onClick={(e) => handleRemoveSeries(e, cat.id, s.id)} className="p-2 text-red-500/20 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {viewMode === 'edit-product' && selectedCategoryId && selectedProductId && (
                <div className="glass-panel p-6 md:p-10 rounded-[2.5rem] space-y-10">
                  {tempCategories.find(c => c.id === selectedCategoryId)?.series.filter(s => s.id === selectedProductId).map(s => (
                    <div key={s.id} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-theme-base/30 uppercase tracking-widest">Series Detail</label>
                          <input value={s.name} onChange={e => updateSeries(selectedCategoryId, s.id, 'name', e.target.value)} className="w-full bg-input-bg border border-theme-base/10 rounded-xl px-5 py-4 text-theme-base font-black" />
                          <input dir="rtl" value={s.nameUrdu} onChange={e => updateSeries(selectedCategoryId, s.id, 'nameUrdu', e.target.value)} className="w-full bg-input-bg border border-theme-base/10 rounded-xl px-5 py-4 text-brand-text urdu-text text-2xl" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] font-black text-theme-base/30 uppercase tracking-widest">Product Photo</label>
                          <div className="aspect-square w-full max-w-[250px] mx-auto rounded-3xl overflow-hidden border border-theme-base/10 mb-2">
                            <img src={s.image} className="w-full h-full object-cover" />
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (base64) => updateSeries(selectedCategoryId, s.id, 'image', base64))}
                            className="w-full bg-input-bg border border-theme-base/5 rounded-lg p-3 text-[9px] text-theme-base/30 font-mono file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-lime file:text-brand-dark hover:file:bg-brand-lime/80"
                          />
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-theme-base/30 uppercase tracking-widest">Sizes (Comma separated)</label>
                          <input value={s.sizes.join(', ')} onChange={e => updateSeries(selectedCategoryId, s.id, 'sizes', e.target.value.split(',').map(v => v.trim()))} className="w-full bg-input-bg border border-theme-base/10 rounded-xl p-4 text-theme-base text-xs font-mono" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-theme-base/30 uppercase tracking-widest">Description</label>
                          <textarea value={s.description} onChange={e => updateSeries(selectedCategoryId, s.id, 'description', e.target.value)} className="w-full h-24 bg-input-bg border border-theme-base/10 rounded-xl p-4 text-xs text-theme-base resize-none" />
                          <textarea dir="rtl" value={s.descriptionUrdu} onChange={e => updateSeries(selectedCategoryId, s.id, 'descriptionUrdu', e.target.value)} className="w-full h-24 bg-input-bg border border-theme-base/10 rounded-xl p-4 urdu-text text-base text-brand-text/80 resize-none" />
                        </div>
                        <div className="pt-4">
                          <button onClick={(e) => handleRemoveSeries(e, selectedCategoryId, s.id)} className="w-full py-4 bg-red-500/5 hover:bg-red-500 hover:text-white border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                            Delete Product Permanently
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'billing' && (
        <section className="animate-fade-in relative">
          {/* Editor View */}
          <div className="space-y-8 print:hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-black text-theme-base/40 uppercase tracking-widest">Invoice Generator</h2>
              <div className="flex gap-4">
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={e => setInvoiceDate(e.target.value)}
                  className="bg-white/5 [.light-theme_&]:bg-white border border-theme-base/10 rounded-xl px-4 py-3 text-theme-base text-xs font-bold focus:border-brand-lime/50 transition-colors"
                />
                <button onClick={handlePrintInvoice} className="bg-brand-lime text-black px-8 py-3.5 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-brand-lime/10 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> GENERATE & PRINT
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Customer Info */}
              <div className="lg:col-span-1 space-y-6">
                <div className="glass-panel p-6 rounded-3xl space-y-4 border border-theme-base/10 bg-theme-base/[0.03] shadow-sm">
                  <h3 className="text-[10px] font-black text-theme-base uppercase tracking-widest border-b border-theme-base/5 pb-2">Customer Details</h3>
                  <div className="space-y-3">
                    <input
                      placeholder="Customer Name"
                      value={invoiceCustomer.name}
                      onChange={e => setInvoiceCustomer({ ...invoiceCustomer, name: e.target.value })}
                      className="w-full bg-white/5 [.light-theme_&]:bg-white border border-theme-base/20 rounded-xl px-4 py-3 text-theme-base text-xs font-bold focus:border-brand-lime/50 transition-colors shadow-inner"
                    />
                    <input
                      placeholder="Phone Number"
                      value={invoiceCustomer.phone}
                      onChange={e => setInvoiceCustomer({ ...invoiceCustomer, phone: e.target.value })}
                      className="w-full bg-white/5 [.light-theme_&]:bg-white border border-theme-base/20 rounded-xl px-4 py-3 text-theme-base text-xs font-bold focus:border-brand-lime/50 transition-colors shadow-inner"
                    />
                    <textarea
                      placeholder="Address"
                      value={invoiceCustomer.address}
                      onChange={e => setInvoiceCustomer({ ...invoiceCustomer, address: e.target.value })}
                      className="w-full bg-white/5 [.light-theme_&]:bg-white border border-theme-base/20 rounded-xl px-4 py-3 text-theme-base text-xs font-bold focus:border-brand-lime/50 transition-colors resize-none h-20 shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-panel p-6 rounded-3xl space-y-4 border border-theme-base/10 bg-theme-base/[0.03] shadow-sm">
                  <div className="flex justify-between items-center border-b border-theme-base/5 pb-2">
                    <h3 className="text-[10px] font-black text-theme-base uppercase tracking-widest">Order Items</h3>
                    <div className="text-[10px] font-black text-brand-text uppercase tracking-widest">
                      Total: <span className="text-theme-base text-sm ml-2">Rs. {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {invoiceItems.map((item, idx) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-theme-base/5 p-3 rounded-xl border border-theme-base/5">
                        <div className="col-span-1 text-center text-[9px] text-theme-base/30 font-bold">{idx + 1}</div>
                        <div className="col-span-5">
                          <input
                            list="products-list"
                            placeholder="Product Description"
                            value={item.description}
                            onChange={e => updateInvoiceItem(item.id, 'description', e.target.value)}
                            className="w-full bg-transparent border-0 border-b border-theme-base/10 px-2 py-1 text-theme-base text-xs font-bold focus:border-brand-lime/50 transition-colors focus:ring-0"
                          />
                          <datalist id="products-list">
                            {allProducts.map((p, i) => <option key={i} value={p.value}>{p.label}</option>)}
                          </datalist>
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Weight (kg)"
                            value={item.weight}
                            onChange={e => updateInvoiceItem(item.id, 'weight', e.target.value)}
                            className="w-full bg-transparent border-0 border-b border-theme-base/10 px-2 py-1 text-theme-base text-xs font-mono focus:border-brand-lime/50 transition-colors focus:ring-0 text-center"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="Rate"
                            value={item.rate}
                            onChange={e => updateInvoiceItem(item.id, 'rate', e.target.value)}
                            className="w-full bg-transparent border-0 border-b border-theme-base/10 px-2 py-1 text-theme-base text-xs font-mono focus:border-brand-lime/50 transition-colors focus:ring-0 text-center"
                          />
                        </div>
                        <div className="col-span-1 text-right text-[10px] font-mono text-theme-base/60">
                          {item.amount.toLocaleString()}
                        </div>
                        <div className="col-span-1 text-center">
                          <button onClick={() => removeInvoiceItem(item.id)} className="text-red-500/40 hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                        </div>
                      </div>
                    ))}
                    <button onClick={addInvoiceItem} className="w-full py-3 border-2 border-dashed border-theme-base/10 rounded-xl text-[10px] font-black uppercase text-theme-base/30 hover:text-brand-text hover:border-brand-lime/30 transition-all">
                      + Add Line Item
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-theme-base/5">
                      <div className="space-y-4">
                        <label className="text-[9px] font-black text-theme-base uppercase tracking-widest">Terms & Notes</label>
                        <textarea
                          value={invoiceNotes}
                          onChange={e => setInvoiceNotes(e.target.value)}
                          className="w-full h-24 bg-white/5 [.light-theme_&]:bg-white border border-theme-base/10 rounded-xl p-4 text-xs text-theme-base resize-none"
                          placeholder="Payment terms, delivery notes, etc."
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] font-black text-theme-base uppercase tracking-widest">Subtotal</label>
                          <span className="text-sm font-mono text-theme-base">Rs. {subTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <label className="text-[9px] font-black text-theme-base uppercase tracking-widest whitespace-nowrap">Discount (Amount)</label>
                          <input
                            type="number"
                            value={invoiceDiscount}
                            onChange={e => setInvoiceDiscount(parseFloat(e.target.value) || 0)}
                            className="w-24 bg-white/5 [.light-theme_&]:bg-white border border-theme-base/10 rounded-lg px-2 py-1 text-right text-xs font-mono"
                          />
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <label className="text-[9px] font-black text-theme-base uppercase tracking-widest whitespace-nowrap">Tax (%)</label>
                          <input
                            type="number"
                            value={invoiceTax}
                            onChange={e => setInvoiceTax(parseFloat(e.target.value) || 0)}
                            className="w-24 bg-white/5 [.light-theme_&]:bg-white border border-theme-base/10 rounded-lg px-2 py-1 text-right text-xs font-mono"
                          />
                        </div>
                        <div className="flex justify-between items-center border-t border-theme-base/10 pt-4">
                          <label className="text-xs font-black text-brand-text uppercase tracking-widest">Grand Total</label>
                          <span className="text-lg font-black font-mono text-theme-base">Rs. {grandTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Printable Invoice (Hidden on Screen) */}
          <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-8 text-black">
            <div className="max-w-[210mm] mx-auto h-full flex flex-col justify-between">
              <div className="space-y-8">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-black pb-6">
                  <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">INVOICE</h1>
                    <p className="text-sm font-bold mt-1">iFi ITTEFAQ FASTENERS INDUSTRIES</p>
                    <p className="text-xs text-gray-600 mt-1 max-w-[250px]">{contact.address}</p>
                    <p className="text-xs text-gray-600 mt-1">Phone: {contact.phone}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-gray-200">#{Date.now().toString().slice(-6)}</div>
                    <p className="text-xs font-bold mt-1">Date: {new Date(invoiceDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Customer */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-1">Bill To:</p>
                  <p className="font-bold text-lg">{invoiceCustomer.name || 'Walk-in Customer'}</p>
                  {invoiceCustomer.phone && <p className="text-sm text-gray-600">{invoiceCustomer.phone}</p>}
                  {invoiceCustomer.address && <p className="text-sm text-gray-600 mt-1">{invoiceCustomer.address}</p>}
                </div>

                {/* Table */}
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-black">
                      <th className="py-2 text-xs font-black uppercase">Description</th>
                      <th className="py-2 text-xs font-black uppercase text-center">Weight / Qty</th>
                      <th className="py-2 text-xs font-black uppercase text-center">Rate</th>
                      <th className="py-2 text-xs font-black uppercase text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoiceItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 text-sm font-medium">{item.description}</td>
                        <td className="py-3 text-sm text-center font-mono">{item.weight}</td>
                        <td className="py-3 text-sm text-center font-mono">{item.rate}</td>
                        <td className="py-3 text-sm text-right font-mono font-bold">{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-black">
                      <td colSpan={3} className="py-2 text-right text-xs font-bold uppercase pr-8 text-gray-500">Subtotal</td>
                      <td className="py-2 text-right text-sm font-bold font-mono">Rs. {subTotal.toLocaleString()}</td>
                    </tr>
                    {invoiceDiscount > 0 && (
                      <tr>
                        <td colSpan={3} className="py-2 text-right text-xs font-bold uppercase pr-8 text-gray-500">Discount</td>
                        <td className="py-2 text-right text-sm font-bold font-mono">- Rs. {invoiceDiscount.toLocaleString()}</td>
                      </tr>
                    )}
                    {invoiceTax > 0 && (
                      <tr>
                        <td colSpan={3} className="py-2 text-right text-xs font-bold uppercase pr-8 text-gray-500">Tax ({invoiceTax}%)</td>
                        <td className="py-2 text-right text-sm font-bold font-mono">+ Rs. {taxAmount.toLocaleString()}</td>
                      </tr>
                    )}
                    <tr className="border-t border-black">
                      <td colSpan={3} className="py-4 text-right text-sm font-black uppercase pr-8">Grand Total</td>
                      <td className="py-4 text-right text-lg font-black font-mono">Rs. {grandTotal.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Footer */}
              <div className="grid grid-cols-2 gap-10 text-left pt-4">
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2">Terms & Notes:</p>
                  <p className="text-xs text-gray-600 whitespace-pre-wrap">{invoiceNotes}</p>
                </div>
                <div className="flex flex-col justify-end items-end">
                  <div className="w-48 border-b-2 border-black mb-2"></div>
                  <p className="text-[10px] font-bold uppercase">Authorized Signatory</p>
                </div>
              </div>
              <p className="text-[10px] text-center text-gray-500 pt-8">Computer generated invoice.</p>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'contact' && (
        <section className="space-y-10 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-black text-theme-base/40 uppercase tracking-widest">Company Information</h2>
            <button onClick={saveAll} className="bg-brand-lime text-black px-8 py-3.5 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-brand-lime/10">SAVE CHANGES</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-parrot-bg p-8 rounded-3xl space-y-4 border border-theme-base/5 shadow-xl">
              <label className="text-[9px] font-black text-theme-base uppercase tracking-widest">Business Phone</label>
              <input value={tempContact.phone} onChange={e => setTempContact({ ...tempContact, phone: e.target.value })} className="w-full bg-theme-base/10 border border-theme-base/10 rounded-xl px-5 py-4 text-theme-base font-bold outline-none focus:border-theme-base/30 transition-all" />
            </div>

            <div className="card-parrot-bg p-8 rounded-3xl space-y-4 border border-theme-base/5 shadow-xl">
              <label className="text-[9px] font-black text-theme-base uppercase tracking-widest">Business Email</label>
              <input value={tempContact.email} onChange={e => setTempContact({ ...tempContact, email: e.target.value })} className="w-full bg-theme-base/10 border border-theme-base/10 rounded-xl px-5 py-4 text-theme-base font-bold outline-none focus:border-theme-base/30 transition-all" />
            </div>
            <div className="card-parrot-bg p-8 rounded-3xl space-y-4 md:col-span-2 border border-theme-base/5 shadow-xl">
              <label className="text-[9px] font-black text-theme-base uppercase tracking-widest">Headquarters Address</label>
              <input value={tempContact.address} onChange={e => setTempContact({ ...tempContact, address: e.target.value })} className="w-full bg-theme-base/10 border border-theme-base/10 rounded-xl px-5 py-4 text-theme-base font-bold outline-none focus:border-theme-base/30 transition-all" />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;
