import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button, Card } from '../components/ui';
import { IoFootball } from 'react-icons/io5';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('¡Bienvenido de vuelta!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-3xl font-bold text-text hover:opacity-80 transition-opacity">
            <IoFootball className="text-primary text-4xl" />
            <span>MundialPulse <span className="text-primary font-black">2026</span></span>
          </Link>
        </div>

        <Card className="shadow-2xl">
          <h2 className="text-2xl font-bold text-center text-text mb-6">Iniciar Sesión</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-2 border border-surface rounded-lg px-4 py-3 text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="tu@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-2 border border-surface rounded-lg px-4 py-3 text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6 py-3 text-lg font-bold" 
              isLoading={isSubmitting}
            >
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-center text-text-muted">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Regístrate aquí
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};
