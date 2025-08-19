// src/pages/ui/ReasonModal.tsx
import React from 'react';

interface Reason {
  id: number;
  name: string;
  description?: string;
}

interface ReasonModalProps {
  reasons: Reason[];
  onConfirm: (reasonId: number, note: string) => void;
  onCancel: () => void;
}

const ReasonModal: React.FC<ReasonModalProps> = ({ reasons, onConfirm, onCancel }) => {
  const [selectedReasonId, setSelectedReasonId] = React.useState<number | ''>('');
  const [note, setNote] = React.useState('');

  const handleSubmit = () => {
    if (selectedReasonId === '') {
      alert('Selecione um motivo');
      return;
    }
    onConfirm(Number(selectedReasonId), note);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        width: '400px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <h3 style={{ marginBottom: '16px' }}>Motivo da Movimentação</h3>
        <p style={{ fontSize: '0.9em', color: '#555', marginBottom: '12px' }}>
          Para garantir rastreabilidade, selecione o motivo do movimento:
        </p>

        <select
          value={selectedReasonId}
          onChange={(e) => setSelectedReasonId(e.target.value === '' ? '' : Number(e.target.value))}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1em',
          }}
        >
          <option value="">Selecione um motivo</option>
          {reasons.map((reason) => (
            <option key={reason.id} value={reason.id}>
              {reason.name}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Observação (opcional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            minHeight: '80px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1em',
            marginBottom: '16px',
          }}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ccc',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '8px 16px',
              backgroundColor: '#005fcc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReasonModal;