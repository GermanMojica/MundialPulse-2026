import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { IoFootball } from 'react-icons/io5';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const hasLiveMatches = true; // TODO: Integrar con el estado real de partidos en vivo

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Partidos', path: '/partidos' },
    { name: 'Predicciones', path: '/predicciones' },
    { name: 'Ranking', path: '/ranking' },
    { name: 'Mapa', path: '/mapa' },
  ];

  return (
    <nav className="hidden md:flex fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-surface-2 items-center justify-between px-6 py-4">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-text hover:opacity-80 transition-opacity">
        <IoFootball className="text-primary text-2xl" />
        <span>MundialPulse <span className="text-primary font-black">2026</span></span>
      </Link>

      {/* Links Center */}
      <div className="flex items-center gap-6">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-text-muted hover:text-text'
              } relative`}
            >
              {link.name}
              {link.name === 'Partidos' && hasLiveMatches && (
                <span className="absolute -top-1 -right-2 w-2 h-2 bg-primary rounded-full animate-ping"></span>
              )}
              {link.name === 'Partidos' && hasLiveMatches && (
                <span className="absolute -top-1 -right-2 w-2 h-2 bg-primary rounded-full"></span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Actions Right */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3 relative group">
            <span className="text-sm font-medium text-text">{user.username}</span>
            <div className="w-10 h-10 rounded-full bg-surface-2 overflow-hidden border-2 border-primary/50 cursor-pointer">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text font-bold uppercase">
                  {user.username.charAt(0)}
                </div>
              )}
            </div>
            
            {/* Dropdown menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-surface-2 border border-surface rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-2">
                <Link to="/perfil" className="block px-4 py-2 text-sm text-text hover:bg-surface transition-colors">Mi Perfil</Link>
                <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-surface transition-colors">Cerrar Sesión</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link to="/login" className="text-sm font-medium text-text hover:text-primary transition-colors py-2">Ingresar</Link>
            <Link to="/register" className="text-sm font-medium bg-primary text-bg px-4 py-2 rounded-full hover:bg-opacity-90 transition-all">Regístrate</Link>
          </div>
        )}
      </div>
    </nav>
  );
};
