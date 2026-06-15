import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // Instância do Axios
import { Plus, Edit2, Trash2, Shield, Users, Heart, BarChart2, Check, X } from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return '---';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

const AdminAdocoes = () => {
  const [adoptions, setAdoptions] = useState([]);
  const [pets, setPets] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Campos do formulário
  const [petId, setPetId] = useState('');
  const [adopterName, setAdopterName] = useState('');
  const [adopterLastName, setAdopterLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('DF');
  const [cep, setCep] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('Pendente');
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAdoptionsAndPets = async () => {
    setLoading(true);
    try {
      // 1. Busca Pets e Adoções em paralelo via API
      const [petsRes, adoptionsRes] = await Promise.all([
        api.get('/pets'),
        api.get('/adoptions')
      ]);

      setPets(petsRes.data);
      setAdoptions(adoptionsRes.data);
    } catch (err) {
      console.error("Error loading adoptions or pets from API: ", err);
      setError('Erro ao carregar registros da API do backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoptionsAndPets();
  }, []);

  const resetForm = () => {
    setPetId('');
    setAdopterName('');
    setAdopterLastName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setAddress2('');
    setCity('');
    setState('DF');
    setCep('');
    setReason('');
    setStatus('Pendente');
    setEditingId(null);
    setIsFormOpen(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitLoading(true);

    // Validações
    if (!petId || !adopterName.trim() || !adopterLastName.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim() || !cep.trim() || !reason.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setSubmitLoading(false);
      return;
    }

    try {
      const adoptionData = {
        petId,
        adopterName,
        adopterLastName,
        email,
        phone,
        address,
        address2,
        city,
        state,
        cep,
        reason,
        status
      };

      if (editingId) {
        // Modo de edição (PUT)
        await api.put(`/adoptions/${editingId}`, adoptionData);
      } else {
        // Modo de criação (POST)
        await api.post('/adoptions', adoptionData);

        // Se a nova solicitação foi criada já como Aprovada pelo Admin, atualiza o status do pet
        if (status === 'Aprovado') {
          await api.put(`/pets/${petId}`, { status: 'Adotado' });
        }
      }

      resetForm();
      await fetchAdoptionsAndPets();
    } catch (err) {
      console.error("Error saving adoption: ", err);
      setError('Erro ao salvar solicitação na API.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditClick = (adoption) => {
    setEditingId(adoption.id);
    setPetId(adoption.petId);
    setAdopterName(adoption.adopterName);
    setAdopterLastName(adoption.adopterLastName);
    setEmail(adoption.email);
    setPhone(adoption.phone);
    setAddress(adoption.address);
    setAddress2(adoption.address2 || '');
    setCity(adoption.city);
    setState(adoption.state);
    setCep(adoption.cep);
    setReason(adoption.reason);
    setStatus(adoption.status);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta solicitação?')) {
      try {
        await api.delete(`/adoptions/${id}`);
        await fetchAdoptionsAndPets();
      } catch (err) {
        console.error("Error deleting adoption: ", err);
        alert('Erro ao excluir solicitação na API.');
      }
    }
  };

  const handleStatusChange = async (id, newStatus, currentPetId) => {
    try {
      await api.put(`/adoptions/${id}`, { status: newStatus, petId: currentPetId });
      await fetchAdoptionsAndPets();
    } catch (err) {
      console.error("Error updating status: ", err);
      alert('Erro ao atualizar o status na API.');
    }
  };

  // Cálculos de paginação
  const itemsPerPage = 5;
  const totalPages = Math.ceil(adoptions.length / itemsPerPage);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdoptions = adoptions.slice(indexOfFirstItem, indexOfLastItem);

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
        <Link to="/admin/voluntarios" className="admin-sidebar-link">
          <Users size={18} className="me-2" /> Voluntários
        </Link>
        <Link to="/admin/adocoes" className="admin-sidebar-link active">
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
            Solicitações de Adoção
          </h2>
          {!isFormOpen && (
            <button className="btn btn-primary-cafofo d-flex align-items-center" onClick={() => setIsFormOpen(true)}>
              <Plus size={16} className="me-2" /> Nova Solicitação
            </button>
          )}
        </div>

        {/* Exibe/Esconde Formulário */}
        {isFormOpen && (
          <div className="card shadow-sm border-0 p-4 mb-4" style={{ borderRadius: '12px' }}>
            <h4 className="text-warning mb-3 font-weight-bold" style={{ fontFamily: 'var(--font-title)' }}>
              {editingId ? 'Editar Solicitação de Adoção' : 'Criar Nova Solicitação de Adoção'}
            </h4>
            
            {error && <div className="alert alert-danger py-2 px-3 rounded mb-3">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4 form-group-custom">
                  <label className="font-weight-bold">Pet Interessado *</label>
                  <select className="form-control-custom" value={petId} onChange={(e) => setPetId(e.target.value)} disabled={submitLoading}>
                    <option value="">-- Selecione um pet --</option>
                    {pets.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.type} - {p.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4 form-group-custom">
                  <label className="font-weight-bold">Nome do Adotante *</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="Nome"
                    value={adopterName}
                    onChange={(e) => setAdopterName(e.target.value)}
                    required
                    disabled={submitLoading}
                  />
                </div>
                <div className="col-md-4 form-group-custom">
                  <label className="font-weight-bold">Sobrenome *</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="Sobrenome"
                    value={adopterLastName}
                    onChange={(e) => setAdopterLastName(e.target.value)}
                    required
                    disabled={submitLoading}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 form-group-custom">
                  <label className="font-weight-bold">E-mail *</label>
                  <input
                    type="email"
                    className="form-control-custom"
                    placeholder="exemplo@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={submitLoading}
                  />
                </div>
                <div className="col-md-4 form-group-custom">
                  <label className="font-weight-bold">Telefone/WhatsApp *</label>
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
                <div className="col-md-4 form-group-custom">
                  <label className="font-weight-bold">Status da Solicitação</label>
                  <select className="form-control-custom" value={status} onChange={(e) => setStatus(e.target.value)} disabled={submitLoading}>
                    <option value="Pendente">Pendente</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Rejeitado">Rejeitado</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 form-group-custom">
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
                <div className="col-md-6 form-group-custom">
                  <label className="font-weight-bold">Complemento</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="Apto, bloco (opcional)"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    disabled={submitLoading}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 form-group-custom">
                  <label className="font-weight-bold">Cidade *</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    disabled={submitLoading}
                  />
                </div>
                <div className="col-md-3 form-group-custom">
                  <label className="font-weight-bold">Estado *</label>
                  <select className="form-control-custom" value={state} onChange={(e) => setState(e.target.value)} disabled={submitLoading}>
                    <option value="DF">DF</option>
                    <option value="GO">GO</option>
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
                    <option value="MG">MG</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div className="col-md-3 form-group-custom">
                  <label className="font-weight-bold">CEP *</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="00000-000"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    required
                    disabled={submitLoading}
                  />
                </div>
              </div>

              <div className="form-group-custom">
                <label className="font-weight-bold">Motivação da Adoção *</label>
                <textarea
                  className="form-control-custom"
                  placeholder="Por que deseja adotar este animal..."
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  disabled={submitLoading}
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3" style={{ gap: '10px' }}>
                <button type="button" className="btn btn-secondary px-4" style={{ borderRadius: '20px' }} onClick={resetForm} disabled={submitLoading}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-warning text-white px-4" style={{ borderRadius: '20px', fontWeight: 'bold' }} disabled={submitLoading}>
                  {submitLoading ? (
                    <span className="spinner-border spinner-border-sm text-white me-2" role="status"></span>
                  ) : null}
                  {editingId ? 'Salvar Alterações' : 'Criar Solicitação'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Layout de Visualização */}
        <div className="table-responsive">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="sr-only">Carregando solicitações...</span>
              </div>
            </div>
          ) : (
            <table className="table table-custom table-hover">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Adotante</th>
                  <th>Pet</th>
                  <th>Cidade/UF</th>
                  <th>Status</th>
                  <th className="text-center">Ações Rápidas</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentAdoptions.length > 0 ? (
                  currentAdoptions.map((adoption) => {
                    const pet = pets.find((p) => p.id === adoption.petId);
                    return (
                      <tr key={adoption.id}>
                        <td>{formatDate(adoption.date)}</td>
                        <td className="font-weight-bold">
                          {adoption.adopterName} {adoption.adopterLastName}
                          <br />
                          <span className="small text-muted" style={{ fontWeight: 'normal' }}>
                            {adoption.email} | {adoption.phone}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            {pet && pet.photo ? (
                              <img
                                src={pet.photo}
                                alt={pet.name}
                                className="rounded-circle me-2 border border-warning"
                                style={{ width: '36px', height: '36px', objectFit: 'cover', flexShrink: 0 }}
                                onError={(e) => {
                                  e.target.src = '/img/logo1.png';
                                }}
                              />
                            ) : (
                              <img
                                src="/img/logo1.png"
                                alt="Pet"
                                className="rounded-circle me-2 border border-warning"
                                style={{ width: '36px', height: '36px', objectFit: 'cover', flexShrink: 0 }}
                              />
                            )}
                            <div>
                              <span className="font-weight-bold text-info d-block">
                                {pet ? pet.name : `Pet excluído (ID: ${adoption.petId})`}
                              </span>
                              {pet && <span className="small text-muted d-block">{pet.type}</span>}
                            </div>
                          </div>
                        </td>
                        <td>
                          {adoption.city}/{adoption.state}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              adoption.status === 'Aprovado'
                                ? 'badge-status-disponivel'
                                : adoption.status === 'Rejeitado'
                                ? 'badge-status-analise'
                                : 'badge-pet-cachorro'
                            }`}
                          >
                            {adoption.status}
                          </span>
                        </td>
                        <td className="text-center">
                          {adoption.status === 'Pendente' && (
                            <div className="d-flex justify-content-center" style={{ gap: '5px' }}>
                              <button
                                className="btn btn-sm btn-success p-1 px-2 rounded-circle"
                                title="Aprovar"
                                onClick={() => handleStatusChange(adoption.id, 'Aprovado', adoption.petId)}
                              >
                                <Check size={14} />
                              </button>
                              <button
                                className="btn btn-sm btn-danger p-1 px-2 rounded-circle"
                                title="Rejeitar"
                                onClick={() => handleStatusChange(adoption.id, 'Rejeitado', adoption.petId)}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          )}
                          {adoption.status !== 'Pendente' && (
                            <span className="small text-muted" style={{ fontStyle: 'italic' }}>Definido</span>
                          )}
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center align-items-center" style={{ gap: '8px' }}>
                            <button className="btn btn-sm btn-outline-info" onClick={() => handleEditClick(adoption)}>
                              <Edit2 size={14} />
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(adoption.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      Nenhuma solicitação de adoção registrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

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
    </div>
  );
};

export default AdminAdocoes;
