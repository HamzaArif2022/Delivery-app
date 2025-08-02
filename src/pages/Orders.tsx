
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import OrderCard from '../components/OrderCard';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { ShoppingBag, CreditCard, Package } from 'lucide-react';
import { toast } from 'sonner';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const paymentSchema = z.object({
  paymentMethod: z.enum(['cash', 'card', 'paypal']),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  paypalEmail: z.string().email().optional(),
  promoCode: z.string().optional(),
});

const Orders = () => {
  const { orders } = useAppContext();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: 'cash',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      paypalEmail: '',
      promoCode: '',
    },
  });

  const watchPaymentMethod = form.watch('paymentMethod');

  const handlePayment = (order: string) => {
    setSelectedOrder(order);
    setIsPaymentDialogOpen(true);
  };

  const applyPromoCode = () => {
    if (promoCode === 'WELCOME10') {
      setDiscount(10);
      toast.success('Code promo appliqué: 10% de réduction');
    } else if (promoCode === 'SUMMER20') {
      setDiscount(20);
      toast.success('Code promo appliqué: 20% de réduction');
    } else {
      setDiscount(0);
      toast.error('Code promo invalide');
    }
    setIsApplyingPromo(false);
  };

  const onSubmit = (values: z.infer<typeof paymentSchema>) => {
    console.log('Payment submitted:', values);
    toast.success('Paiement effectué avec succès');
    setIsPaymentDialogOpen(false);
    form.reset();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mes Commandes</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <p className="text-food-gray text-lg mb-4">Vous n'avez pas encore passé de commande</p>
          <p className="text-food-gray">Explorez notre catalogue et passez votre première commande !</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="mb-4">
              <OrderCard order={order} />
              <div className="mt-2 flex justify-end">
                <Button 
                  onClick={() => handlePayment(order.id)}
                  className="bg-food-red hover:bg-red-700"
                >
                  <CreditCard className="mr-2" />
                  Payer maintenant
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Paiement de la Commande</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Mode de paiement</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-3 gap-4"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <RadioGroupItem value="cash" id="cash" className="sr-only" />
                          <Label
                            htmlFor="cash"
                            className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer ${
                              watchPaymentMethod === 'cash'
                                ? 'border-food-red bg-red-50'
                                : 'border-muted hover:bg-muted/10'
                            }`}
                          >
                            <Package className="mb-2 h-6 w-6" />
                            <span>Cash à la livraison</span>
                          </Label>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          <RadioGroupItem value="card" id="card" className="sr-only" />
                          <Label
                            htmlFor="card"
                            className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer ${
                              watchPaymentMethod === 'card'
                                ? 'border-food-red bg-red-50'
                                : 'border-muted hover:bg-muted/10'
                            }`}
                          >
                            <CreditCard className="mb-2 h-6 w-6" />
                            <span>Carte bancaire</span>
                          </Label>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          <RadioGroupItem value="paypal" id="paypal" className="sr-only" />
                          <Label
                            htmlFor="paypal"
                            className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer ${
                              watchPaymentMethod === 'paypal'
                                ? 'border-food-red bg-red-50'
                                : 'border-muted hover:bg-muted/10'
                            }`}
                          >
                            <ShoppingBag className="mb-2 h-6 w-6" />
                            <span>PayPal</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchPaymentMethod === 'card' && (
                <div className="space-y-3 border-t pt-3">
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de carte</FormLabel>
                        <FormControl>
                          <Input placeholder="1234 5678 9012 3456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date d'expiration</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input placeholder="123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {watchPaymentMethod === 'paypal' && (
                <div className="space-y-3 border-t pt-3">
                  <FormField
                    control={form.control}
                    name="paypalEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email PayPal</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@exemple.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="border-t pt-3">
                <h3 className="font-medium mb-2">Code Promo</h3>
                {isApplyingPromo ? (
                  <div className="flex space-x-2">
                    <Input 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Entrez votre code" 
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      onClick={applyPromoCode}
                      variant="secondary"
                    >
                      Appliquer
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span>
                      {discount > 0 
                        ? `Code "${promoCode}" appliqué: ${discount}% de réduction` 
                        : "Aucun code promo appliqué"}
                    </span>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsApplyingPromo(true)}
                    >
                      {discount > 0 ? "Changer" : "Ajouter"}
                    </Button>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full bg-food-red hover:bg-red-700">
                Confirmer le paiement
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
