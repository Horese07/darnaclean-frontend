import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AuthPage } from './pages/AuthPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { Toaster } from './components/ui/toaster';
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/admin" element={
                <AdminRoute 
                  fallbackMessage="Accès administrateur requis. Vous devez être connecté en tant qu'administrateur."
                  redirectTo="/auth"
                  showBackButton={true}
                >
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="*" element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/products/:productId" element={<ProductDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/order-success" element={<OrderSuccessPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              } />
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
