
import React, { useState, useEffect } from 'react';
import ClickEffects from './components/ClickEffects';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import CategoryView from './pages/CategoryView';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import PageTransition from './components/PageTransition';
import { Category, ContactInfo, Inquiry } from './types';
import { INITIAL_CATEGORIES, INITIAL_CONTACT } from './constants';

import { ThemeProvider } from './context/ThemeContext';
import { subscribeToCategories, subscribeToInquiries, saveInquiry, deleteInquiry, syncCategories } from './lib/firebase';

const AppContent: React.FC = () => {
  const location = useLocation();

  // --- Firebase Integration ---

  // Categories State
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  // Real-time subscription for Categories
  useEffect(() => {
    const unsubscribe = subscribeToCategories((data) => {
      if (data.length > 0) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Contact State
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

  // Admin Auth
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('ifi_admin_auth') === 'true';
  });

  // Sync Contact
  useEffect(() => {
    localStorage.setItem('ifi_contact_v4', JSON.stringify(contact));
  }, [contact]);

  // Handlers
  const handleUpdateCategories = async (newCategories: Category[]) => {
    try {
      await syncCategories(categories, newCategories);
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
    <ThemeProvider>
      <div className="flex flex-col min-h-screen transition-colors duration-300 overflow-x-hidden">
        <Navbar isAdmin={isAdmin} onLogout={handleLogout} />
        <ClickEffects />

        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} {...({ key: location.pathname } as any)}>
              <Route path="/" element={
                <PageTransition>
                  <Home categories={categories} contact={contact} />
                </PageTransition>
              } />
              <Route path="/products" element={
                <PageTransition>
                  <ProductList categories={categories} />
                </PageTransition>
              } />
              <Route path="/category/:id" element={
                <PageTransition>
                  <CategoryView categories={categories} contact={contact} />
                </PageTransition>
              } />
              <Route path="/contact" element={
                <PageTransition>
                  <Contact contact={contact} onAddInquiry={handleAddInquiry} />
                </PageTransition>
              } />
              <Route path="/login" element={
                <PageTransition>
                  {isAdmin ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />}
                </PageTransition>
              } />
              <Route
                path="/admin"
                element={
                  <PageTransition>
                    {isAdmin ? (
                      <AdminDashboard
                        categories={categories}
                        onUpdate={handleUpdateCategories}
                        contact={contact}
                        onUpdateContact={handleUpdateContact}
                        inquiries={inquiries}
                        onDeleteInquiry={handleDeleteInquiry}
                      />
                    ) : <Navigate to="/login" />}
                  </PageTransition>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer contact={contact} />

      </div>
    </ThemeProvider>
  );
};

// ... (existing imports)

// ... (existing imports)

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
