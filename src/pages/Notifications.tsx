
import React, { useState } from 'react';
import { Bell, Info, ShoppingBag, Truck, Check, X, Loader } from 'lucide-react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface Notification {
  id: string;
  type: 'order' | 'promo' | 'info';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionLink?: string;
  actionText?: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Commande en route',
      message: 'Votre commande #12345 est en cours de livraison. Temps estimé: 20 minutes.',
      date: '2023-05-20T14:30:00',
      read: false,
      actionLink: '/orders',
      actionText: 'Voir la commande'
    },
    {
      id: '2',
      type: 'promo',
      title: 'Code promo exclusif',
      message: 'Utilisez le code WELCOME10 pour obtenir 10% de réduction sur votre prochaine commande.',
      date: '2023-05-19T09:45:00',
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Nouveau restaurant ajouté',
      message: 'Découvrez notre nouveau restaurant partenaire "Le Gourmet" avec des spécialités méditerranéennes.',
      date: '2023-05-18T11:20:00',
      read: true,
      actionLink: '/',
      actionText: 'Explorer'
    },
    {
      id: '4',
      type: 'order',
      title: 'Commande livrée',
      message: 'Votre commande #12340 a été livrée avec succès. Bon appétit!',
      date: '2023-05-17T19:15:00',
      read: true
    }
  ]);

  const isMobile = useIsMobile();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast.success('Toutes les notifications ont été marquées comme lues');
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    toast.success('Notification supprimée');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-5 h-5 text-blue-500" />;
      case 'promo':
        return <Info className="w-5 h-5 text-green-500" />;
      case 'info':
        return <Bell className="w-5 h-5 text-orange-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h1 className="text-2xl font-bold flex items-center">
          <Bell className="mr-2" /> Notifications
          {unreadCount > 0 && (
            <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-1">
              {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
            </span>
          )}
        </h1>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          className="text-xs"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <Check className="mr-1 w-4 h-4" /> Tout marquer comme lu
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full mb-6 overflow-x-auto flex-nowrap justify-start md:justify-center">
          <TabsTrigger value="all" className="flex-shrink-0">Toutes</TabsTrigger>
          <TabsTrigger value="order" className="flex-shrink-0">Commandes</TabsTrigger>
          <TabsTrigger value="promo" className="flex-shrink-0">Promos</TabsTrigger>
          <TabsTrigger value="info" className="flex-shrink-0">Infos</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <NotificationCard 
                  key={notification.id}
                  notification={notification}
                  formatDate={formatDate}
                  getIcon={getNotificationIcon}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <Bell className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500">Vous n'avez pas de notifications</p>
              </div>
            )}
          </div>
        </TabsContent>

        {['order', 'promo', 'info'].map(type => (
          <TabsContent key={type} value={type}>
            <div className="space-y-4">
              {notifications.filter(n => n.type === type).length > 0 ? (
                notifications
                  .filter(n => n.type === type)
                  .map(notification => (
                    <NotificationCard 
                      key={notification.id}
                      notification={notification}
                      formatDate={formatDate}
                      getIcon={getNotificationIcon}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  ))
              ) : (
                <div className="text-center py-10">
                  <Bell className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">Aucune notification dans cette catégorie</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

interface NotificationCardProps {
  notification: Notification;
  formatDate: (date: string) => string;
  getIcon: (type: string) => React.ReactNode;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationCard = ({ 
  notification, 
  formatDate, 
  getIcon,
  onMarkAsRead,
  onDelete
}: NotificationCardProps) => {
  return (
    <Card className={`relative ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="absolute top-3 right-3 flex space-x-1">
          {!notification.read && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => onMarkAsRead(notification.id)}
              title="Marquer comme lu"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-red-500 hover:text-red-700" 
            onClick={() => onDelete(notification.id)}
            title="Supprimer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex">
          <div className="mr-4 mt-1 flex-shrink-0">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 pr-16 sm:pr-8">
            <h3 className="font-semibold text-base">{notification.title}</h3>
            <p className="text-sm text-gray-600 my-1">{notification.message}</p>
            <div className="flex flex-wrap justify-between items-center mt-2 gap-2">
              <span className="text-xs text-gray-500">{formatDate(notification.date)}</span>
              {notification.actionLink && (
                <Link 
                  to={notification.actionLink} 
                  className="text-sm text-primary hover:underline font-semibold"
                >
                  {notification.actionText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// This ensures the Link component is available in the file
import { Link } from 'react-router-dom';

export default Notifications;
