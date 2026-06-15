import React, { useState } from 'react';
import api from '../services/api'; // Instância do Axios
import { Smile, Send } from 'lucide-react';

const SejaVoluntario = () => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [idade, setIdade] = useState('18');
  const [endereco, setEndereco] = useState('');
  const [tempoDisponivel, setTempoDisponivel] = useState('Manhã');
  const [genero, setGenero] = useState('Homem');
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validações
    if (!nome.trim() || !telefone.trim() || !email.trim() || !endereco.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Formato de e-mail inválido.');
      setLoading(false);
      return;
    }

    // Salva o voluntário enviando os dados para a API do backend
    try {
      await api.post('/volunteers', {
        name: nome,
        phone: telefone,
        email,
        age: idade,
        address: endereco,
        timeOfDay: tempoDisponivel,
        gender: genero
      });

      setIsSubmitted(true);
    } catch (e) {
      console.error("Error adding volunteer via API: ", e);
      setError('Erro ao enviar inscrição. Verifique se a API do backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container text-center my-5 py-5" style={{ minHeight: '60vh' }}>
        <div className="card shadow-lg p-5 mx-auto border-0" style={{ maxWidth: '650px', borderRadius: '16px' }}>
          <h1 className="text-warning font-weight-bold mb-4" style={{ fontFamily: 'var(--font-title)' }}>
            Inscrição Confirmada!
          </h1>
          <img
            src="/img/joia2.jpg"
            alt="Sucesso"
            className="img-fluid rounded mb-4 shadow-sm"
            style={{ maxHeight: '250px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = '/img/logo1.png';
            }}
          />
          <h2 className="h4 text-success mb-3">Sua inscrição foi realizada com sucesso!</h2>
          <p className="text-secondary mb-4">
            Ficamos felizes que você tenha decidido ser voluntário. Nossa equipe entrará em contato com você em breve para os próximos passos.
          </p>
          <p className="text-muted mb-4">Enquanto isso, se tiver dúvidas ou precisar de mais informações, não hesite em nos contatar.</p>
          <button onClick={() => setIsSubmitted(false)} className="btn btn-primary-cafofo px-4">
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* Banner de Título com Alerta */}
      <div className="alert alert-info py-3 px-4 mb-5 rounded" style={{ borderLeft: '5px solid #17a2b8' }}>
        <h1 className="h1qf mb-0 font-weight-bold" style={{ fontFamily: 'var(--font-title)', fontSize: '2rem' }}>
          Quer ser nosso parceiro?
        </h1>
      </div>

      <div className="row">
        {/* Coluna de Informações */}
        <div className="col-lg-6 mb-5 pr-lg-5">
          <div className="p1" style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-dark)' }}>
            <p>
              O objetivo do programa Cafofo dos Peludos é proporcionar uma segunda chance para animais abandonados,
              oferecendo-lhes um novo lar, amor e cuidados adequados. Esses programas visam conectar pessoas
              responsáveis com animais que precisam de um lar seguro, ajudando a reduzir a superpopulação de animais
              em abrigos e nas ruas.
            </p>
            <p>
              Além disso, eles promovem a conscientização sobre a importância da adoção responsável, incentivando a
              esterilização e combatendo o abandono. Ao adotar um pet, os adotantes não apenas salvam vidas, mas
              também ganham um companheiro fiel, contribuindo para uma sociedade mais solidária e ética em relação
              aos animais.
            </p>
            <p>
              A adoção de pets também oferece benefícios emocionais aos humanos, como redução do estresse e aumento do
              bem-estar, criando um vínculo de amor e confiança.
            </p>
            <div className="bg-light p-3 rounded border border-warning mt-4 d-flex align-items-center">
              <Smile size={36} className="text-warning mr-3" />
              <div>
                <h5 className="mb-1 text-warning" style={{ fontFamily: 'var(--font-title)' }}>Seja a diferença!</h5>
                <p className="small mb-0 text-secondary">Preencha o formulário ao lado e junte-se ao nosso time de voluntários.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna do Formulário */}
        <div className="col-lg-6">
          <div className="card shadow border-0 p-4" style={{ borderRadius: '16px', background: '#fff' }}>
            <h3 className="text-warning mb-4 font-weight-bold text-center" style={{ fontFamily: 'var(--font-title)' }}>
              Seja Nosso Voluntário!!!
            </h3>

            {error && <div className="alert alert-danger py-2 px-3 rounded mb-3">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6 form-group-custom">
                  <label className="font-weight-bold">Nome</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="Nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="col-md-6 form-group-custom">
                  <label className="font-weight-bold">Telefone</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="(00) 00000-0000"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group-custom mb-3">
                <label className="font-weight-bold">Endereço de E-mail</label>
                <input
                  type="email"
                  className="form-control-custom"
                  placeholder="nome@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="row mb-3">
                <div className="col-md-6 form-group-custom">
                  <label className="font-weight-bold">Selecione sua Idade</label>
                  <select
                    className="form-control-custom"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                    disabled={loading}
                  >
                    {[18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 'Mais de 30', 'Mais de 45', 'Mais de 60'].map(
                      (age) => (
                        <option key={age} value={age}>
                          {age}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="col-md-6 form-group-custom">
                  <label className="font-weight-bold">Gênero</label>
                  <select
                    className="form-control-custom"
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                    disabled={loading}
                  >
                    <option value="Homem">Homem</option>
                    <option value="Mulher">Mulher</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="form-group-custom mb-3">
                <label className="font-weight-bold">Endereço</label>
                <input
                  type="text"
                  className="form-control-custom"
                  placeholder="Rua, número, bairro..."
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group mb-4">
                <label className="font-weight-bold d-block mb-2">Tempo disponível</label>
                <div className="d-flex gap-4" style={{ gap: '15px', flexWrap: 'wrap' }}>
                  {['Manhã', 'Tarde', 'Noite'].map((time) => {
                    const isSelected = tempoDisponivel === time;
                    return (
                      <div 
                        className="form-check p-2 px-3 rounded d-inline-flex align-items-center" 
                        style={{ 
                          backgroundColor: isSelected ? '#d97706' : '#ffffff', 
                          color: isSelected ? '#ffffff' : 'var(--text-dark)',
                          border: isSelected ? '2px solid #d97706' : '2px solid #d1d5db',
                          cursor: 'pointer', 
                          transition: 'all 0.25s ease',
                          fontWeight: '600'
                        }} 
                        key={time}
                        onClick={() => !loading && setTempoDisponivel(time)}
                      >
                        <input
                          className="form-check-input position-static m-0 mr-2"
                          type="radio"
                          name="timeRadio"
                          id={`radio-${time}`}
                          value={time}
                          checked={isSelected}
                          onChange={() => setTempoDisponivel(time)}
                          disabled={loading}
                          style={{ cursor: 'pointer' }}
                        />
                        <label className="form-check-label mb-0" htmlFor={`radio-${time}`} style={{ cursor: 'pointer', userSelect: 'none', paddingLeft: '5px' }}>
                          {time}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-warning btn-block text-white py-2 d-flex align-items-center justify-content-center"
                style={{ borderRadius: '8px', fontWeight: 'bold' }}
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner-border spinner-border-sm text-white" role="status">
                    <span className="sr-only">Enviando...</span>
                  </div>
                ) : (
                  <>
                    <Send size={16} className="me-2" /> Enviar Inscrição
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SejaVoluntario;
