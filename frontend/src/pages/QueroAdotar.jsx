import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Instância do Axios
import PetCard from '../components/PetCard';
import { Search, Heart } from 'lucide-react';

const QueroAdotar = () => {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await api.get('/pets');
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets from API: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const handleFilterType = (type) => {
    setSelectedType(type);
  };

  const filteredPets = pets.filter((pet) => {
    const matchesSearch = pet.name.toLowerCase().includes(search.toLowerCase()) || 
                          pet.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'Todos' || pet.type === selectedType;
    const isAvailable = pet.status === 'Disponível';
    return matchesSearch && matchesType && isAvailable;
  });

  return (
    <div className="container my-5">
      {/* Cabeçalho de Alerta (Campanha de adoção) */}
      <div className="alert alert-info py-4 px-5 mb-5 rounded" style={{ borderLeft: '5px solid #17a2b8' }}>
        <h1 className="h1c mb-3 font-weight-bold" style={{ fontFamily: 'var(--font-title)' }}>
          Campanha de adoção
        </h1>
        <p className="lead mb-2" style={{ fontSize: '1.1rem' }}>
          No Cafofo dos Peludos, acreditamos que cada animal merece uma chance de ser amado. Somos um abrigo
          dedicado a acolher aqueles que não tiveram um começo fácil, mas que, com o apoio de pessoas como
          você, podem encontrar um novo lar e um futuro cheio de carinho.
        </p>
        <p className="lead mb-0" style={{ fontSize: '1.1rem' }}>
          Nosso objetivo é criar um mundo onde todos os animais tenham um lar seguro e cheio de amor. Junte-se a nós nessa missão!
        </p>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5">
        <h3 className="mb-3 mb-md-0 font-weight-bold" style={{ fontFamily: 'var(--font-title)' }}>
          Pets Disponíveis ({loading ? '...' : filteredPets.length})
        </h3>
        
        {/* Busca e Filtros */}
        <div className="d-flex flex-column flex-sm-row w-100 w-md-auto gap-2" style={{ maxWidth: '600px', gap: '10px' }}>
          <div className="input-group" style={{ minWidth: '220px' }}>
            <div className="input-group-prepend">
              <span className="input-group-text bg-white border-right-0" style={{ borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px' }}>
                <Search size={16} className="text-muted" />
              </span>
            </div>
            <input
              type="text"
              className="form-control border-left-0"
              style={{ borderTopRightRadius: '20px', borderBottomRightRadius: '20px' }}
              placeholder="Buscar pet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="btn-group rounded" style={{ padding: '2px', backgroundColor: '#e9ecef', borderRadius: '20px' }}>
            {['Todos', 'Cachorro', 'Gato', 'Outro'].map((type) => (
              <button
                key={type}
                type="button"
                className={`btn btn-sm px-3 ${selectedType === type ? 'btn-warning text-white' : 'btn-link text-secondary'}`}
                style={{ borderRadius: '20px', textDecoration: 'none', fontWeight: '600' }}
                onClick={() => handleFilterType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="sr-only">Carregando pets...</span>
          </div>
        </div>
      ) : filteredPets.length > 0 ? (
        <div className="row">
          {filteredPets.map((pet) => (
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4 d-flex" key={pet.id}>
              <PetCard pet={pet} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 bg-white rounded border my-5">
          <Heart size={40} className="text-muted mb-2" />
          <h4 className="text-secondary">Nenhum pet encontrado</h4>
          <p className="text-muted mb-0">Tente alterar o filtro ou buscar outro nome.</p>
        </div>
      )}
    </div>
  );
};

export default QueroAdotar;
