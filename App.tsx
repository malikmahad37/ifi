
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
import { subscribeToCategories, subscribeToInquiries, saveInquiry, deleteInquiry, syncCategories } from './lib/firebase';

const App: React.FC = () => {
  // --- Firebase Integration ---

  // Categories State
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  // Real-time subscription for Categories
  useEffect(() => {
    const unsubscribe = subscribeToCategories((data) => {
      if (data.length > 0) {
        setCategories(data);
      } else {
        // Fallback or empty state. 
        // If DB is empty, we might want to keep INITIAL_CATEGORIES or show nothing.
        // For now, if DB is empty, we show empty list (unless we want to auto-migrate INITIAL).
        // Let's rely on Admin "Migrate" button to populate DB first.
        setCategories([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Contact State (Keep persistent local for now, or TODO: migrate to Firebase)
  const [contact, setContact] = useState<ContactInfo>(() => {
    const saved = localStorage.getItem('ifi_contact_v4');
    return saved ? JSON.parse(saved) : INITIAL_CONTACT;
  });

  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Real-time subscription for Inquiries
  useEffect(() => {
    const unsubscribe = subscribeToInquiries((data) => {
      setInquiries(data);
    });
    return () => unsubscribe();
  }, []);

  // Admin Auth (Keep local)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('ifi_admin_auth') === 'true';
  });

  // Sync Contact to LocalStorage (Legacy)
  useEffect(() => {
    localStorage.setItem('ifi_contact_v4', JSON.stringify(contact));
  }, [contact]);

  // Handlers
  const handleUpdateCategories = async (newCategories: Category[]) => {
    try {
      // Current 'categories' state is the "old" state from DB
      // 'newCategories' is the desired state from Admin
      await syncCategories(categories, newCategories);
      // No need to setCategories here, the subscription will update it
    } catch (error) {
      console.error("FAILED TO SYNC:", error);
      alert("Error saving data: " + (error as any).message);
    }
  };

  const handleUpdateContact = (newContact: ContactInfo) => {
    setContact(newContact);
  };

  const handleAddInquiry = (inquiry: Inquiry) => {
    saveInquiry(inquiry);
  };

  const handleDeleteInquiry = (id: string) => {
    deleteInquiry(id);
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
