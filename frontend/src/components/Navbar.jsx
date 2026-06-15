import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, Settings, Heart, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Estados puramente em React para controle de colapso do menu móvel e dropdowns
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isInstOpen, setIsInstOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleLogout = () => {
    logout();
    closeAll();
    navigate('/');
  };

  const closeAll = () => {
    setIsNavOpen(false);
    setIsInstOpen(false);
    setIsFaqOpen(false);
    setIsAdminOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <Link className="navbar-brand" to="/" onClick={closeAll}>
        <img src="/img/logo1.png" alt="Cafofo dos Peludos" className="logo" />
      </Link>
      <button 
        className="navbar-toggler" 
        type="button" 
        aria-controls="conteudoNavbarSuportado" 
        aria-expanded={isNavOpen} 
        aria-label="Toggle navigation"
        onClick={() => setIsNavOpen(!isNavOpen)}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="conteudoNavbarSuportado">
        <ul className="navbar-nav me-auto align-items-center">
          {/* Itens de Navegação Públicos */}
          <li className="nav-item">
            <Link className="nav-link" to="/" onClick={closeAll}>Início</Link>
          </li>
          
          {/* Dropdown Institucional */}
          <li 
            className={`nav-item dropdown ${isInstOpen ? 'show' : ''}`}
            onMouseEnter={() => setIsInstOpen(true)}
            onMouseLeave={() => setIsInstOpen(false)}
          >
            <a 
              className="nav-link dropdown-toggle" 
              href="#" 
              role="button"
              onClick={(e) => {
                e.preventDefault();
                setIsInstOpen(!isInstOpen);
              }}
            >
              Institucional
            </a>
            <div className={`dropdown-menu ${isInstOpen ? 'show' : ''}`}>
              {user && (
                <Link className="dropdown-item" to="/admin/pets" onClick={closeAll}>Adicionar pet</Link>
              )}
              <a 
                className="dropdown-item" 
                href="https://observatorio3setor.org.br/lista-conheca-7-ongs-brasileiras-que-atuam-na-protecao-de-animais/" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={closeAll}
              >
                Projetos Sociais
              </a>
            </div>
          </li>

          <li className="nav-item">
            <a 
              className="nav-link" 
              href="https://love.doghero.com.br/dicas/ong-de-animais/" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={closeAll}
            >
              ONGs Parceiras
            </a>
          </li>

          {/* Dropdown FAQ */}
          <li 
            className={`nav-item dropdown ${isFaqOpen ? 'show' : ''}`}
            onMouseEnter={() => setIsFaqOpen(true)}
            onMouseLeave={() => setIsFaqOpen(false)}
          >
            <a 
              className="nav-link dropdown-toggle" 
              href="#" 
              role="button"
              onClick={(e) => {
                e.preventDefault();
                setIsFaqOpen(!isFaqOpen);
              }}
            >
              FAQ
            </a>
            <div className={`dropdown-menu ${isFaqOpen ? 'show' : ''}`}>
              <Link className="dropdown-item" to="/faq" onClick={closeAll}>Como ajudar</Link>
            </div>
          </li>

          {/* Navegação Administrativa (Visível apenas quando autenticado) */}
          {user && (
            <li 
              className={`nav-item dropdown bg-light border rounded px-2 ms-lg-3 ${isAdminOpen ? 'show' : ''}`}
              onMouseEnter={() => setIsAdminOpen(true)}
              onMouseLeave={() => setIsAdminOpen(false)}
            >
              <a 
                className="nav-link dropdown-toggle text-warning font-weight-bold" 
                href="#" 
                role="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsAdminOpen(!isAdminOpen);
                }}
              >
                <Settings size={18} className="me-1" style={{ marginRight: '4px' }} /> Admin
              </a>
              <div className={`dropdown-menu ${isAdminOpen ? 'show' : ''}`}>
                <Link className="dropdown-item" to="/admin/pets" onClick={closeAll}>Gerenciar Pets</Link>
                <Link className="dropdown-item" to="/admin/voluntarios" onClick={closeAll}>Gerenciar Voluntários</Link>
                <Link className="dropdown-item" to="/admin/adocoes" onClick={closeAll}>Gerenciar Adoções</Link>
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item font-weight-bold" to="/admin/relatorio" onClick={closeAll}>Relatório Geral</Link>
              </div>
            </li>
          )}
        </ul>

        {/* Botões do lado direito */}
        <div className="d-flex align-items-center flex-wrap my-2 my-lg-0" style={{ gap: '12px' }}>
          <Link to="/quero-adotar" className="btn btn-outline-info" onClick={closeAll} style={{ borderRadius: '20px' }}>
            <Heart size={16} className="me-1" style={{ marginRight: '4px' }} /> Quero adotar
          </Link>
          <Link to="/seja-voluntario" className="btn btn-outline-warning" onClick={closeAll} style={{ borderRadius: '20px' }}>
            <User size={16} className="me-1" style={{ marginRight: '4px' }} /> Seja voluntário
          </Link>

          {user ? (
            <button onClick={handleLogout} className="btn btn-danger font-weight-bold" style={{ borderRadius: '20px' }}>
              <LogOut size={16} className="me-1" style={{ marginRight: '4px' }} /> Sair
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary-cafofo" onClick={closeAll} style={{ borderRadius: '20px' }}>
              <LogIn size={16} className="me-1" style={{ marginRight: '4px' }} /> Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
