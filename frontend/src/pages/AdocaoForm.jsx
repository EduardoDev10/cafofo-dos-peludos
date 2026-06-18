import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api'; // Instância do Axios
import { FileText, ArrowRight, ArrowLeft, Heart } from 'lucide-react';

const AdocaoForm = () => {
  const [searchParams] = useSearchParams();
  const petIdFromQuery = searchParams.get('petId');

  // Controle de etapas do formulário multi-etapas
  const [step, setStep] = useState(1); // 1: Termo/Declaração, 2: Dados Pessoais, 3: Motivação, 4: Sucesso
  const [selectedPet, setSelectedPet] = useState(null);
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [endereco2, setEndereco2] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('Escolher...');
  const [cep, setCep] = useState('');
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await api.get('/pets');
        const petsList = response.data;
        setPets(petsList);

        if (petIdFromQuery) {
          const pet = petsList.find((p) => p.id === petIdFromQuery);
          if (pet) {
            setSelectedPet(pet);
          }
        }
      } catch (e) {
        console.error("Error loading pets in Adoption form: ", e);
      }
    };
    fetchPets();
  }, [petIdFromQuery]);

  const handleNextStep = () => {
    setError('');

    if (step === 1) {
      if (!selectedPet) {
        setError('Por favor, selecione um pet para adotar.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!nome.trim() || !sobrenome.trim() || !email.trim() || !telefone.trim() || !endereco.trim() || !cidade.trim() || estado === 'Escolher...' || !cep.trim()) {
        setError('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Formato de e-mail inválido.');
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!motivo.trim()) {
      setError('Por favor, descreva o motivo da sua adoção.');
      setLoading(false);
      return;
    }

    // Salva a solicitação de adoção via API do backend
    try {
      await api.post('/adoptions', {
        petId: selectedPet.id,
        adopterName: nome,
        adopterLastName: sobrenome,
        email,
        phone: telefone,
        address: endereco,
        address2: endereco2,
        city: cidade,
        state: estado,
        cep,
        reason: motivo,
        status: 'Pendente'
      });

      setStep(4);
    } catch (e) {
      console.error("Error adding adoption via API: ", e);
      setError('Erro ao enviar solicitação. Verifique se a API do backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  // Renderiza a Etapa 1: Declaração / Termo
  const renderStep1 = () => (
    <div className="interesse text-center mx-auto" style={{ maxWidth: '800px', margin: '40px auto' }}>
      <h2 className="text-warning mb-4" style={{ fontFamily: 'var(--font-title)' }}>Interessado em Adotar um Peludo?</h2>
      
      {/* Seletor de pet caso não tenha sido pré-selecionado */}
      {!petIdFromQuery && (
        <div className="form-group text-left mb-4 bg-white p-3 rounded border">
          <label className="font-weight-bold">Selecione o Peludinho:</label>
          <select 
            className="form-control" 
            value={selectedPet ? selectedPet.id : ''} 
            onChange={(e) => {
              const pet = pets.find(p => p.id === e.target.value);
              setSelectedPet(pet);
            }}
          >
            <option value="">-- Escolha um pet --</option>
            {pets.filter(p => p.status === 'Disponível').map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.type} - {p.age})</option>
            ))}
          </select>
        </div>
      )}

      {selectedPet && (
        <div className="card mb-4 border-warning shadow-sm mx-auto" style={{ maxWidth: '500px', borderRadius: '12px' }}>
          <div className="row no-gutters align-items-center">
            <div className="col-4">
              <img src={selectedPet.photo} alt={selectedPet.name} className="img-fluid rounded-left" style={{ height: '120px', objectFit: 'cover', width: '100%' }} />
            </div>
            <div className="col-8 text-left p-3">
              <span className="small text-muted">Você está iniciando a adoção de:</span>
              <h4 className="mb-0 text-warning font-weight-bold" style={{ fontFamily: 'var(--font-title)' }}>{selectedPet.name}</h4>
              <p className="small mb-0 text-secondary">{selectedPet.type} • {selectedPet.age}</p>
            </div>
          </div>
        </div>
      )}

      <p className="text-secondary text-justify mb-5" style={{ fontSize: '1.02rem', lineHeight: '1.7' }}>
        Que alegria receber o seu interesse em adotar um dos nossos adoráveis peludinhos! Cada um deles espera
        ansiosamente por um novo lar, e ficamos muito felizes em saber que você está disposto a proporcionar
        um futuro melhor para um animalzinho carente.
        <br /><br />
        A adoção de um pet é um ato de amor e responsabilidade. Ao adotar, você não só ganha um novo amigo, mas
        também assume o compromisso de cuidar dele por toda a vida — oferecendo alimentação, atenção, carinho e,
        principalmente, saúde. Queremos garantir que você esteja bem preparado para essa nova jornada.
        <br /><br />
        Para que possamos conhecer melhor suas intenções, por favor, leia o termo de compromisso e preencha as
        informações a seguir.
      </p>

      {error && <div className="alert alert-danger py-2 px-3 rounded mb-4">{error}</div>}

      {/* Botão que abre a modal de termos */}
      <button 
        type="button" 
        className="btn btn-warning text-white px-5 py-2 font-weight-bold" 
        style={{ borderRadius: '25px', fontFamily: 'var(--font-title)', fontSize: '1.2rem' }}
        onClick={() => setShowModal(true)}
      >
        Ler Termo e Continuar
      </button>

      {/* Modal Controlada por React */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content text-left border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <div className="modal-header bg-light">
                <h5 className="modal-title font-weight-bold text-warning" style={{ fontFamily: 'var(--font-title)' }}>
                  Termo de Declaração para Adoção
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Fechar"></button>
              </div>
              <div className="modal-body text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                <p><strong>1. Responsabilidade pela Adoção:</strong> Você assume total responsabilidade pelo bem-estar do animal, garantindo um lar adequado e cuidando de sua saúde, alimentação e necessidades.</p>
                <p><strong>2. Cuidados Veterinários:</strong> Você se compromete a fornecer ao animal atendimento veterinário regular, incluindo vacinas, vermifugação, castração e qualquer outro cuidado necessário para sua saúde e segurança.</p>
                <p><strong>3. Compromisso a Longo Prazo:</strong> A adoção de um animal envolve um compromisso de longo prazo, e você se compromete a manter o animal durante toda sua vida, salvo em casos de extrema impossibilidade.</p>
                <p><strong>4. Condições de Adoção:</strong> Você está ciente de que pode ser necessário cumprir requisitos adicionais para a adoção, como visita domiciliar ou assinatura de termos de compromisso.</p>
                <p><strong>5. Devolução e Recolocação:</strong> Caso, em algum momento, você não possa mais cuidar do animal, você se compromete a devolvê-lo à instituição de adoção para que possamos recolocá-lo de forma segura.</p>
              </div>
              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-secondary" style={{ borderRadius: '20px' }} onClick={() => setShowModal(false)}>Fechar</button>
                <button 
                  type="button" 
                  className="btn btn-warning text-white" 
                  style={{ borderRadius: '20px' }} 
                  onClick={() => {
                    setShowModal(false);
                    handleNextStep();
                  }}
                >
                  Aceitar e Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Renderiza a Etapa 2: Dados Pessoais (form1)
  const renderStep2 = () => (
    <div className="form-container-custom">
      <h2 style={{ fontFamily: 'var(--font-title)' }}>Queremos saber mais sobre você</h2>
      <p className="text-muted text-center mb-4">Passo 2 de 3: Informações de Contato e Endereço</p>

      {error && <div className="alert alert-danger py-2 px-3 rounded mb-3">{error}</div>}

      <div className="row">
        <div className="col-md-6 form-group-custom">
          <label className="font-weight-bold">Nome *</label>
          <input
            type="text"
            className="form-control-custom"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6 form-group-custom">
          <label className="font-weight-bold">Sobrenome *</label>
          <input
            type="text"
            className="form-control-custom"
            placeholder="Sobrenome"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 form-group-custom">
          <label className="font-weight-bold">E-mail *</label>
          <input
            type="email"
            className="form-control-custom"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6 form-group-custom">
          <label className="font-weight-bold">Telefone/WhatsApp *</label>
          <input
            type="text"
            className="form-control-custom"
            placeholder="(00) 00000-0000"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group-custom">
        <label className="font-weight-bold">Endereço *</label>
        <input
          type="text"
          className="form-control-custom"
          placeholder="Rua, número, bairro..."
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          required
        />
      </div>

      <div className="form-group-custom">
        <label className="font-weight-bold">Endereço 2</label>
        <input
          type="text"
          className="form-control-custom"
          placeholder="Apartamento, casa, bloco, ponto de referência (opcional)"
          value={endereco2}
          onChange={(e) => setEndereco2(e.target.value)}
        />
      </div>

      <div className="row">
        <div className="col-md-6 form-group-custom">
          <label className="font-weight-bold">Cidade *</label>
          <input
            type="text"
            className="form-control-custom"
            placeholder="Ex: Brasília"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            required
          />
        </div>
        <div className="col-md-3 form-group-custom">
          <label className="font-weight-bold">Estado *</label>
          <select
            className="form-control-custom"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
          >
            <option disabled value="Escolher...">Escolher...</option>
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
          />
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button type="button" className="btn btn-secondary d-flex align-items-center" style={{ borderRadius: '20px' }} onClick={handlePrevStep}>
          <ArrowLeft size={16} className="me-2" /> Voltar
        </button>
        <button type="button" className="btn btn-warning text-white d-flex align-items-center" style={{ borderRadius: '20px', fontWeight: 'bold' }} onClick={handleNextStep}>
          Próximo <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );

  // Renderiza a Etapa 3: Motivação (form2)
  const renderStep3 = () => (
    <div className="form-container-custom">
      <h2 style={{ fontFamily: 'var(--font-title)' }}>Explique por que você deseja adotar um animal</h2>
      <p className="text-muted text-center mb-4">Passo 3 de 3: Motivação da Adoção</p>

      {error && <div className="alert alert-danger py-2 px-3 rounded mb-3">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-4">
          <textarea
            className="form-control-custom"
            placeholder="Escreva aqui sobre sua rotina, sua experiência com pets e por que escolheu adotar o peludinho..."
            rows="6"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
            disabled={loading}
          ></textarea>
        </div>

        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary d-flex align-items-center" style={{ borderRadius: '20px' }} onClick={handlePrevStep} disabled={loading}>
            <ArrowLeft size={16} className="me-2" /> Voltar
          </button>
          <button type="submit" className="btn btn-warning text-white d-flex align-items-center" style={{ borderRadius: '20px', fontWeight: 'bold' }} disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm text-white me-2" role="status" aria-hidden="true"></span>
            ) : null}
            Enviar Solicitação <FileText size={16} className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );

  // Renderiza a Etapa 4: Sucesso (fim)
  const renderStep4 = () => (
    <div className="container text-center my-5 py-5" style={{ minHeight: '60vh' }}>
      <div className="card shadow-lg p-5 mx-auto border-0" style={{ maxWidth: '650px', borderRadius: '16px' }}>
        <h1 className="text-warning font-weight-bold mb-4" style={{ fontFamily: 'var(--font-title)' }}>
          Pedido de Adoção Confirmado!
        </h1>
        <img
          src="/img/fim.jpg"
          alt="Pedido de Adoção Confirmado"
          className="img-fluid rounded mb-4 shadow-sm"
          style={{ maxHeight: '250px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = '/img/logo1.png';
          }}
        />
        <h2 className="h4 text-success mb-3">Seu pedido de adoção foi realizado com sucesso!</h2>
        <p className="text-secondary mb-4">
          Ficamos felizes que você tenha decidido adotar um pet. Nossa equipe entrará em contato com você em breve para os próximos passos.
        </p>
        <p className="text-muted mb-4">Enquanto isso, se tiver dúvidas ou precisar de mais informações, não hesite em nos contatar.</p>
        <Link to="/" className="btn btn-primary-cafofo px-4 d-inline-flex align-items-center justify-content-center">
          Voltar para o Início
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container my-5">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </div>
  );
};

export default AdocaoForm;
