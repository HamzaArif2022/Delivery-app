
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from './ui/button';
import { Gift, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from './ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

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
  }
];

const SpecialOffers = () => {
  const isMobile = useIsMobile();
  const { addToCart } = useAppContext();
  const navigate = useNavigate();
  const [api, setApi] = useState<any>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Setup autoplay for mobile
  const startAutoplay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    
    autoPlayRef.current = setInterval(() => {
      if (api && api.canScrollNext()) {
        api.scrollNext();
      } else if (api) {
        // Reset to the first slide when we reach the end
        api.scrollTo(0);
      }
    }, 3000); // Scroll every 3 seconds
  }, [api]);

  // Handle autoplay for mobile
  useEffect(() => {
    if (isMobile && api) {
      startAutoplay();
    }
    
    // Clean up the interval when the component unmounts
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isMobile, api, startAutoplay]);

  // Function to handle "En profiter" button click
  const handleOfferClick = (offer: SpecialOffer) => {
    const product = {
      id: `offer-${offer.id}`,
      name: offer.title,
      description: offer.description,
      price: 0, // Special offers might have custom pricing logic
      image: offer.image,
      category: 'plats' as const
    };
    
    addToCart(product);
  };

  // Function to handle "Voir tout" button click
  const handleViewAllClick = () => {
    navigate('/offers');
  };

  return (
    <div className="py-4 md:py-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Gift className="text-food-red" />
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>Offres Spéciales</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-food-green flex items-center gap-1"
          onClick={handleViewAllClick}
        >
          Voir tout <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {specialOffers.map((offer) => (
            <CarouselItem 
              key={offer.id} 
              className={
                isMobile 
                  ? "pl-2 basis-3/4 md:basis-1/2" 
                  : "pl-4 md:basis-1/3 lg:basis-1/4"
              }
            >
              <Card className="overflow-hidden border-none shadow-md">
                <div 
                  className={`relative ${isMobile ? 'h-32' : 'h-40'} overflow-hidden`}
                  style={{ backgroundColor: offer.backgroundColor }}
                >
                  <Badge className="absolute top-2 right-2 bg-food-red hover:bg-food-red/90 z-10">
                    {offer.discount}
                  </Badge>
                  <img 
                    src={offer.image} 
                    alt={offer.title} 
                    className="w-full h-full object-cover opacity-90"
                    loading="lazy"
                  />
                </div>
                <CardContent className={`${isMobile ? 'pt-2 px-3' : 'pt-4'}`}>
                  <h3 className={`font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>{offer.title}</h3>
                  <p className="text-food-gray text-sm">{offer.description}</p>
                </CardContent>
                <CardFooter className={isMobile ? 'p-3 pt-1' : ''}>
                  <Button 
                    size={isMobile ? "sm" : "default"}
                    className="w-full bg-food-green hover:bg-food-green/90"
                    onClick={() => handleOfferClick(offer)}
                  >
                    En profiter
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {!isMobile && (
          <>
            <CarouselPrevious className="-left-4 md:-left-12 border-food-green text-food-green" />
            <CarouselNext className="-right-4 md:-right-12 border-food-green text-food-green" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default SpecialOffers;
