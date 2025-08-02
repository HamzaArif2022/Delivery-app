
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { z } from 'zod';
import { AtSign, ArrowLeft, Check } from 'lucide-react';

const emailSchema = z.string().email({ message: "Adresse e-mail invalide" });

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    try {
      emailSchema.parse(email);
      setError(null);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simulate API call for password reset
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Instructions de réinitialisation envoyées');
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 rounded-full p-3 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">Email envoyé</CardTitle>
            <CardDescription>
              Nous avons envoyé un lien de réinitialisation de mot de passe à <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            <p>Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.</p>
            <p className="mt-2">Si vous ne recevez pas d'email dans les 5 minutes, vérifiez votre dossier spam.</p>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate('/login')}
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Réinitialiser le mot de passe</CardTitle>
          <CardDescription>
            Entrez votre adresse e-mail et nous vous enverrons un lien de réinitialisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Adresse e-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 ${error ? 'border-red-500' : ''}`}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer les instructions'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-sm text-gray-600">
            Vous vous souvenez de votre mot de passe?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
