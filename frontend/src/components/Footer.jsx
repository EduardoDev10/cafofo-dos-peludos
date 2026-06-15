import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <p className="mb-1">© {new Date().getFullYear()} Cafofo dos Peludos. Todos os direitos reservados.</p>
        <p className="mb-0">
          Entre em contato:{' '}
          <a href="mailto:CafofoDosPeludos@gmail.com">CafofoDosPeludos@gmail.com</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
