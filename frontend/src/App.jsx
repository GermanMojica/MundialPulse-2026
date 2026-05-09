import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Partidos } from './pages/Partidos';
import { PartidoDetalle } from './pages/PartidoDetalle';
import { Predicciones } from './pages/Predicciones';
import { Mapa } from './pages/Mapa';
import Album from './pages/Album';
import AlbumPais from './pages/AlbumPais';
import Perfil from './pages/Perfil';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Placeholder pages for the rest
const Ranking = () => <div className="p-8"><h1 className="text-3xl font-bold text-text mb-4">Ranking</h1></div>;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Toaster 
              position="top-center" 
              toastOptions={{ 
                style: { 
                  background: '#1a1a26', 
                  color: '#ffffff',
                  border: '1px solid #2e303a'
                } 
              }} 
            />
            
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="partidos" element={<Partidos />} />
                <Route path="partidos/:id" element={<PartidoDetalle />} />
                
                <Route path="predicciones" element={
                  <ProtectedRoute>
                    <Predicciones />
                  </ProtectedRoute>
                } />
                <Route path="ranking" element={
                  <ProtectedRoute>
                    <Ranking />
                  </ProtectedRoute>
                } />
                
                <Route path="album" element={
                  <ProtectedRoute>
                    <Album />
                  </ProtectedRoute>
                } />
                <Route path="album/pais/:codigo" element={
                  <ProtectedRoute>
                    <AlbumPais />
                  </ProtectedRoute>
                } />
                
                <Route path="mapa" element={<Mapa />} />
                
                <Route path="perfil" element={
                  <ProtectedRoute>
                    <Perfil />
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
