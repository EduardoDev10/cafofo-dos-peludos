import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // Instância do Axios
import VoluntaryCard from '../components/VoluntaryCard';
import { Plus, Shield, Users, Heart, BarChart2 } from 'lucide-react';

const AdminVoluntarios = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Campos do formulário
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('18');
  const [address, setAddress] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('Manhã');
  const [gender, setGender] = useState('Homem');
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/volunteers');
      setVolunteers(response.data);
    } catch (err) {
      console.error("Error loading volunteers: ", err);
      setError('Erro ao carregar voluntários do backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setAge('18');
    setAddress('');
    setTimeOfDay('Manhã');
    setGender('Homem');
    setEditingId(null);
    setIsFormOpen(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitLoading(true);

    // Validações
    if (!name.trim() || !phone.trim() || !email.trim() || !address.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setSubmitLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Formato de e-mail inválido.');
      setSubmitLoading(false);
      return;
    }

    try {
      const volData = {
        name,
        phone,
        email,
        age,
        address,
        timeOfDay,
        gender
      };

      if (editingId) {
        // Modo de edição (PUT)
        await api.put(`/volunteers/${editingId}`, volData);
      } else {
        // Modo de criação (POST)
        await api.post('/volunteers', volData);
      }

      resetForm();
      await fetchVolunteers();
    } catch (err) {
      console.error("Error saving volunteer: ", err);
      setError('Erro ao salvar voluntário na API.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditClick = (vol) => {
    setEditingId(vol.id);
    setName(vol.name);
    setPhone(vol.phone);
    setEmail(vol.email);
    setAge(vol.age);
    setAddress(vol.address);
    setTimeOfDay(vol.timeOfDay);
    setGender(vol.gender);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este voluntário?')) {
      try {
        await api.delete(`/volunteers/${id}`);
        await fetchVolunteers();
      } catch (err) {
        console.error("Error deleting volunteer: ", err);
        alert('Erro ao excluir voluntário na API.');
      }
    }
  };

  // Cálculos de paginação
  const itemsPerPage = 6;
  const totalPages = Math.ceil(volunteers.length / itemsPerPage);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVolunteers = volunteers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="admin-container">
      {/* Barra Lateral de Administração */}
      <div className="admin-sidebar">
        <h4 className="text-warning mb-4 px-3 font-weight-bold" style={{ fontFamily: 'var(--font-title)' }}>
          Cafofo Admin
        </h4>
        <Link to="/admin/pets" className="admin-sidebar-link">
          <Shield size={18} className="me-2" /> Pets
        </Link>
        <Link to="/admin/voluntarios" className="admin-sidebar-link active">
          <Users size={18} className="me-2" /> Voluntários
        </Link>
        <Link to="/admin/adocoes" className="admin-sidebar-link">
          <Heart size={18} className="me-2" /> Adoções
        </Link>
        <div className="dropdown-divider border-secondary my-3"></div>
        <Link to="/admin/relatorio" className="admin-sidebar-link text-warning">
          <BarChart2 size={18} className="me-2" /> Relatório Geral
        </Link>
      </div>

      {/* Área de Conteúdo do Admin */}
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0 font-weight-bold" style={{ fontFamily: 'var(--font-title)' }}>
            Gerenciamento de Voluntários
          </h2>
          {!isFormOpen && (
            <button className="btn btn-primary-cafofo d-flex align-items-center" onClick={() => setIsFormOpen(true)}>
              <Plus size={16} className="me-2" /> Cadastrar Voluntário
            </button>
          )}
        </div>

        {/* Exibe/Esconde Formulário */}
        {isFormOpen && (
          <div className="card shadow-sm border-0 p-4 mb-4" style={{ borderRadius: '12px' }}>
            <h4 className="text-warning mb-3 font-weight-bold" style={{ fontFamily: 'var(--font-title)' }}>
              {editingId ? 'Editar Detalhes do Voluntário' : 'Cadastrar Novo Voluntário'}
            </h4>
            
            {error && <div className="alert alert-danger py-2 px-3 rounded mb-3">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 form-group-custom">
                  <label className="font-weight-bold">Nome Completo *</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="Ex: Ana Maria"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={submitLoading}
                  />
                </div>
                <div className="col-md-6 form-group-custom">
                  <label className="font-weight-bold">Telefone *</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    disabled={submitLoading}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 form-group-custom">
                  <label className="font-weight-bold">E-mail *</label>
                  <input
                    type="email"
                    className="form-control-custom"
                    placeholder="nome@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={submitLoading}
                  />
                </div>
                <div className="col-md-3 form-group-custom">
                  <label className="font-weight-bold">Idade</label>
                  <select className="form-control-custom" value={age} onChange={(e) => setAge(e.target.value)} disabled={submitLoading}>
                    {[18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 'Mais de 30', 'Mais de 45', 'Mais de 60'].map(
                      (a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="col-md-3 form-group-custom">
                  <label className="font-weight-bold">Gênero</label>
                  <select className="form-control-custom" value={gender} onChange={(e) => setGender(e.target.value)} disabled={submitLoading}>
                    <option value="Homem">Homem</option>
                    <option value="Mulher">Mulher</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-8 form-group-custom">
                  <label className="font-weight-bold">Endereço *</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="Rua, número, bairro..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    disabled={submitLoading}
                  />
                </div>
                <div className="col-md-4 form-group-custom">
                  <label className="font-weight-bold">Período Disponível</label>
                  <select className="form-control-custom" value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)} disabled={submitLoading}>
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3" style={{ gap: '10px' }}>
                <button type="button" className="btn btn-secondary px-4" style={{ borderRadius: '20px' }} onClick={resetForm} disabled={submitLoading}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-warning text-white px-4" style={{ borderRadius: '20px', fontWeight: 'bold' }} disabled={submitLoading}>
                  {submitLoading ? (
                    <span className="spinner-border spinner-border-sm text-white me-2" role="status"></span>
                  ) : null}
                  {editingId ? 'Salvar Alterações' : 'Cadastrar Voluntário'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Grid de Exibição de Componentes */}
        <div className="row">
          {loading ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="sr-only">Carregando voluntários...</span>
              </div>
            </div>
          ) : currentVolunteers.length > 0 ? (
            currentVolunteers.map((vol) => (
              <div className="col-md-6 col-lg-4 mb-4" key={vol.id}>
                <VoluntaryCard
                  volunteer={vol}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5 text-muted">
              Nenhum voluntário cadastrado.
            </div>
          )}
        </div>

        {/* Navegação da Paginação */}
        {totalPages > 1 && (
          <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <li className={`page-item ${activePage === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setCurrentPage(activePage - 1)}
                  style={{ border: 'none', color: 'var(--text-dark)' }}
                >
                  &laquo; Anterior
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page} className={`page-item ${activePage === page ? 'active' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(page)}
                    style={{ 
                      border: 'none',
                      backgroundColor: activePage === page ? 'var(--primary-color)' : '#ffffff', 
                      color: activePage === page ? '#ffffff' : 'var(--text-dark)',
                      fontWeight: '600'
                    }}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li className={`page-item ${activePage === totalPages ? 'disabled' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => setCurrentPage(activePage + 1)}
                  style={{ border: 'none', color: 'var(--text-dark)' }}
                >
                  Próximo &raquo;
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default AdminVoluntarios;
