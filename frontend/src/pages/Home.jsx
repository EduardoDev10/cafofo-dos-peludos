import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, ShieldCheck, Award } from 'lucide-react';

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = [
    { src: '/img/1.png', alt: 'Primeiro Slide' },
    { src: '/img/2.png', alt: 'Segundo Slide' },
    { src: '/img/3.png', alt: 'Terceiro Slide' },
    { src: '/img/Banner promoção pet shop divertido amarelo.png', alt: 'Quarto Slide' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrev = (e) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      {/* Carrossel de Imagens */}
      <div id="carouselExampleIndicators" className="carousel slide" style={{ position: 'relative' }}>
        <div className="carousel-indicators" style={{ zIndex: 15 }}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={activeIndex === idx ? 'active' : ''}
              aria-current={activeIndex === idx ? 'true' : 'false'}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setActiveIndex(idx)}
              style={{
                width: '30px',
                height: '4px',
                margin: '0 4px',
                border: 'none',
                backgroundColor: activeIndex === idx ? 'var(--primary-color)' : '#ffffff',
                opacity: activeIndex === idx ? 1 : 0.5,
                transition: 'opacity 0.6s ease, background-color 0.6s ease',
                borderRadius: '2px'
              }}
            ></button>
          ))}
        </div>
        <div className="carousel-inner">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`carousel-item ${activeIndex === idx ? 'active' : ''}`}
            >
              <img 
                className="d-block w-100" 
                src={slide.src} 
                alt={slide.alt} 
              />
            </div>
          ))}
        </div>
        <button 
          className="carousel-control-prev" 
          type="button"
          onClick={handlePrev}
          style={{ border: 'none', background: 'none' }}
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button 
          className="carousel-control-next" 
          type="button"
          onClick={handleNext}
          style={{ border: 'none', background: 'none' }}
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Próximo</span>
        </button>
      </div>

      {/* Informações Principais */}
      <div className="container mt-5 py-4">
        <div className="t1 text-center max-width-800 mx-auto px-3">
          <h2 className="display-4 text-warning mb-4" style={{ fontFamily: 'var(--font-title)' }}>
            Conheça o Cafofo peludo
          </h2>
          <p className="lead text-secondary" style={{ lineHeight: '1.8', fontSize: '1.15rem' }}>
            A ONG de adoção de animais tem como principal objetivo resgatar, cuidar e promover a adoção responsável
            de animais abandonados ou em situação de risco. Seu trabalho envolve a recuperação de animais em condições
            precárias, como aqueles vítimas de maus-tratos ou que vivem nas ruas, oferecendo tratamento veterinário,
            alimentação, abrigo e amor. Além disso, a ONG realiza campanhas de conscientização sobre a importância da
            adoção responsável, evitando o abandono e incentivando a esterilização. Por meio de parcerias com voluntários,
            empresas e outras organizações, a ONG facilita a conexão entre animais e novas famílias, garantindo um lar
            seguro e amoroso para os pets.
          </p>
        </div>
      </div>

      {/* Cards explicativos do processo de adoção */}
      <div className="container my-5">
        <div className="row justify-content-center">
          {/* Etapa 1: Encontrar um Pet */}
          <div className="col-md-4 mb-4 d-flex">
            <div className="card-custom">
              <img src="/img/adotar1.png" alt="Ache seu amiguinho" />
              <div className="card-custom-body">
                <h5 className="card-custom-title d-flex align-items-center">
                  <Search size={20} className="me-2 text-warning" /> Ache seu amiguinho
                </h5>
                <p className="card-custom-text">
                  Adotar um animalzinho é um gesto de carinho e responsabilidade. Antes de decidir, avalie se você
                  tem condições de cuidar dele. Procure abrigos ou ONGs e visite os animais disponíveis. Escolha
                  com atenção, considerando o temperamento e as necessidades do pet.
                </p>
              </div>
              <div className="card-custom-footer">
                Confira a lista de animais <Link to="/quero-adotar" className="font-weight-bold text-info">aqui</Link>.
              </div>
            </div>
          </div>

          {/* Etapa 2: Formulário de Interesse */}
          <div className="col-md-4 mb-4 d-flex">
            <div className="card-custom">
              <img src="/img/adocao.png" alt="Formulário de interesse" />
              <div className="card-custom-body">
                <h5 className="card-custom-title d-flex align-items-center">
                  <Heart size={20} className="me-2 text-danger" /> Formulário de interesse
                </h5>
                <p className="card-custom-text">
                  Se você está pensando em adotar um pet, o primeiro passo é preencher o formulário de adoção.
                  Esse formulário ajuda os abrigos a entender melhor seu perfil e garantir que você está pronto
                  para assumir a responsabilidade de cuidar de um animal.
                </p>
              </div>
              <div className="card-custom-footer">
                Confira o nosso formulário <Link to="/quero-adotar" className="font-weight-bold text-info">aqui</Link>.
              </div>
            </div>
          </div>

          {/* Etapa 3: Adoção Finalizada */}
          <div className="col-md-4 mb-4 d-flex">
            <div className="card-custom">
              <img src="/img/formularioa2.png" alt="Adoção finalizada" />
              <div className="card-custom-body">
                <h5 className="card-custom-title d-flex align-items-center">
                  <ShieldCheck size={20} className="me-2 text-success" /> Adoção finalizada
                </h5>
                <p className="card-custom-text">
                  A adoção do seu novo amigo está completa e agora vocês começam uma jornada de muitos momentos especiais
                  juntos. Agradecemos por escolher adotar e por oferecer um lar cheio de amor e cuidado. Seu gesto faz
                  toda a diferença!
                </p>
              </div>
              <div className="card-custom-footer">
                <span className="text-success font-weight-bold">Parabéns!!!!!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aviso sobre taxas e custos */}
      <div className="container text-center my-4">
        <p className="p2 p-3 bg-white rounded border" style={{ fontStyle: 'italic' }}>
          Algumas ONGs e protetores parceiros podem solicitar a cobrança de uma taxa no momento da adoção, com a finalidade
          de auxílio de custos. Esta cobrança / recebimento é realizada diretamente entre o adotante e a ONG/protetor parceiro.
        </p>
      </div>

      {/* Seção de Vídeo Educativo */}
      <div className="container mb-5">
        <div className="video-section">
          <div className="video-list">
            <div className="alert alert-info py-2 px-3 mb-4 rounded d-flex align-items-center">
              <Award size={24} className="me-2 text-info" />
              <h4 className="mb-0" style={{ fontFamily: 'var(--font-title)' }}>Por que adotar?</h4>
            </div>
            <ol>
              <li><strong>Salva vidas:</strong> Ao adotar, você dá uma nova chance de vida a um animal que precisa de um lar.</li>
              <li><strong>Combate ao abandono:</strong> Adoção reduz a quantidade de animais abandonados nas ruas e em abrigos.</li>
              <li><strong>Companheirismo e amor:</strong> Animais adotados geralmente são muito gratos e oferecem amor incondicional.</li>
              <li><strong>Custo mais baixo:</strong> Adoção geralmente envolve custos menores em comparação à compra de um pet de criador.</li>
              <li><strong>Ajuda a controlar a superpopulação:</strong> Adotar, em vez de comprar, contribui para controlar a população.</li>
              <li><strong>Adoção consciente:</strong> Evita o financiamento de criadores irresponsáveis e incentiva a posse responsável.</li>
              <li><strong>Benefícios emocionais:</strong> Ter um pet pode diminuir o estresse, ansiedade e aumentar a felicidade geral.</li>
            </ol>
          </div>
          <div>
            <iframe
              width="500"
              height="315"
              src="https://www.youtube.com/embed/4FlvZPHrFlc?si=iDHIaN7p9NS2ScVm"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="rounded shadow"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
