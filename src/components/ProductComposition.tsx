
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Product, useAppContext } from '../contexts/AppContext';
import { useIsMobile } from '../hooks/use-mobile';
import { Check, X } from 'lucide-react';

interface ProductCompositionProps {
  mainProduct: Product;
  onComplete: () => void;
}

// Helper function to filter products by category
const filterProductsByCategory = (products: Product[], category: 'boissons' | 'desserts') => {
  return products.filter(p => p.category === category);
};

const ProductComposition = ({ mainProduct, onComplete }: ProductCompositionProps) => {
  const { products, addToCart } = useAppContext();
  const isMobile = useIsMobile();
  
  const [selectedDrink, setSelectedDrink] = useState<Product | null>(null);
  const [selectedSide, setSelectedSide] = useState<Product | null>(null);
  const [currentStep, setCurrentStep] = useState<'drinks' | 'sides' | 'summary'>('drinks');
  
  const drinks = filterProductsByCategory(products, 'boissons');
  const sides = filterProductsByCategory(products, 'desserts'); // Using desserts as "sides" for demonstration
  
  const totalPrice = 
    mainProduct.price + 
    (selectedDrink ? selectedDrink.price : 0) + 
    (selectedSide ? selectedSide.price : 0);
  
  const handleComplete = () => {
    // Add main product to cart
    addToCart(mainProduct);
    
    // Add complements if selected
    if (selectedDrink) addToCart(selectedDrink);
    if (selectedSide) addToCart(selectedSide);
    
    onComplete();
  };
  
  const handleSkip = () => {
    if (currentStep === 'drinks') {
      setCurrentStep('sides');
    } else if (currentStep === 'sides') {
      setCurrentStep('summary');
    }
  };
  
  const handleNext = () => {
    if (currentStep === 'drinks') {
      setCurrentStep('sides');
    } else if (currentStep === 'sides') {
      setCurrentStep('summary');
    }
  };
  
  return (
    <div className="py-4">
      {currentStep === 'drinks' && (
        <div>
          <h3 className="text-lg font-medium mb-4">Choisissez votre boisson</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {drinks.map((drink) => (
              <div 
                key={drink.id}
                onClick={() => setSelectedDrink(selectedDrink?.id === drink.id ? null : drink)}
                className={`border rounded-lg p-3 cursor-pointer flex flex-col items-center
                  ${selectedDrink?.id === drink.id ? 'border-food-red bg-red-50' : 'border-gray-200'}
                `}
              >
                <div className="w-16 h-16 mb-2">
                  <img 
                    src={drink.image} 
                    alt={drink.name} 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <p className="font-medium text-center">{drink.name}</p>
                <p className="text-food-red text-sm">+{drink.price.toFixed(2)} €</p>
                
                {selectedDrink?.id === drink.id && (
                  <div className="absolute top-2 right-2">
                    <Check className="text-food-red" size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="ghost" 
              onClick={handleSkip}
            >
              Aucune boisson
            </Button>
            
            <Button 
              onClick={handleNext}
              className="bg-food-red hover:bg-red-700"
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
      
      {currentStep === 'sides' && (
        <div>
          <h3 className="text-lg font-medium mb-4">Ajoutez un accompagnement</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {sides.map((side) => (
              <div 
                key={side.id}
                onClick={() => setSelectedSide(selectedSide?.id === side.id ? null : side)}
                className={`border rounded-lg p-3 cursor-pointer flex flex-col items-center
                  ${selectedSide?.id === side.id ? 'border-food-red bg-red-50' : 'border-gray-200'}
                `}
              >
                <div className="w-16 h-16 mb-2">
                  <img 
                    src={side.image} 
                    alt={side.name} 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <p className="font-medium text-center">{side.name}</p>
                <p className="text-food-red text-sm">+{side.price.toFixed(2)} €</p>
                
                {selectedSide?.id === side.id && (
                  <div className="absolute top-2 right-2">
                    <Check className="text-food-red" size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="ghost" 
              onClick={handleSkip}
            >
              Aucun accompagnement
            </Button>
            
            <Button 
              onClick={handleNext}
              className="bg-food-red hover:bg-red-700"
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
      
      {currentStep === 'summary' && (
        <div>
          <h3 className="text-lg font-medium mb-4">Récapitulatif</h3>
          
          <div className="border rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="font-medium">{mainProduct.name}</span>
              <span>{mainProduct.price.toFixed(2)} €</span>
            </div>
            
            {selectedDrink && (
              <div className="flex justify-between items-center py-2 border-b">
                <span>{selectedDrink.name}</span>
                <span>{selectedDrink.price.toFixed(2)} €</span>
              </div>
            )}
            
            {selectedSide && (
              <div className="flex justify-between items-center py-2 border-b">
                <span>{selectedSide.name}</span>
                <span>{selectedSide.price.toFixed(2)} €</span>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-2 font-bold">
              <span>Total</span>
              <span className="text-food-red">{totalPrice.toFixed(2)} €</span>
            </div>
          </div>
          
          <Button 
            onClick={handleComplete}
            className="w-full bg-food-red hover:bg-red-700"
          >
            Ajouter au panier • {totalPrice.toFixed(2)} €
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductComposition;
