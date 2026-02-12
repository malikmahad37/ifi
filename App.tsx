
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import CategoryView from './pages/CategoryView';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { Category, ContactInfo, Inquiry } from './types';
import { INITIAL_CATEGORIES, INITIAL_CONTACT } from './constants';

import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('ifi_categories_v4');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [contact, setContact] = useState<ContactInfo>(() => {
    const saved = localStorage.getItem('ifi_contact_v4');
    return saved ? JSON.parse(saved) : INITIAL_CONTACT;
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('ifi_inquiries');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('ifi_admin_auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('ifi_categories_v4', JSON.stringify(categories));
    localStorage.setItem('ifi_contact_v4', JSON.stringify(contact));
    localStorage.setItem('ifi_inquiries', JSON.stringify(inquiries));
  }, [categories, contact, inquiries]);

  const handleUpdateCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
  };

  const handleUpdateContact = (newContact: ContactInfo) => {
    setContact(newContact);
  };

  const handleAddInquiry = (inquiry: Inquiry) => {
    setInquiries(prev => [inquiry, ...prev]);
  };

  const handleDeleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(q => q.id !== id));
  };

  const handleLogin = () => {
    setIsAdmin(true);
    localStorage.setItem('ifi_admin_auth', 'true');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('ifi_admin_auth');
  };

  return (
    <Router>
      <ThemeProvider>
        <div className="flex flex-col min-h-screen bg-bg-base transition-colors duration-300 overflow-x-hidden">
          <Navbar isAdmin={isAdmin} onLogout={handleLogout} />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home categories={categories} contact={contact} />} />
              <Route path="/products" element={<ProductList categories={categories} />} />
              <Route path="/category/:id" element={<CategoryView categories={categories} contact={contact} />} />
              <Route path="/contact" element={<Contact contact={contact} onAddInquiry={handleAddInquiry} />} />
              <Route path="/login" element={isAdmin ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />} />
              <Route
                path="/admin"
                element={isAdmin ? (
                  <AdminDashboard
                    categories={categories}
                    onUpdate={handleUpdateCategories}
                    contact={contact}
                    onUpdateContact={handleUpdateContact}
                    inquiries={inquiries}
                    onDeleteInquiry={handleDeleteInquiry}
                  />
                ) : <Navigate to="/login" />}
              />
            </Routes>
          </main>

          <Footer contact={contact} />

        </div>
      </ThemeProvider>
    </Router>
  );
};

export default App;
