import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const VAPID_PUBLIC_KEY = 'BA-LrW7HGZPty6i-JpvKJBWJiVJmZJ4VZck6-CcdztOGBCt2yfUayukBM4pEG1VKKphD6O7MxnKDLf9ByBYS01Q';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const usePush = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { token, isAuthenticated } = useAuth();

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !isAuthenticated) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      // Enviar suscripción al backend
      await fetch(`${API_URL}/push/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subscription)
      });

      setIsSubscribed(true);
      toast.success('¡Notificaciones activadas!');
    } catch (error) {
      console.error('Error al suscribirse a Push:', error);
      toast.error('Error al activar notificaciones');
    }
  }, [token, isAuthenticated]);

  const requestPermission = useCallback(async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await subscribe();
    }
  }, [subscribe]);

  return {
    isSubscribed,
    requestPermission,
    subscribe
  };
};
