import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { IoFootball } from 'react-icons/io5';
import PuntosWidget from '../album/PuntosWidget';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const hasLiveMatches = true; // TODO: Integrar con el estado real de partidos en vivo

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Partidos', path: '/partidos' },
    { name: 'Predicciones', path: '/predicciones' },
    { name: 'Álbum', path: '/album' },
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
              className={`font-medium transition-colors flex items-center gap-1 ${
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
          <div className="flex items-center gap-2 relative group">
            {/* Widget de puntos */}
            <PuntosWidget />

            <div className="w-px h-5 bg-slate-700 mx-1" />

            {/* Avatar clickable a perfil */}
            <Link to="/perfil" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="w-9 h-9 rounded-full bg-surface-2 overflow-hidden border-2 border-primary/50 hover:border-primary transition-colors flex-shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text font-bold uppercase text-sm">
                    {user.username.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-text hidden lg:block">{user.username}</span>
            </Link>

            {/* Dropdown on group hover */}
            <div className="absolute right-0 top-full mt-2 w-52 bg-surface-2 border border-surface rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2 border-b border-surface">
                <p className="text-xs text-text-muted px-2 py-1 truncate">{user.email}</p>
              </div>
              <div className="py-1">
                <Link to="/perfil" className="flex items-center gap-2 px-3 py-2 text-sm text-text hover:bg-surface rounded-lg mx-1 transition-colors">
                  👤 Mi Perfil
                </Link>
                <Link to="/album" className="flex items-center gap-2 px-3 py-2 text-sm text-text hover:bg-surface rounded-lg mx-1 transition-colors">
                  📖 Mi Álbum
                </Link>
                <div className="border-t border-surface my-1 mx-2" />
                <button onClick={logout} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-surface rounded-lg mx-1 transition-colors">
                  🚪 Cerrar Sesión
                </button>
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
