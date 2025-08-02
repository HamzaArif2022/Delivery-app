
import React, { useState } from 'react';
import { User, Settings, LogOut, Trash2, Languages, History, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { orders } = useAppContext();
  
  // Mock user data - in a real app this would come from your auth context
  const [userData, setUserData] = useState({
    id: '123',
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de Paris, 75001 Paris',
    avatarUrl: '', // Empty for now, will use fallback
    location: {
      latitude: 43.296482,
      longitude: 5.369780,
    }
  });

  // Mock nearby stores data
  const [nearbyStores] = useState([
    { id: 1, name: "FoodApp Marseille Centre", address: "45 La Canebière, 13001 Marseille", distance: "0.4 km" },
    { id: 2, name: "FoodApp Vieux Port", address: "12 Quai du Port, 13002 Marseille", distance: "1.2 km" },
    { id: 3, name: "FoodApp Prado", address: "150 Avenue du Prado, 13008 Marseille", distance: "2.5 km" },
  ]);

  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({...userData});

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({...formData});
    setIsEditing(false);
    // In a real app, you would send this data to your backend
    alert('Profil mis à jour avec succès!');
  };

  const handleLogout = () => {
    // In a real app, you would log the user out here
    alert('Vous avez été déconnecté');
    navigate('/');
  };

  const handleDeleteAccount = () => {
    // In a real app, you would delete the account here
    alert('Compte supprimé avec succès');
    navigate('/');
  };

  const handleLanguageChange = (code) => {
    setSelectedLanguage(code);
    // In a real app, you would update the language in your i18n system
    alert(`Langue changée en ${code}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <User className="mr-2" /> Mon Profil
      </h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className={`bg-food-red text-white p-6 flex ${isMobile ? 'flex-col items-center' : 'justify-between items-center'}`}>
          <div className="flex items-center">
            <Avatar className="h-20 w-20 border-4 border-white">
              <AvatarImage src={userData.avatarUrl} alt={userData.name} />
              <AvatarFallback className="bg-food-light text-food-red text-xl">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className={`${isMobile ? 'text-center mt-4' : 'ml-6'}`}>
              <h2 className="text-2xl font-bold">{userData.name}</h2>
              <p className="opacity-80">{userData.email}</p>
            </div>
          </div>
          {!isEditing && (
            <Button 
              variant="outline" 
              className="bg-white text-food-red hover:bg-food-light mt-4 md:mt-0"
              onClick={() => setIsEditing(true)}
            >
              <Settings className="mr-2" size={18} />
              Modifier mon profil
            </Button>
          )}
        </div>

        <Tabs defaultValue="information" className="p-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="information">Information</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="location">Localisation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="information">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <Input 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <Input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <Textarea 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setFormData({...userData});
                        setIsEditing(false);
                      }}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" className="bg-food-red hover:bg-food-red/80">
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Mes Informations</h3>
                  <div className="bg-food-light p-4 rounded-lg space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <span className="font-medium w-32">Téléphone:</span>
                      <span>{userData.phone}</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-start">
                      <span className="font-medium w-32">Adresse:</span>
                      <span>{userData.address}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Préférences</h3>
                  <div className="bg-food-light p-4 rounded-lg">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Languages className="mr-2" size={18} />
                          Langue: {languages.find(l => l.code === selectedLanguage)?.name}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Changer de langue</DialogTitle>
                          <DialogDescription>
                            Sélectionnez la langue de votre choix
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-2 py-4">
                          {languages.map((lang) => (
                            <Button 
                              key={lang.code}
                              variant={selectedLanguage === lang.code ? "default" : "outline"}
                              className={selectedLanguage === lang.code ? "bg-food-red hover:bg-food-red/90" : ""}
                              onClick={() => handleLanguageChange(lang.code)}
                            >
                              {lang.name}
                            </Button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-amber-600 border-amber-200 hover:bg-amber-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2" size={18} />
                    Déconnexion
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="mr-2" size={18} />
                        Supprimer mon compte
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action ne peut pas être annulée. Cela supprimera définitivement votre
                          compte et toutes les données associées.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={handleDeleteAccount}
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <History size={20} />
              <h3 className="text-lg font-medium">Historique des commandes</h3>
            </div>
            
            {orders.length === 0 ? (
              <div className="text-center py-10 bg-food-light rounded-lg">
                <p className="text-food-gray text-lg mb-4">Vous n'avez pas encore passé de commande</p>
                <p className="text-food-gray">Explorez notre catalogue et passez votre première commande !</p>
                <Button 
                  className="bg-food-red hover:bg-food-red/90 mt-6" 
                  onClick={() => navigate('/')}
                >
                  Explorer les produits
                </Button>
              </div>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Commande #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id.split('-')[1]}</TableCell>
                        <TableCell>{formatDate(order.date)}</TableCell>
                        <TableCell>{order.total.toFixed(2)} €</TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                            ${order.status === 'en préparation' ? 'bg-yellow-200 text-yellow-800' : ''}
                            ${order.status === 'en livraison' ? 'bg-blue-200 text-blue-800' : ''}
                            ${order.status === 'livrée' ? 'bg-green-200 text-green-800' : ''}
                          `}>
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/orders`)}>
                            Détails
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="location" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} />
              <h3 className="text-lg font-medium">Ma localisation</h3>
            </div>
            
            <div className="bg-food-light p-4 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground mb-3">Votre position actuelle:</p>
              <p className="font-semibold">{userData.address}</p>
              {/* Here we'd display an actual map with the user's location if we had integrated MapBox */}
              <div className="w-full h-40 bg-gray-200 rounded-md mt-4 flex items-center justify-center text-gray-500">
                Carte de localisation
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-base font-semibold">Magasins à proximité de votre position</h4>
              
              {nearbyStores.map(store => (
                <Card key={store.id} className="overflow-hidden">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-base flex justify-between">
                      <span>{store.name}</span>
                      <span className="text-food-red font-normal">{store.distance}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-3 px-4 pt-0">
                    <p className="text-sm text-muted-foreground">{store.address}</p>
                    <Button variant="link" className="text-food-red p-0 h-auto" onClick={() => navigate('/')}>
                      Voir les produits
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
