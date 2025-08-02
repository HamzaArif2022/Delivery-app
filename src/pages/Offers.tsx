
import React from 'react';
import { Button } from '../components/ui/button';
import { Gift, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';

interface SpecialOffer {
  id: number;
  title: string;
  description: string;
  discount: string;
  image: string;
  backgroundColor: string;
}

const specialOffers: SpecialOffer[] = [
  {
    id: 1,
    title: "Menu Duo",
    description: "Commandez pour deux et économisez",
    discount: "20% de réduction",
    image: "/burger.jpg",
    backgroundColor: "#FFF2D3",
  },
  {
    id: 2,
    title: "Happy Hour",
    description: "Tous les jours de 15h à 18h",
    discount: "15% de réduction",
    image: "/pastis.jpg",
    backgroundColor: "#D5F0EA",
  },
  {
    id: 3,
    title: "Desserts Gourmands",
    description: "Ajoutez un dessert à votre commande",
    discount: "10% de réduction",
    image: "/tiramisu.jpg",
    backgroundColor: "#FFE8D3",
  },
  {
    id: 4,
    title: "Livraison Gratuite",
    description: "Pour toute commande supérieure à 25€",
    discount: "Livraison offerte",
    image: "/burger.jpg",
    backgroundColor: "#F5E6FF",
  },
  {
    id: 5,
    title: "Menu Végétarien",
    description: "Découvrez nos options végétariennes",
    discount: "15% de réduction",
    image: "/salad.jpg",
    backgroundColor: "#E6F7FF",
  }
];

const Offers = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { addToCart } = useAppContext();

  const handleOfferClick = (offer: SpecialOffer) => {
    const product = {
      id: `offer-${offer.id}`,
      name: offer.title,
      description: offer.description,
      price: 0,
      image: offer.image,
      category: 'plats' as const
    };
    
    addToCart(product);
    toast({
      title: "Offre ajoutée",
      description: `${offer.title} a été ajouté à votre panier`,
      duration: 3000,
    });
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 mb-20 md:mb-0">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold flex flex-wrap items-center`}>
          <Gift className="text-food-red mr-2 flex-shrink-0" /> 
          <span>Toutes les offres spéciales</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {specialOffers.map((offer) => (
          <div 
            key={offer.id} 
            className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-[1.02]"
          >
            <div 
              className={`relative ${isMobile ? 'h-32' : 'h-40'} overflow-hidden`}
              style={{ backgroundColor: offer.backgroundColor }}
            >
              <div className="absolute top-2 right-2 bg-food-red text-white px-2 py-1 rounded-md text-sm font-medium">
                {offer.discount}
              </div>
              <img 
                src={offer.image} 
                alt={offer.title} 
                className="w-full h-full object-cover opacity-90"
                loading="lazy"
              />
            </div>
            <div className="p-3 md:p-4">
              <h3 className="font-bold text-lg md:text-xl">{offer.title}</h3>
              <p className="text-food-gray text-sm md:text-base">{offer.description}</p>
              <Button 
                className="w-full mt-3 md:mt-4 bg-food-green hover:bg-food-green/90"
                onClick={() => handleOfferClick(offer)}
              >
                En profiter
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
