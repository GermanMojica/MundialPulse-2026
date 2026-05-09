import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button, Card } from '../components/ui';
import { IoFootball } from 'react-icons/io5';
import toast from 'react-hot-toast';
import SobreModal from '../components/album/SobreModal';

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sobreAbierto, setSobreAbierto] = useState(false);
  const [sobreData, setSobreData] = useState([]);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await register(formData.email, formData.password, formData.username);
      if (res && res.sobreRegalo) {
        setSobreData(res.sobreRegalo.figuritas || []);
        setSobreAbierto(true);
      } else {
        toast.success('¡Registro exitoso!');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al registrarse');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-3xl font-bold text-text hover:opacity-80 transition-opacity">
            <IoFootball className="text-primary text-4xl" />
            <span>MundialPulse <span className="text-primary font-black">2026</span></span>
          </Link>
        </div>

        <Card className="shadow-2xl">
          <h2 className="text-2xl font-bold text-center text-text mb-6">Crear Cuenta</h2>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Nombre de Usuario</label>
              <input 
                name="username"
                type="text" 
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-surface-2 border border-surface rounded-lg px-4 py-3 text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="mundialfan26"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Correo Electrónico</label>
              <input 
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-surface-2 border border-surface rounded-lg px-4 py-3 text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="tu@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Contraseña</label>
              <input 
                name="password"
                type="password" 
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-surface-2 border border-surface rounded-lg px-4 py-3 text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Confirmar Contraseña</label>
              <input 
                name="confirmPassword"
                type="password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-surface-2 border border-surface rounded-lg px-4 py-3 text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="••••••••"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6 py-3 text-lg font-bold" 
              isLoading={isSubmitting}
            >
              Regístrate
            </Button>
          </form>

          <p className="mt-6 text-center text-text-muted">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Inicia sesión aquí
            </Link>
          </p>
        </Card>
      </div>

      {/* Modal de recompensa */}
      <SobreModal 
        isOpen={sobreAbierto} 
        onClose={() => navigate('/')} 
        figuritas={sobreData} 
        tipo="basico"
        title="Bienvenido a MundialPulse — tu sobre de regalo"
      />
    </div>
  );
};

export default Register;
