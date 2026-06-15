import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // Instância do Axios
import { Shield, Users, Heart, BarChart2, Search, Calendar, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

const AdminRelatorio = () => {
  const [adoptions, setAdoptions] = useState([]);
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const [adoptionsRes, petsRes] = await Promise.all([
          api.get('/adoptions'),
          api.get('/pets')
        ]);
        
        setAdoptions(adoptionsRes.data);
        setPets(petsRes.data);
      } catch (error) {
        console.error("Error loading report data from API: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  // Operação de JOIN relacional entre Adoções e Pets (usando map e find)
  const joinedData = adoptions.map((adoption) => {
    // Procura os detalhes do Pet correspondente usando petId como chave estrangeira
    const pet = pets.find((p) => p.id === adoption.petId);
    return {
      ...adoption,
      petName: pet ? pet.name : 'Pet Removido',
      petType: pet ? pet.type : 'N/A',
      petAge: pet ? pet.age : 'N/A',
      petPhoto: pet ? pet.photo : null
    };
  });

  // Calcula os KPIs do painel
  const totalRequests = joinedData.length;
  const approvedRequests = joinedData.filter(a => a.status === 'Aprovado').length;
  const pendingRequests = joinedData.filter(a => a.status === 'Pendente').length;
  const rejectedRequests = joinedData.filter(a => a.status === 'Rejeitado').length;

  // Filtra os dados com base na pesquisa e status para exibição
  const filteredData = joinedData.filter((item) => {
    const matchesSearch = 
      item.adopterName.toLowerCase().includes(search.toLowerCase()) ||
      item.adopterLastName.toLowerCase().includes(search.toLowerCase()) ||
      item.petName.toLowerCase().includes(search.toLowerCase()) ||
      item.reason.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === 'Todos' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
        <Link to="/admin/adocoes" className="admin-sidebar-link">
          <Heart size={18} className="me-2" /> Adoções
        </Link>
        <div className="dropdown-divider border-secondary my-3"></div>
        <Link to="/admin/relatorio" className="admin-sidebar-link active text-warning">
          <BarChart2 size={18} className="me-2" /> Relatório Geral
        </Link>
      </div>

      {/* Área de Conteúdo do Admin */}
      <div className="admin-content">
        <div className="mb-4">
          <h2 className="mb-1 font-weight-bold" style={{ fontFamily: 'var(--font-title)' }}>
            Relatório de Cruzamento de Dados (JOIN)
          </h2>
          <p className="text-muted">
            Este relatório simula uma operação de <code className="bg-light p-1 rounded font-weight-bold">JOIN SQL</code> em memória,
            cruzando a entidade de <strong>Adoções</strong> com a entidade de <strong>Pets</strong> via chave estrangeira.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="sr-only">Carregando relatório...</span>
            </div>
          </div>
        ) : (
          <>
            {/* KPIs do Painel de Controle */}
            <div className="row mb-5">
              <div className="col-md-3 mb-3">
                <div className="card shadow-sm border-0 p-3 bg-white" style={{ borderRadius: '12px', borderLeft: '4px solid #17a2b8' }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="small text-muted font-weight-bold">Total de Pedidos</span>
                      <h3 className="mb-0 font-weight-bold mt-1">{totalRequests}</h3>
                    </div>
                    <FileText className="text-info" size={28} />
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card shadow-sm border-0 p-3 bg-white" style={{ borderRadius: '12px', borderLeft: '4px solid #28a745' }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="small text-muted font-weight-bold">Aprovados</span>
                      <h3 className="mb-0 text-success font-weight-bold mt-1">{approvedRequests}</h3>
                    </div>
                    <CheckCircle className="text-success" size={28} />
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card shadow-sm border-0 p-3 bg-white" style={{ borderRadius: '12px', borderLeft: '4px solid #ffc107' }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="small text-muted font-weight-bold">Pendentes</span>
                      <h3 className="mb-0 text-warning font-weight-bold mt-1">{pendingRequests}</h3>
                    </div>
                    <Clock className="text-warning" size={28} />
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card shadow-sm border-0 p-3 bg-white" style={{ borderRadius: '12px', borderLeft: '4px solid #dc3545' }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="small text-muted font-weight-bold">Rejeitados</span>
                      <h3 className="mb-0 text-danger font-weight-bold mt-1">{rejectedRequests}</h3>
                    </div>
                    <XCircle className="text-danger" size={28} />
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros do Relatório */}
            <div className="card shadow-sm border-0 p-4 mb-4" style={{ borderRadius: '12px' }}>
              <div className="row align-items-center">
                <div className="col-md-6 form-group mb-md-0">
                  <label className="font-weight-bold text-secondary">Pesquisa textual (Adotante, Pet, Motivação)</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-light border-right-0" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                        <Search size={16} className="text-muted" />
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control border-left-0"
                      style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                      placeholder="Pesquisar..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6 form-group mb-0">
                  <label className="font-weight-bold text-secondary">Filtrar por Status</label>
                  <div className="btn-group w-100 bg-light p-1 rounded" style={{ gap: '5px' }}>
                    {['Todos', 'Pendente', 'Aprovado', 'Rejeitado'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={`btn btn-sm flex-grow-1 ${statusFilter === status ? 'btn-warning text-white font-weight-bold' : 'btn-link text-secondary'}`}
                        style={{ borderRadius: '8px', textDecoration: 'none' }}
                        onClick={() => setStatusFilter(status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabela Detalhada de Cruzamento (JOIN) */}
            <div className="table-responsive">
              <table className="table table-custom table-hover">
                <thead>
                  <tr>
                    <th>Adotante</th>
                    <th>Contato</th>
                    <th>Pet Adotado (JOIN)</th>
                    <th>Motivação da Adoção</th>
                    <th>Data</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.id}>
                        <td className="font-weight-bold">
                          {item.adopterName} {item.adopterLastName}
                          <span className="small text-muted d-block">{item.city} - {item.state}</span>
                        </td>
                        <td>
                          <span className="small font-weight-medium d-block text-secondary">{item.email}</span>
                          <span className="small font-weight-medium d-block text-secondary">{item.phone}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            {item.petPhoto && (
                              <img
                                src={item.petPhoto}
                                alt={item.petName}
                                className="rounded-circle me-2 border border-warning"
                                style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                                onError={(e) => {
                                  e.target.src = '/img/logo1.png';
                                }}
                              />
                            )}
                            <div>
                              <span className="font-weight-bold text-info">{item.petName}</span>
                              <span className="small text-muted d-block">{item.petType} ({item.petAge})</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ maxWidth: '300px' }}>
                          <p className="small mb-0 text-secondary text-truncate" title={item.reason} style={{ cursor: 'pointer' }}>
                            {item.reason}
                          </p>
                        </td>
                        <td>
                          <span className="small text-muted d-flex align-items-center">
                            <Calendar size={12} className="me-1" /> {item.date}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge py-1 px-2 ${
                              item.status === 'Aprovado'
                                ? 'badge-status-disponivel'
                                : item.status === 'Rejeitado'
                                ? 'badge-status-analise'
                                : 'badge-pet-cachorro'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        Nenhum registro encontrado correspondente aos filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminRelatorio;
