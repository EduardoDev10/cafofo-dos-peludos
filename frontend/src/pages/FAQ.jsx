import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: 'Como posso ajudar a ONG?',
      answer: 'Você pode ajudar de diversas formas, como fazendo doações, adotando um animal, sendo voluntário ou ajudando a divulgar nosso trabalho.',
    },
    {
      question: 'Quais são os requisitos para adotar um animal?',
      answer: 'Para adotar, você precisa ser maior de 18 anos, ter uma residência adequada, segura (de preferência telada para gatos e com portão seguro para cães) e estar disposto a cuidar do animal com responsabilidade por toda a sua vida.',
    },
    {
      question: 'Onde posso fazer uma doação?',
      answer: 'Você pode fazer doações financeiras via Pix diretamente na nossa sede ou apoiar doando ração, cobertores, produtos de limpeza e medicamentos veterinários.',
    },
    {
      question: 'Posso ser voluntário? Como me inscrevo?',
      answer: 'Sim! Basta acessar a nossa página de "Seja voluntário", preencher o formulário informando seus horários e interesses e aguardar o contato de nossa equipe de coordenação.',
    },
  ];

  const toggleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className="container my-5" style={{ minHeight: '60vh' }}>
      <div className="text-center mb-5">
        <HelpCircle size={48} className="text-warning mb-2" />
        <h1 className="display-4 text-warning" style={{ fontFamily: 'var(--font-title)' }}>
          FAQ - Como Ajudar?
        </h1>
        <p className="lead text-secondary">Tire suas dúvidas e saiba como colaborar com o Cafofo dos Peludos.</p>
      </div>

      <div className="max-width-800 mx-auto" style={{ maxWidth: '750px' }}>
        {faqData.map((item, index) => (
          <div
            key={index}
            className="card mb-3 shadow-sm border-0"
            style={{ borderRadius: '12px', overflow: 'hidden' }}
          >
            <div
              className="card-header bg-white d-flex justify-content-between align-items-center py-3"
              style={{ cursor: 'pointer' }}
              onClick={() => toggleAccordion(index)}
            >
              <h5 className="mb-0 text-dark font-weight-bold" style={{ fontSize: '1.1rem' }}>
                {item.question}
              </h5>
              {activeIndex === index ? (
                <ChevronUp className="text-warning" size={20} />
              ) : (
                <ChevronDown className="text-warning" size={20} />
              )}
            </div>
            {activeIndex === index && (
              <div className="card-body bg-light border-top">
                <p className="mb-0 text-secondary" style={{ lineHeight: '1.6' }}>
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
