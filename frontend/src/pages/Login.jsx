import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validações
    if (!email.trim() || !password) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setLoading(false);
      return;
    }

    try {
      const res = await login(email, password);
      if (res.success) {
        setSuccess('Login efetuado com sucesso! Redirecionando...');
        setTimeout(() => {
          navigate('/admin/pets');
        }, 1500);
      } else {
        setError(res.message);
      }
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao efetuar o login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await loginWithGoogle();
      if (res.success) {
        setSuccess('Login com Google efetuado com sucesso! Redirecionando...');
        setTimeout(() => {
          navigate('/admin/pets');
        }, 1500);
      } else {
        setError(res.message);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao efetuar o login com o Google. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
      <div className="card shadow-lg p-4 my-5 border-0" style={{ maxWidth: '450px', width: '100%', borderRadius: '16px' }}>
        <div className="text-center mb-4">
          <img src="/img/logo1.png" alt="Logo" className="mb-3" style={{ height: '60px' }} />
          <h2 className="text-warning font-weight-bold" style={{ fontFamily: 'var(--font-title)' }}>
            Área Administrativa
          </h2>
          <p className="text-muted">Faça login para gerenciar o Cafofo dos Peludos</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center py-2 px-3 mb-3 rounded" role="alert">
            <AlertCircle size={18} className="me-3 flex-shrink-0" />
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success d-flex align-items-center py-2 px-3 mb-3 rounded" role="alert">
            <CheckCircle2 size={18} className="me-3 flex-shrink-0" />
            <span style={{ fontSize: '0.9rem' }}>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="font-weight-bold text-secondary" style={{ fontSize: '0.9rem' }}>E-mail corporativo</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                <Mail size={16} className="text-muted" />
              </span>
              <input
                type="email"
                className="form-control border-start-0"
                style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                placeholder="exemplo@cafofo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="font-weight-bold text-secondary" style={{ fontSize: '0.9rem' }}>Senha</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                <Lock size={16} className="text-muted" />
              </span>
              <input
                type="password"
                className="form-control border-start-0"
                style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary-cafofo btn-block py-2 d-flex align-items-center justify-content-center" 
            style={{ borderRadius: '8px', fontSize: '1.1rem' }}
            disabled={loading}
          >
            {loading && (
              <span className="spinner-border spinner-border-sm text-white me-2" role="status" aria-hidden="true"></span>
            )}
            {loading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>

        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1 border-secondary-subtle" />
          <span className="mx-2 text-muted small" style={{ fontSize: '0.85rem' }}>ou</span>
          <hr className="flex-grow-1 border-secondary-subtle" />
        </div>

        <button 
          type="button" 
          onClick={handleGoogleLogin}
          className="btn btn-outline-secondary btn-block py-2 d-flex align-items-center justify-content-center w-100 mb-3" 
          style={{ borderRadius: '8px', fontSize: '1.05rem', fontWeight: '500', gap: '8px' }}
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Entrar com o Google
        </button>

        <div className="text-center mt-4">
          <small className="text-muted">
            Credenciais de teste:<br />
            <strong>admin@cafofo.com</strong> / <strong>admin123</strong>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
