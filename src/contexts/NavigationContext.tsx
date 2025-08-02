
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationContextType {
  isNavigating: boolean;
  startNavigation: () => void;
  endNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  startNavigation: () => {},
  endNavigation: () => {}
});

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();

  const startNavigation = () => setIsNavigating(true);
  const endNavigation = () => setIsNavigating(false);

  // Set a small artificial delay to show the loader
  useEffect(() => {
    startNavigation();
    const timer = setTimeout(() => {
      endNavigation();
    }, 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <NavigationContext.Provider value={{ isNavigating, startNavigation, endNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
};
