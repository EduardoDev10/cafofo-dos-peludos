import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Tag } from 'lucide-react';

const PetCard = ({ pet }) => {
  return (
    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img
          src={pet.photo || '/img/logo1.png'}
          className="card-img-top"
          alt={`Foto de ${pet.name}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = '/img/logo1.png';
          }}
        />
        <span
          className={`badge ${pet.type === 'Cachorro' ? 'badge-pet-cachorro' : pet.type === 'Gato' ? 'badge-pet-gato' : 'badge-pet-outro'} position-absolute`}
          style={{ top: '10px', right: '10px', padding: '0.5rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}
        >
          <Tag size={12} className="me-1" /> {pet.type}
        </span>
      </div>
      <div className="card-body d-flex flex-column p-4">
        <h5 className="card-title font-weight-bold mb-1" style={{ fontSize: '1.4rem', fontFamily: 'var(--font-title)' }}>
          {pet.name}
        </h5>
        <div className="text-muted d-flex align-items-center mb-2" style={{ fontSize: '0.85rem' }}>
          <span className="font-weight-bold me-2">{pet.age}</span>
          <span className="me-2">•</span>
          <MapPin size={14} className="text-danger me-1" /> {pet.city || 'Brasília DF'}
        </div>
        <p className="card-text text-secondary mb-4" style={{ fontSize: '0.92rem', lineHeight: '1.5', flexGrow: '1' }}>
          {pet.description}
        </p>
        <Link
          to={`/quero-adotar/declaracao?petId=${pet.id}`}
          className="btn btn-info btn-block d-flex align-items-center justify-content-center"
          style={{ borderRadius: '20px', fontFamily: 'var(--font-title)', fontWeight: '600' }}
        >
          <Heart size={16} className="me-2" /> Quero Adotar
        </Link>
      </div>
    </div>
  );
};

export default PetCard;
