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
  const { login } = useAuth();
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
            <AlertCircle size={18} className="mr-2" />
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success d-flex align-items-center py-2 px-3 mb-3 rounded" role="alert">
            <CheckCircle2 size={18} className="mr-2" />
            <span style={{ fontSize: '0.9rem' }}>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="font-weight-bold text-secondary" style={{ fontSize: '0.9rem' }}>E-mail corporativo</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text bg-light border-right-0" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                  <Mail size={16} className="text-muted" />
                </span>
              </div>
              <input
                type="email"
                className="form-control border-left-0"
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
              <div className="input-group-prepend">
                <span className="input-group-text bg-light border-right-0" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                  <Lock size={16} className="text-muted" />
                </span>
              </div>
              <input
                type="password"
                className="form-control border-left-0"
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
              <span className="spinner-border spinner-border-sm text-white mr-2" role="status" aria-hidden="true"></span>
            )}
            {loading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>

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
