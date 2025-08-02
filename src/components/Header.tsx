
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Button } from './ui/button';
import { 
  ShoppingCart, 
  User,
  Bell,
  ChevronDown,
  Store,
  Search,
  Menu,
  X,
  PanelLeft
} from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";

const currencySymbols = {
  '€': 'EUR',
  '$': 'USD',
  'MAD': 'MAD'
};

type CurrencyType = '€' | '$' | 'MAD';

const Header = () => {
  const { cart, selectedStore, stores, setSelectedStore, selectedCurrency, setSelectedCurrency } = useAppContext();
  const [isStoreDialogOpen, setIsStoreDialogOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  const { open } = useSidebar();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    setIsSearchOpen(false);
    // Here you would implement the actual search functionality
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {isMobile ? (
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="mr-2 text-white p-1">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-4">
                  <SheetClose asChild>
                    <Link to="/" className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center">
                      Accueil
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/orders" className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center">
                      Commandes
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/notifications" className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center">
                      Notifications
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/profile" className="px-4 py-2 hover:bg-gray-100 rounded-md flex items-center">
                      Profil
                    </Link>
                  </SheetClose>
                  
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium mb-2">Devise</p>
                    <div className="flex gap-2">
                      {Object.entries(currencySymbols).map(([symbol, name]) => (
                        <Button 
                          key={symbol}
                          variant={selectedCurrency === symbol ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCurrency(symbol as CurrencyType)}
                        >
                          {symbol}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <SidebarTrigger className="mr-2 text-white hover:bg-primary-foreground/10" />
          )}
          <Link to="/" className="text-2xl font-bold">FoodApp</Link>
        </div>
        
        {!isMobile && (
          <nav className="flex items-center space-x-4 ml-auto mr-4">
            <Link to="/" className="hover:underline">Accueil</Link>
            <Link to="/orders" className="hover:underline">Commandes</Link>
            
            {/* Currency Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white">
                  {selectedCurrency}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.entries(currencySymbols).map(([symbol, name]) => (
                  <DropdownMenuItem 
                    key={symbol}
                    onClick={() => setSelectedCurrency(symbol as CurrencyType)}
                  >
                    {symbol} ({name})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        )}
        
        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Search Icon */}
          <Button variant="ghost" className="text-white p-2" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="w-5 h-5" />
          </Button>
          
          {/* Store Icon */}
          <Button 
            variant="ghost"
            onClick={() => setIsStoreDialogOpen(true)}
            className="text-white flex items-center gap-1 hover:bg-primary/20 p-2"
          >
            <Store className="w-5 h-5" />
            {!isMobile && (
              <span className="truncate max-w-[120px] hidden md:block">
                {selectedStore?.name || "Sélectionner"}
              </span>
            )}
          </Button>
          
          {/* Notifications Link */}
          <Link to="/notifications">
            <Button variant="ghost" className="text-white relative p-2">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-white text-primary rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                2
              </span>
            </Button>
          </Link>
          
          {/* These buttons only appear on desktop since they're in the bottom nav on mobile */}
          {!isMobile && (
            <>
              {/* Profile Link */}
              <Link to="/profile">
                <Button variant="ghost" className="text-white p-2">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              
              {/* Cart Link */}
              <Link to="/cart" className="relative">
                <Button variant="ghost" className="text-white p-2">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-primary rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
            </>
          )}
        </div>
        
        <Dialog open={isStoreDialogOpen} onOpenChange={setIsStoreDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Choisir un magasin</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {stores.map(store => (
                <div 
                  key={store.id} 
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedStore(store);
                    setIsStoreDialogOpen(false);
                  }}
                >
                  <div className="w-16 h-16 rounded-md overflow-hidden mr-3">
                    <img 
                      src={store.image} 
                      alt={store.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{store.name}</h3>
                    <p className="text-sm text-gray-500">{store.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Search Bar (slides down when search icon is clicked) */}
      {isSearchOpen && (
        <div className="bg-white py-3 px-4 border-b border-gray-200 transition-all duration-300">
          <form onSubmit={handleSearch} className="container mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Rechercher des produits, catégories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
              <div className="absolute right-1 top-1">
                <Button 
                  type="submit" 
                  size="sm"
                  className="bg-primary text-white mr-1"
                >
                  Rechercher
                </Button>
                <Button 
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
