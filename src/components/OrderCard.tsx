
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Order } from '../contexts/AppContext';

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en préparation':
        return 'bg-yellow-200 text-yellow-800';
      case 'en livraison':
        return 'bg-blue-200 text-blue-800';
      case 'livrée':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Commande #{order.id.split('-')[1]}</CardTitle>
          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
        </div>
        <p className="text-sm text-food-gray">{formatDate(order.date)}</p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>
                {item.quantity} x {item.product.name}
              </span>
              <span className="font-medium">
                {(item.product.price * item.quantity).toFixed(2)} €
              </span>
            </div>
          ))}
          
          <div className="border-t pt-2 mt-4 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-food-red">{order.total.toFixed(2)} €</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
