
import React from 'react';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Product, useAppContext } from '../contexts/AppContext';
import { useIsMobile } from '../hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import ProductComposition from './ProductComposition';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useAppContext();
  const isMobile = useIsMobile();
  const [showComposition, setShowComposition] = React.useState(false);

  const handleAddToCart = () => {
    // Only show composition for food items (plats)
    if (product.category === 'plats') {
      setShowComposition(true);
    } else {
      addToCart(product);
    }
  };

  return (
    <>
      <Card className="overflow-hidden h-full flex flex-col">
        <div className={`${isMobile ? 'h-24' : 'h-40'} overflow-hidden`}>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
        
        <CardContent className={`${isMobile ? 'p-2' : 'pt-4'} flex-grow`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className={`font-bold ${isMobile ? 'text-xs' : 'text-lg'}`}>{product.name}</h3>
            <span className={`font-bold text-food-red ${isMobile ? 'text-xs' : ''}`}>{product.price.toFixed(2)} €</span>
          </div>
          <p className={`text-food-gray ${isMobile ? 'text-xs line-clamp-2' : 'text-sm'}`}>
            {product.description}
          </p>
        </CardContent>
        
        <CardFooter className={`${isMobile ? 'p-2' : 'pt-0'}`}>
          <Button 
            onClick={handleAddToCart} 
            className={`w-full bg-food-red hover:bg-red-700 text-white ${isMobile ? 'text-xs py-1' : ''}`}
          >
            Ajouter au panier
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showComposition} onOpenChange={setShowComposition}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complétez votre commande</DialogTitle>
          </DialogHeader>
          <ProductComposition 
            mainProduct={product} 
            onComplete={() => setShowComposition(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
