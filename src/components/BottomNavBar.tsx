
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, ClipboardList, User, Bell } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useIsMobile } from '../hooks/use-mobile';

const BottomNavBar = () => {
  const location = useLocation();
  const { cart } = useAppContext();
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
      <div className="flex justify-around items-center h-16">
        <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-primary' : 'text-food-gray'}`}>
          <Home size={24} />
          <span className="text-xs mt-1">Accueil</span>
        </Link>
        
        <Link to="/cart" className={`flex flex-col items-center ${location.pathname === '/cart' ? 'text-primary' : 'text-food-gray'}`}>
          <div className="relative">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-xs mt-1">Panier</span>
        </Link>
        
        <Link to="/notifications" className={`flex flex-col items-center ${location.pathname === '/notifications' ? 'text-primary' : 'text-food-gray'}`}>
          <div className="relative">
            <Bell size={24} />
            <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              2
            </span>
          </div>
          <span className="text-xs mt-1">Notifs</span>
        </Link>
        
        <Link to="/orders" className={`flex flex-col items-center ${location.pathname === '/orders' ? 'text-primary' : 'text-food-gray'}`}>
          <ClipboardList size={24} />
          <span className="text-xs mt-1">Commandes</span>
        </Link>
        
        <Link to="/profile" className={`flex flex-col items-center ${location.pathname === '/profile' ? 'text-primary' : 'text-food-gray'}`}>
          <User size={24} />
          <span className="text-xs mt-1">Profil</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavBar;
