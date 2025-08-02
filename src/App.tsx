
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Notifications from './pages/Notifications';
import Offers from './pages/Offers';
import Header from './components/Header';
import BottomNavBar from './components/BottomNavBar';
import { Toaster } from './components/ui/toaster';
import { useIsMobile } from './hooks/use-mobile';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import PageLoader from './components/PageLoader';
import AppSidebar from './components/AppSidebar';
import { SidebarProvider } from './components/ui/sidebar';
import { AppProvider } from './contexts/AppContext';

function AppContent() {
  const isMobile = useIsMobile();
  const { isNavigating } = useNavigation();
  
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen bg-gray-50">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full">
          <Header />
          {isNavigating && <PageLoader loading={isNavigating} />}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          {isMobile && <BottomNavBar />}
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <NavigationProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </NavigationProvider>
  );
}

export default App;
