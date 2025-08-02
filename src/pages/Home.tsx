
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import SpecialOffers from '../components/SpecialOffers';
import { Category, useAppContext } from '../contexts/AppContext';
import { useIsMobile } from '../hooks/use-mobile';
import { Skeleton } from '../components/ui/skeleton';

const Home = () => {
  const { products, selectedStore } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);

  // Simulate loading state for initial app mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(product => product.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{selectedStore?.name}</h1>
      <p className="text-food-gray mb-6">Consultez notre catalogue de produits et passez commande</p>
      
      {loading ? (
        <>
          {/* Category Skeletons */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-8 w-32" />
              {isMobile && <Skeleton className="h-9 w-24" />}
            </div>
            <div className="flex gap-6 pb-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-4 w-16 mt-2" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Special Offers Skeletons */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-9 w-24" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <Skeleton className="h-40 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Skeletons */}
          <div className={`grid gap-4 ${
            isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <Skeleton className={`${isMobile ? 'h-24' : 'h-40'} w-full`} />
                <div className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <SpecialOffers />
          
          <CategoryFilter 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory} 
          />
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-food-gray text-lg">Aucun produit disponible dans cette catégorie</p>
            </div>
          ) : (
            <div className={`grid gap-4 ${
              isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
