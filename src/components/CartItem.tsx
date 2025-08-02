
import React, { useState } from 'react';
import { Button } from './ui/button';
import { CartItem as CartItemType, useAppContext } from '../contexts/AppContext';
import { Minus, Plus, Edit, Trash2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from './ui/input';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateCartItemQuantity, removeFromCart, selectedCurrency } = useAppContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState(item.specialInstructions || '');

  const handleSaveInstructions = () => {
    updateCartItemQuantity(
      item.product.id, 
      item.quantity, 
      specialInstructions
    );
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-center border-b py-4">
        <div className="w-20 h-20 mr-4 overflow-hidden rounded-md">
          <img 
            src={item.product.image} 
            alt={item.product.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-grow">
          <h3 className="font-medium">{item.product.name}</h3>
          <p className="text-food-red font-bold">{item.product.price.toFixed(2)} {selectedCurrency}</p>
          {item.specialInstructions && (
            <p className="text-sm text-gray-500 mt-1">
              Note: {item.specialInstructions}
            </p>
          )}
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="px-2 text-food-red border-food-red"
            onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <span className="mx-2 min-w-[30px] text-center">{item.quantity}</span>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="px-2 text-food-red border-food-red"
            onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="w-24 text-right mx-2">
          <p className="font-bold">{(item.product.price * item.quantity).toFixed(2)} {selectedCurrency}</p>
        </div>
        
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-food-red"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-food-red"
            onClick={() => removeFromCart(item.product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier {item.product.name}</DialogTitle>
            <DialogDescription>
              Ajoutez des instructions spéciales pour cet article
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="specialInstructions" className="text-sm font-medium">
                Instructions spéciales
              </label>
              <Input
                id="specialInstructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Ex: Sans gluten, sans oignons, etc."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              className="bg-food-red hover:bg-red-700"
              onClick={handleSaveInstructions}
            >
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartItem;
