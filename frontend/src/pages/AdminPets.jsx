import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // Instância do Axios
import { Plus, Edit2, Trash2, Shield, Users, Heart, BarChart2 } from 'lucide-react';

const AdminPets = () => {
  const [pets, setPets] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Campos do formulário
  const [name, setName] = useState('');
  const [type, setType] = useState('Cachorro');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [city, setCity] = useState('Brasília DF');
  const [status, setStatus] = useState('Disponível');
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [currentPage, setCurrentPage] = useState(1);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Exibe erro se o arquivo não for uma imagem
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Redimensiona a imagem para no máximo 600px
        const maxDim = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Converte para base64 JPEG comprimido (70% de qualidade)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setPhoto(dataUrl);
        setError('');
      };
      img.onerror = () => {
        setError('Erro ao ler a imagem. Arquivo corrompido ou formato inválido.');
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setError('Erro ao carregar o arquivo.');
    };
    reader.readAsDataURL(file);
  };

  const fetchPets = async () => {
    setLoading(true);
    try {
      const response = await api.get('/pets');
      setPets(response.data);
    } catch (err) {
      console.error("Error fetching pets: ", err);
      setError('Erro ao carregar pets do backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const resetForm = () => {
    setName('');
    setType('Cachorro');
    setAge('');
    setDescription('');
    setPhoto('');
    setCity('Brasília DF');
    setStatus('Disponível');
    setEditingId(null);
    setIsFormOpen(false);
    setError('');
    setFileInputKey(Date.now());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitLoading(true);

    // Validações
    if (!name.trim() || !age.trim() || !description.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setSubmitLoading(false);
      return;
    }

    try {
      const petData = {
        name,
        type,
        age,
        description,
        photo: photo || '/img/logo1.png',
        city,
        status
      };

      if (editingId) {
        // Modo de edição (PUT)
        await api.put(`/pets/${editingId}`, petData);
      } else {
        // Modo de criação (POST)
        await api.post('/pets', { ...petData, status: 'Disponível' });
      }

      resetForm();
      await fetchPets();
    } catch (err) {
      console.error("Error saving pet: ", err);
      setError('Erro ao salvar o pet na API.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditClick = (pet) => {
    setEditingId(pet.id);
    setName(pet.name);
    setType(pet.type);
    setAge(pet.age);
    setDescription(pet.description);
    setPhoto(pet.photo);
    setCity(pet.city || 'Brasília DF');
    setStatus(pet.status || 'Disponível');
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pet?')) {
      try {
        await api.delete(`/pets/${id}`);
        await fetchPets();
      } catch (err) {
        console.error("Error deleting pet: ", err);
        alert('Erro ao deletar o pet na API.');
      }
    }
  };

  // Cálculos de paginação
  const itemsPerPage = 5;
  const totalPages = Math.ceil(pets.length / itemsPerPage);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPets = pets.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="admin-container">
      {/* Barra Lateral de Administração */}
      <div className="admin-sidebar">
        <h4 className="text-warning mb-4 px-3 font-weight-bold" style={{ fontFamily: 'var(--font-title)' }}>
          Cafofo Admin
        </h4>
        <Link to="/admin/pets" className="admin-sidebar-link active">
          <Shield size={18} className="me-2" /> Pets
        </Link>
        <Link to="/admin/voluntarios" className="admin-sidebar-link">
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
            Gerenciamento de Pets
          </h2>
          {!isFormOpen && (
            <button className="btn btn-primary-cafofo d-flex align-items-center" onClick={() => setIsFormOpen(true)}>
              <Plus size={16} className="me-2" /> Cadastrar Pet
            </button>
          )}
        </div>

        {/* Exibe/Esconde Formulário */}
        {isFormOpen && (
          <div className="card shadow-sm border-0 p-4 mb-4" style={{ borderRadius: '12px' }}>
            <h4 className="text-warning mb-3 font-weight-bold" style={{ fontFamily: 'var(--font-title)' }}>
              {editingId ? 'Editar Detalhes do Pet' : 'Cadastrar Novo Pet para Adoção'}
            </h4>
            
            {error && <div className="alert alert-danger py-2 px-3 rounded mb-3">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4 form-group-custom">
                  <label className="font-weight-bold">Nome do Pet *</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="Ex: Rex"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={submitLoading}
                  />
                </div>
                <div className="col-md-4 form-group-custom">
                  <label className="font-weight-bold">Tipo de Animal</label>
                  <select className="form-control-custom" value={type} onChange={(e) => setType(e.target.value)} disabled={submitLoading}>
                    <option value="Cachorro">Cachorro</option>
                    <option value="Gato">Gato</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div className="col-md-4 form-group-custom">
                  <label className="font-weight-bold">Idade do Pet *</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="Ex: 6 meses ou 2 anos"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    disabled={submitLoading}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-3 form-group-custom">
                  <label className="font-weight-bold">Cidade</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="Ex: Brasília DF"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={submitLoading}
                  />
                </div>
                <div className="col-md-3 form-group-custom">
                  <label className="font-weight-bold">Foto (Enviar Arquivo)</label>
                  <input
                    key={fileInputKey}
                    type="file"
                    accept="image/*"
                    className="form-control-custom"
                    onChange={handleFileChange}
                    disabled={submitLoading}
                    style={{ padding: '5px', fontSize: '0.85rem' }}
                  />
                </div>
                <div className="col-md-3 form-group-custom">
                  <label className="font-weight-bold">Foto (Ou URL)</label>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control-custom"
                      placeholder="Ex: /img/rex.png ou link web"
                      value={photo.startsWith('data:') ? 'Imagem do computador' : photo}
                      onChange={(e) => setPhoto(e.target.value)}
                      disabled={submitLoading}
                      readOnly={photo.startsWith('data:')}
                    />
                    {photo.startsWith('data:') && (
                      <button 
                        type="button" 
                        className="btn btn-link btn-sm p-0 text-danger" 
                        onClick={() => {
                          setPhoto('');
                          setFileInputKey(Date.now());
                        }}
                        style={{ fontSize: '0.8rem', position: 'absolute', right: '10px', top: '7px', textDecoration: 'none' }}
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-md-3 form-group-custom">
                  {editingId ? (
                    <div>
                      <label className="font-weight-bold">Status</label>
                      <div className="d-flex align-items-center">
                        <select className="form-control-custom me-2" value={status} onChange={(e) => setStatus(e.target.value)} disabled={submitLoading}>
                          <option value="Disponível">Disponível</option>
                          <option value="Adotado">Adotado</option>
                          <option value="Em Análise">Em Análise</option>
                        </select>
                        <div className="flex-shrink-0">
                          {photo ? (
                            <img 
                              src={photo} 
                              alt="Prévia" 
                              className="rounded border border-warning" 
                              style={{ width: '40px', height: '40px', objectFit: 'cover', display: 'block', flexShrink: 0 }}
                              onError={(e) => {
                                e.target.src = '/img/logo1.png';
                              }}
                            />
                          ) : (
                            <span className="small text-muted">Sem foto</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 pt-3">
                      <span className="small text-muted mr-2">Prévia:</span>
                      {photo ? (
                        <img 
                          src={photo} 
                          alt="Prévia" 
                          className="rounded border border-warning" 
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = '/img/logo1.png';
                          }}
                        />
                      ) : (
                        <span className="small text-muted">Sem foto</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group-custom">
                <label className="font-weight-bold">Descrição do Pet *</label>
                <textarea
                  className="form-control-custom"
                  placeholder="Características, temperamento, história..."
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  {editingId ? 'Salvar Alterações' : 'Cadastrar Pet'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Listagem Dinâmica */}
        <div className="table-responsive">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="sr-only">Carregando pets...</span>
              </div>
            </div>
          ) : (
            <table className="table table-custom table-hover">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Idade</th>
                  <th>Cidade</th>
                  <th>Status</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentPets.length > 0 ? (
                  currentPets.map((pet) => (
                    <tr key={pet.id}>
                      <td>
                        <img
                          src={pet.photo}
                          alt={pet.name}
                          className="rounded-circle"
                          style={{ width: '45px', height: '45px', objectFit: 'cover', border: '2px solid #eba768' }}
                          onError={(e) => {
                            e.target.src = '/img/logo1.png';
                          }}
                        />
                      </td>
                      <td className="font-weight-bold">{pet.name}</td>
                      <td>
                        <span className={`badge ${pet.type === 'Cachorro' ? 'badge-pet-cachorro' : pet.type === 'Gato' ? 'badge-pet-gato' : 'badge-pet-outro'}`}>
                          {pet.type}
                        </span>
                      </td>
                      <td>{pet.age}</td>
                      <td>{pet.city || 'Brasília DF'}</td>
                      <td>
                        <span className={`badge ${pet.status === 'Adotado' ? 'badge-status-adotado' : pet.status === 'Em Análise' ? 'badge-status-analise' : 'badge-status-disponivel'}`}>
                          {pet.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center align-items-center" style={{ gap: '8px' }}>
                          <button className="btn btn-sm btn-outline-info" onClick={() => handleEditClick(pet)}>
                            <Edit2 size={14} />
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(pet.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      Nenhum pet cadastrado.
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

export default AdminPets;
