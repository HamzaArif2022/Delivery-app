
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Types
export type Category = 'plats' | 'boissons' | 'desserts';
export type CurrencyType = '€' | '$' | 'MAD';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
}

export interface Store {
  id: string;
  name: string;
  image: string;
  address: string;
  products: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  storeId: string;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'en préparation' | 'en livraison' | 'livrée';
}

interface AppContextType {
  stores: Store[];
  selectedStore: Store | null;
  setSelectedStore: (store: Store) => void;
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number, specialInstructions?: string) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: () => void;
  cartTotal: number;
  selectedCurrency: CurrencyType;
  setSelectedCurrency: (currency: CurrencyType) => void;
}

// Données de démo
const demoStores: Store[] = [
  {
    id: "1",
    name: "Restaurant Paris",
    address: "123 Avenue des Champs-Élysées, 75008 Paris",
    image: "/store-1.jpg",
    products: [
      {
        id: "101",
        name: "Burger Gourmet",
        description: "Délicieux burger avec steak de bœuf, fromage et sauce spéciale",
        price: 12.99,
        image: "/burger.jpg",
        category: "plats"
      },
      {
        id: "102",
        name: "Pizza Margherita",
        description: "Pizza traditionnelle avec sauce tomate, mozzarella et basilic",
        price: 10.50,
        image: "/pizza.jpg",
        category: "plats"
      },
      {
        id: "103",
        name: "Salade César",
        description: "Salade fraîche avec poulet grillé, parmesan et croûtons",
        price: 8.99,
        image: "/salad.jpg",
        category: "plats"
      },
      {
        id: "104",
        name: "Coca-Cola",
        description: "Boisson gazeuse rafraîchissante 33cl",
        price: 2.50,
        image: "/coke.jpg",
        category: "boissons"
      },
      {
        id: "105",
        name: "Tiramisu",
        description: "Dessert italien traditionnel au café et mascarpone",
        price: 5.99,
        image: "/tiramisu.jpg",
        category: "desserts"
      }
    ]
  },
  {
    id: "2",
    name: "Restaurant Lyon",
    address: "45 Rue de la République, 69002 Lyon",
    image: "/store-2.jpg",
    products: [
      {
        id: "201",
        name: "Quenelles sauce Nantua",
        description: "Spécialité lyonnaise avec sauce aux écrevisses",
        price: 14.50,
        image: "/quenelles.jpg",
        category: "plats"
      },
      {
        id: "202",
        name: "Salade Lyonnaise",
        description: "Salade avec lardons, croûtons et œuf poché",
        price: 9.90,
        image: "/lyonnaise-salad.jpg",
        category: "plats"
      },
      {
        id: "203",
        name: "Jus d'Orange",
        description: "Jus d'orange pressé 25cl",
        price: 3.50,
        image: "/orange-juice.jpg",
        category: "boissons"
      },
      {
        id: "204",
        name: "Tarte aux Pralines",
        description: "Dessert sucré typique de Lyon",
        price: 6.50,
        image: "/praline-pie.jpg",
        category: "desserts"
      }
    ]
  },
  {
    id: "3",
    name: "Restaurant Marseille",
    address: "15 Quai des Belges, 13001 Marseille",
    image: "/store-3.jpg",
    products: [
      {
        id: "301",
        name: "Bouillabaisse",
        description: "Soupe de poissons traditionnelle de Marseille",
        price: 18.90,
        image: "/bouillabaisse.jpg",
        category: "plats"
      },
      {
        id: "302",
        name: "Pastis",
        description: "Boisson anisée traditionnelle 4cl",
        price: 3.90,
        image: "/pastis.jpg",
        category: "boissons"
      },
      {
        id: "303",
        name: "Navettes",
        description: "Biscuits parfumés à la fleur d'oranger",
        price: 4.50,
        image: "/navettes.jpg",
        category: "desserts"
      }
    ]
  }
];

// Créer le contexte
const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext doit être utilisé à l\'intérieur d\'un AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stores] = useState<Store[]>(demoStores);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>('€');

  // Définir le premier magasin comme sélectionné par défaut
  useEffect(() => {
    if (stores.length > 0 && !selectedStore) {
      setSelectedStore(stores[0]);
    }
  }, [stores, selectedStore]);

  // Mettre à jour les produits quand le magasin sélectionné change
  useEffect(() => {
    if (selectedStore) {
      setProducts(selectedStore.products);
    }
  }, [selectedStore]);

  // Calculer le total du panier
  useEffect(() => {
    const total = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    setCartTotal(total);
  }, [cart]);

  // Ajouter un produit au panier
  const addToCart = (product: Product) => {
    if (!selectedStore) return;

    setCart(prevCart => {
      // Vérifier si le produit est déjà dans le panier
      const existingItemIndex = prevCart.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Si oui, augmenter la quantité
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        toast.success(`${product.name} ajouté au panier`);
        return updatedCart;
      } else {
        // Sinon, ajouter un nouvel élément
        toast.success(`${product.name} ajouté au panier`);
        return [...prevCart, { product, quantity: 1, storeId: selectedStore.id }];
      }
    });
  };

  // Retirer un produit du panier
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    toast.info("Produit retiré du panier");
  };

  // Mettre à jour la quantité d'un produit dans le panier
  const updateCartItemQuantity = (productId: string, quantity: number, specialInstructions?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId ? { ...item, quantity, specialInstructions } : item
      )
    );
  };

  // Vider le panier
  const clearCart = () => {
    setCart([]);
  };

  // Passer une commande
  const placeOrder = () => {
    if (cart.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      date: new Date().toISOString(),
      items: [...cart],
      total: cartTotal,
      status: 'en préparation'
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    clearCart();
    toast.success("Commande passée avec succès !");
  };

  const value: AppContextType = {
    stores,
    selectedStore,
    setSelectedStore,
    products,
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    orders,
    placeOrder,
    cartTotal,
    selectedCurrency,
    setSelectedCurrency
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
