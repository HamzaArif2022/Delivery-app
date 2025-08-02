import React, { useState } from 'react';
import { Category } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Pizza, Sandwich, GlassWater, IceCream } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

interface CategoryFilterProps {
  activeCategory: Category | 'all';
  setActiveCategory: (category: Category | 'all') => void;
}

const getCategoryImage = (category: Category | 'all'): string => {
  switch (category) {
    case 'plats':
      return '/burger.jpg';
    case 'boissons':
      return '/coke.jpg';
    case 'desserts':
      return '/salad.jpg';
    case 'all':
    default:
      return '/pizza.jpg';
  }
};

const getCategoryIcon = (category: Category | 'all') => {
  switch (category) {
    case 'plats':
      return <Sandwich className="h-6 w-6" />;
    case 'boissons':
      return <GlassWater className="h-6 w-6" />;
    case 'desserts':
      return <IceCream className="h-6 w-6" />;
    case 'all':
    default:
      return <Pizza className="h-6 w-6" />;
  }
};

const CategoryFilter = ({ activeCategory, setActiveCategory }: CategoryFilterProps) => {
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const categories: (Category | 'all')[] = ['all', 'plats', 'boissons', 'desserts'];

  // For mobile, we'll only show 3 categories plus "See All"
  const displayedCategories = isMobile ? categories.slice(0, 3) : categories;
  
  const handleCategoryClick = (category: Category | 'all') => {
    setActiveCategory(category);
    setIsDialogOpen(false);
  };

  const getCategoryName = (category: Category | 'all'): string => {
    return category === 'all' ? 'Tous' : category.charAt(0).toUpperCase() + category.slice(1);
  };

  const CategoryItem = ({ category }: { category: Category | 'all' }) => (
    <div
      className={`flex flex-col items-center cursor-pointer transition-all ${
        activeCategory === category ? 'scale-105' : ''
      }`}
      onClick={() => handleCategoryClick(category)}
    >
      <div
        className={`rounded-full overflow-hidden h-16 w-16 mb-2 border-2 ${
          activeCategory === category ? 'border-food-red' : 'border-transparent'
        }`}
      >
        <img 
          src={getCategoryImage(category)} 
          alt={getCategoryName(category)} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <span className={`text-sm ${
        activeCategory === category ? 'text-food-red font-bold' : 'text-food-gray'
      }`}>
        {getCategoryName(category)}
      </span>
    </div>
  );

  const CategoryItemForDialog = ({ category }: { category: Category | 'all' }) => (
    <div
      className={`flex items-center gap-4 p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors ${
        activeCategory === category ? 'bg-food-red/10' : ''
      }`}
      onClick={() => handleCategoryClick(category)}
    >
      <div
        className={`rounded-full overflow-hidden h-14 w-14 border-2 flex-shrink-0 ${
          activeCategory === category ? 'border-food-red' : 'border-transparent'
        }`}
      >
        <img 
          src={getCategoryImage(category)} 
          alt={getCategoryName(category)} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <span className={`text-base ${
        activeCategory === category ? 'text-food-red font-bold' : 'text-food-gray'
      }`}>
        {getCategoryName(category)}
      </span>
    </div>
  );

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl">Catégories</h2>
        <Button 
          variant="outline" 
          className="text-food-red border-food-red"
          onClick={() => setIsDialogOpen(true)}
        >
          Voir tout
        </Button>
      </div>
      
      <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-hide">
        {displayedCategories.map(category => (
          <CategoryItem key={category} category={category} />
        ))}
      </div>

      {/* Categories Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md w-[95%] max-w-[95%] sm:max-w-md dialog-content">
          <DialogHeader>
            <DialogTitle className="text-center">Toutes les catégories</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] max-h-[60vh] pr-4">
            <div className="grid grid-cols-1 gap-3 py-2">
              {categories.map(category => (
                <CategoryItemForDialog key={category} category={category} />
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryFilter;
