import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoHome, IoFootball, IoStatsChart, IoTrophy, IoBook, IoPerson } from 'react-icons/io5';

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: IoHome, path: '/', name: 'Inicio' },
    { icon: IoFootball, path: '/partidos', name: 'Partidos' },
    { icon: IoStatsChart, path: '/predicciones', name: 'Predicciones' },
    { icon: IoBook, path: '/album', name: 'Álbum' },
    { icon: IoPerson, path: '/perfil', name: 'Perfil' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full z-50 bg-surface/90 backdrop-blur-md border-t border-surface-2 px-6 py-3 pb-safe">
      <div className="flex justify-between items-center">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={index} 
              to={item.path}
              className="flex flex-col items-center justify-center p-2 rounded-xl transition-all"
            >
              <Icon 
                className={`text-2xl transition-all ${
                  isActive ? 'text-primary scale-110 drop-shadow-[0_0_8px_rgba(0,208,96,0.6)]' : 'text-text-muted hover:text-text'
                }`} 
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
