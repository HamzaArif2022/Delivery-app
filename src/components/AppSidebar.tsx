
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar
} from "@/components/ui/sidebar";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  ShoppingCart, 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  ClipboardList, 
  Heart, 
  Gift, 
  Store, 
  Percent,
  ChevronLeft
} from 'lucide-react';

const AppSidebar = () => {
  const location = useLocation();
  const { cart, selectedStore } = useAppContext();
  const { toggleSidebar } = useSidebar();
  
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  const mainNavItems = [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Commandes', path: '/orders', icon: ClipboardList },
    { name: 'Panier', path: '/cart', icon: ShoppingCart, badge: totalItems > 0 ? totalItems : null },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: 2 },
  ];
  
  const secondaryNavItems = [
    { name: 'Offres spéciales', path: '#special-offers', icon: Gift },
    { name: 'Réductions', path: '#discounts', icon: Percent },
    { name: 'Favoris', path: '#favorites', icon: Heart },
  ];

  return (
    <Sidebar variant="floating">
      <SidebarHeader className="pb-2">
        <div className="flex items-center justify-between p-2">
          <div className="flex-1 flex items-center gap-2">
            <Avatar className="h-8 w-8 border border-primary">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary text-white text-sm">FD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
              <span className="font-semibold">Food Delivery</span>
              <span className="text-xs text-muted-foreground">Application</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={toggleSidebar}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.path}
                    tooltip={item.name}
                  >
                    <Link to={item.path} className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </span>
                      {item.badge && (
                        <Badge 
                          className="ml-auto bg-primary hover:bg-primary text-primary-foreground" 
                          variant="default"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupLabel>Découvrir</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    variant="outline"
                    tooltip={item.name}
                  >
                    <Link to={item.path} className="flex items-center w-full">
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {selectedStore && (
          <>
            <SidebarSeparator />
            
            <SidebarGroup>
              <SidebarGroupLabel>Restaurant sélectionné</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="p-2 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md overflow-hidden">
                      <img 
                        src={selectedStore.image} 
                        alt={selectedStore.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{selectedStore.name}</h4>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {selectedStore.address}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-2 text-xs flex items-center justify-center gap-1 text-food-green"
                  >
                    <Store className="h-3 w-3" />
                    Changer de restaurant
                  </Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profil</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Paramètres</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton variant="outline" className="text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
