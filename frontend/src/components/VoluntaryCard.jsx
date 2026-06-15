import React from 'react';
import { Mail, Phone, Calendar, MapPin, Clock, Edit2, Trash2, User } from 'lucide-react';

const VoluntaryCard = ({ volunteer, onEdit, onDelete }) => {
  return (
    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px', overflow: 'hidden' }}>
      <div className="card-header bg-light d-flex align-items-center justify-content-between border-0 py-3 px-4">
        <div className="d-flex align-items-center">
          <div 
            className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center me-3" 
            style={{ width: '40px', height: '40px', fontWeight: 'bold', fontSize: '1.1rem' }}
          >
            {volunteer.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h5 className="mb-0 font-weight-bold" style={{ fontSize: '1.1rem', fontFamily: 'var(--font-title)' }}>
              {volunteer.name}
            </h5>
            <span className="small text-muted">{volunteer.gender}</span>
          </div>
        </div>
      </div>
      <div className="card-body p-4">
        <ul className="list-unstyled mb-0" style={{ fontSize: '0.92rem' }}>
          <li className="d-flex align-items-center mb-2">
            <Mail size={16} className="text-secondary me-2" />
            <span className="text-secondary">{volunteer.email}</span>
          </li>
          <li className="d-flex align-items-center mb-2">
            <Phone size={16} className="text-secondary me-2" />
            <span className="text-secondary">{volunteer.phone}</span>
          </li>
          <li className="d-flex align-items-center mb-2">
            <Calendar size={16} className="text-secondary me-2" />
            <span className="text-secondary">{volunteer.age} anos</span>
          </li>
          <li className="d-flex align-items-center mb-2">
            <MapPin size={16} className="text-secondary me-2" />
            <span className="text-secondary text-truncate" title={volunteer.address}>
              {volunteer.address}
            </span>
          </li>
          <li className="d-flex align-items-center mb-4">
            <Clock size={16} className="text-secondary me-2" />
            <span className="text-secondary">
              Período: {volunteer.timeOfDay}
            </span>
          </li>
        </ul>

        <div className="d-flex justify-content-end border-top pt-3" style={{ gap: '10px' }}>
          <button className="btn btn-sm btn-outline-info d-flex align-items-center" onClick={() => onEdit(volunteer)}>
            <Edit2 size={12} className="me-1" /> Editar
          </button>
          <button className="btn btn-sm btn-outline-danger d-flex align-items-center" onClick={() => onDelete(volunteer.id)}>
            <Trash2 size={12} className="me-1" /> Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoluntaryCard;
