
import React, { useState } from 'react';
import CartItem from '../components/CartItem';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const Cart = () => {
  const { cart, cartTotal, clearCart, placeOrder, selectedCurrency } = useAppContext();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [promoCode, setPromoCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const isMobile = useIsMobile();

  const handleCheckout = () => {
    placeOrder();
    navigate('/orders');
  };

  const applyPromoCode = () => {
    // This would typically validate the promo code against a database
    // For demo purposes, any non-empty code gives a 10% discount
    if (promoCode.trim()) {
      setDiscount(0.1); // 10% discount
    } else {
      setDiscount(0);
    }
  };

  const finalTotal = cartTotal * (1 - discount);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold mb-4 flex items-center`}>
        <ShoppingCart className="mr-2" /> Mon Panier
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-food-gray text-xl mb-6">Votre panier est vide</p>
          <Button onClick={() => navigate('/')} className="bg-food-red hover:bg-red-700">
            Parcourir les produits
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-3 lg:p-6">
              <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-3 lg:mb-4`}>
                Articles ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
              
              <div className="divide-y">
                {cart.map((item, index) => (
                  <CartItem key={index} item={item} />
                ))}
              </div>
              
              <div className="mt-4 lg:mt-6 flex justify-end">
                <Button 
                  variant="outline" 
                  className={`text-food-red border-food-red ${isMobile ? 'text-sm py-1' : ''}`}
                  onClick={clearCart}
                >
                  Vider le panier
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader className={isMobile ? 'p-3' : undefined}>
                <CardTitle className={isMobile ? 'text-lg' : undefined}>Récapitulatif</CardTitle>
              </CardHeader>
              
              <CardContent className={`space-y-3 lg:space-y-4 ${isMobile ? 'px-3 py-2' : ''}`}>
                <div className="flex justify-between font-medium">
                  <span>Sous-total</span>
                  <span>{cartTotal.toFixed(2)} {selectedCurrency}</span>
                </div>
                
                {/* Promo Code Section */}
                <div className="pt-3 border-t">
                  <h3 className="font-bold mb-2">Code promo</h3>
                  <div className="flex gap-2">
                    <Input 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Entrez votre code"
                      className="flex-1"
                    />
                    <Button 
                      onClick={applyPromoCode}
                      className="bg-food-red hover:bg-red-700"
                    >
                      Appliquer
                    </Button>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between font-medium text-green-600 mt-2">
                      <span>Réduction</span>
                      <span>-{(cartTotal * discount).toFixed(2)} {selectedCurrency}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between font-medium">
                  <span>Frais de livraison</span>
                  <span>Gratuit</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t">
                  <span>Total</span>
                  <span className="text-food-red">{finalTotal.toFixed(2)} {selectedCurrency}</span>
                </div>

                <div className="pt-3">
                  <h3 className="font-bold mb-2">Mode de paiement</h3>
                  <RadioGroup 
                    value={selectedPaymentMethod}
                    onValueChange={setSelectedPaymentMethod}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Carte bancaire</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash">Paiement à la livraison</Label>
                    </div>
                  </RadioGroup>
                  
                  {/* Payment method specific inputs */}
                  {selectedPaymentMethod === 'card' && (
                    <div className="mt-3 space-y-2">
                      <Input placeholder="Numéro de carte" />
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="MM/AA" />
                        <Input placeholder="CVC" />
                      </div>
                      <Input placeholder="Nom sur la carte" />
                    </div>
                  )}
                  {selectedPaymentMethod === 'paypal' && (
                    <div className="mt-3">
                      <Input placeholder="Email PayPal" type="email" />
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className={isMobile ? 'p-3' : undefined}>
                <Button 
                  onClick={handleCheckout}
                  className={`w-full bg-food-red hover:bg-red-700 ${isMobile ? 'text-base py-3' : 'text-lg py-6'}`}
                >
                  Payer {finalTotal.toFixed(2)} {selectedCurrency}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
