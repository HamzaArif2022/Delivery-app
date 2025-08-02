
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-food-dark mb-8">Page non trouvée</p>
      <Button asChild className="bg-primary hover:bg-primary/90">
        <Link to="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
};

export default NotFound;
