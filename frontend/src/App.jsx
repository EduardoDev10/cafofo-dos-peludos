import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Componentes Comuns
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import FAQ from './pages/FAQ';
import QueroAdotar from './pages/QueroAdotar';
import SejaVoluntario from './pages/SejaVoluntario';
import AdocaoForm from './pages/AdocaoForm';
import AdminPets from './pages/AdminPets';
import AdminVoluntarios from './pages/AdminVoluntarios';
import AdminAdocoes from './pages/AdminAdocoes';
import AdminRelatorio from './pages/AdminRelatorio';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100 bg-light">
          <Navbar />
          <div className="flex-grow-1">
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/quero-adotar" element={<QueroAdotar />} />
              <Route path="/quero-adotar/declaracao" element={<AdocaoForm />} />
              <Route path="/seja-voluntario" element={<SejaVoluntario />} />

              {/* Rotas Protegidas do Painel Admin */}
              <Route
                path="/admin/pets"
                element={
                  <ProtectedRoute>
                    <AdminPets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/voluntarios"
                element={
                  <ProtectedRoute>
                    <AdminVoluntarios />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/adocoes"
                element={
                  <ProtectedRoute>
                    <AdminAdocoes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/relatorio"
                element={
                  <ProtectedRoute>
                    <AdminRelatorio />
                  </ProtectedRoute>
                }
              />

              {/* Rota de fallback (Redirecionamento) */}
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
